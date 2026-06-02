#!/usr/bin/env node
/**
 * fix-internal-links.mjs
 * Inyecta enlaces internos en artículos ya publicados sin usar IA.
 * Busca en el texto frases que coincidan con keywords/títulos de otros artículos
 * y añade el <a href> correspondiente.
 *
 * Uso: node scripts/fix-internal-links.mjs
 *      node scripts/fix-internal-links.mjs --dry-run   (solo muestra cambios, no guarda)
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// ─── Config ──────────────────────────────────────────────────────────────────
const DRY_RUN = process.argv.includes('--dry-run')
const MAX_LINKS_PER_ARTICLE = 3   // máx links nuevos a inyectar por artículo
const MIN_PHRASE_LENGTH = 5       // ignorar frases muy cortas (evita falsos positivos)
const SITE_URL = 'https://setupoficina.es'

// ─── Load .env.local ─────────────────────────────────────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dir, '..', '.env.local')
const env = {}
for (const line of readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.match(/^([^#=]+)=(.*)$/)
  if (m) env[m[1].trim()] = m[2].trim()
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

// ─── Helpers ─────────────────────────────────────────────────────────────────
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Genera frases candidatas a enlazar desde un artículo (keyword + variaciones del título).
 * Ordena por longitud desc para que las frases más específicas tengan prioridad.
 */
function buildPhrases(article) {
  const phrases = new Set()

  // 1. focus_keyword tal cual
  if (article.focus_keyword?.length >= MIN_PHRASE_LENGTH) {
    phrases.add(article.focus_keyword.toLowerCase().trim())
  }

  // 2. Título limpio: quitamos año, "guía", "análisis", "completa", "2026"
  const cleanTitle = (article.title || '')
    .replace(/\b(guía|análisis|completo|completa|2026|2025|españa|cómo|cuál|qué|los|las|los mejores|las mejores)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .toLowerCase()

  if (cleanTitle.length >= MIN_PHRASE_LENGTH) phrases.add(cleanTitle)

  // 3. Primeras 3-4 palabras significativas del keyword (núcleo semántico)
  const words = (article.focus_keyword || '').toLowerCase().split(/\s+/).filter(w => w.length > 3)
  if (words.length >= 2) {
    phrases.add(words.slice(0, 3).join(' '))
    if (words.length >= 4) phrases.add(words.slice(0, 4).join(' '))
  }

  return [...phrases]
    .filter(p => p.length >= MIN_PHRASE_LENGTH)
    .sort((a, b) => b.length - a.length) // más largo primero
}

/**
 * Inyecta hasta MAX_LINKS_PER_ARTICLE enlaces internos en el HTML.
 * - No toca texto dentro de <a>, <h1-h4>, o tags HTML
 * - Solo enlaza la primera ocurrencia de cada frase
 * - No enlaza si el artículo ya tiene ese link
 */
function injectLinks(html, candidates, currentSlug) {
  let newLinksAdded = 0

  // Slugs ya enlazados en este artículo → no duplicar
  const alreadyLinked = new Set()
  for (const m of html.matchAll(/href="[^"]*\/articulo\/([^"?#]+)/g)) {
    alreadyLinked.add(m[1])
  }

  // Filtrar candidatos: no el propio artículo, no ya enlazados
  const toLink = candidates
    .filter(c => c.slug !== currentSlug && !alreadyLinked.has(c.slug))

  if (toLink.length === 0) return { html, added: 0 }

  // Dividir HTML en partes: [texto, <tag>, texto, <tag>, ...]
  const parts = html.split(/(<[^>]*>)/g)

  // Estado: dentro de <a> o <hN> → no tocar
  const blockDepth = { a: 0, h1: 0, h2: 0, h3: 0, h4: 0 }
  const usedSlugs = new Set()

  const result = parts.map(part => {
    // Es un tag HTML
    if (/^<[^>]*>$/.test(part)) {
      const tagName = (part.match(/^<\/?([a-zA-Z][a-zA-Z0-9]*)/)?.[1] || '').toLowerCase()
      if (tagName in blockDepth) {
        blockDepth[tagName] += part.startsWith('</') ? -1 : 1
      }
      return part
    }

    // Es texto plano — comprobar si estamos bloqueados
    const blocked = Object.values(blockDepth).some(d => d > 0)
    if (blocked || newLinksAdded >= MAX_LINKS_PER_ARTICLE || !part.trim()) return part

    let text = part

    for (const { slug, phrases } of toLink) {
      if (newLinksAdded >= MAX_LINKS_PER_ARTICLE) break
      if (usedSlugs.has(slug)) continue

      for (const phrase of phrases) {
        if (newLinksAdded >= MAX_LINKS_PER_ARTICLE) break

        // Busca la frase como palabra completa (no dentro de otra palabra), case-insensitive
        const regex = new RegExp(`(?<![\\wáéíóúüñÁÉÍÓÚÜÑ])${escapeRegex(phrase)}(?![\\wáéíóúüñÁÉÍÓÚÜÑ])`, 'i')

        if (regex.test(text)) {
          let replaced = false
          text = text.replace(regex, match => {
            if (replaced) return match // solo primera ocurrencia
            replaced = true
            usedSlugs.add(slug)
            newLinksAdded++
            return `<a href="${SITE_URL}/articulo/${slug}">${match}</a>`
          })
          if (replaced) break // siguiente candidato
        }
      }
    }

    return text
  })

  return { html: result.join(''), added: newLinksAdded }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🔗 fix-internal-links — ${SITE_URL}`)
  console.log(DRY_RUN ? '🔍 MODO DRY-RUN (no se guardarán cambios)\n' : '✏️  MODO REAL (se actualizará Supabase)\n')

  // Cargar todos los artículos
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug, focus_keyword, content, category_id')
    .eq('status', 'published')

  if (error) { console.error('Error Supabase:', error); process.exit(1) }
  console.log(`📄 ${articles.length} artículos cargados\n`)

  // Construir índice de candidatos (todas las frases de todos los artículos)
  const candidates = articles.map(a => ({
    slug: a.slug,
    categoryId: a.category_id,
    phrases: buildPhrases(a),
  })).filter(c => c.phrases.length > 0)

  let totalUpdated = 0
  let totalLinksAdded = 0

  for (const article of articles) {
    if (!article.content) continue

    // Priorizar misma categoría, luego otras
    const sameCat = candidates.filter(c => c.categoryId === article.category_id && c.slug !== article.slug)
    const otherCat = candidates.filter(c => c.categoryId !== article.category_id)
    const orderedCandidates = [...sameCat, ...otherCat]

    const { html: newContent, added } = injectLinks(article.content, orderedCandidates, article.slug)

    if (added === 0) continue

    console.log(`✅ [+${added} links] ${article.title}`)

    if (!DRY_RUN) {
      const { error: updateError } = await supabase
        .from('articles')
        .update({ content: newContent })
        .eq('id', article.id)

      if (updateError) {
        console.error(`   ❌ Error actualizando ${article.slug}:`, updateError.message)
        continue
      }
    }

    totalUpdated++
    totalLinksAdded += added
  }

  console.log(`\n─────────────────────────────────────`)
  console.log(`📊 Artículos actualizados: ${totalUpdated}`)
  console.log(`🔗 Links inyectados: ${totalLinksAdded}`)
  if (DRY_RUN) console.log(`\n⚠️  Dry-run: ejecuta sin --dry-run para aplicar los cambios.`)
}

main().catch(err => { console.error(err); process.exit(1) })
