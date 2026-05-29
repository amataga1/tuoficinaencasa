import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase/server'
import slugify from 'slugify'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Curated Unsplash photos by topic — direct URLs, no redirect, no API key needed
const TOPIC_IMAGES: Record<string, string[]> = {
  silla: [
    'photo-1592078615290-033ee584e267',
    'photo-1541558869434-2840d308329a',
    'photo-1580480055273-228ff5388ef8',
    'photo-1555041469-a586c61ea9bc',
  ],
  escritorio: [
    'photo-1593640408182-31c228b42d1b',
    'photo-1518455027359-f3f8164ba6bd',
    'photo-1593642632559-0c6d3fc62b89',
    'photo-1611269154421-4e27233ac5c7',
  ],
  monitor: [
    'photo-1527443224154-c4a3942d3acf',
    'photo-1547082299-de196ea013d6',
    'photo-1587202372634-32705e3bf49c',
    'photo-1593642702821-c8da6771f0c6',
  ],
  iluminacion: [
    'photo-1507003211169-0a1dd7228f2d',
    'photo-1513506003901-1e6a35fb5977',
    'photo-1555041469-a586c61ea9bc',
    'photo-1586023492125-27b2c045efd7',
  ],
  teclado: [
    'photo-1587829741301-dc798b83add3',
    'photo-1618384887929-16ec33fab9ef',
    'photo-1541140532154-b024d705b90a',
    'photo-1593642702821-c8da6771f0c6',
  ],
  raton: [
    'photo-1527864550417-7fd91fc51a46',
    'photo-1587829741301-dc798b83add3',
    'photo-1593642702821-c8da6771f0c6',
    'photo-1618384887929-16ec33fab9ef',
  ],
  auricular: [
    'photo-1505740420928-5e560c06d30e',
    'photo-1558756520-22cfe5d382ca',
    'photo-1546435770-a3e426bf472b',
    'photo-1484704849700-f032a568e944',
  ],
  default: [
    'photo-1497366216548-37526070297c',
    'photo-1498050108023-c5249f4df085',
    'photo-1486312338219-ce68d2c6f44d',
    'photo-1593079831268-3381b0db4a77',
    'photo-1586023492125-27b2c045efd7',
    'photo-1611532736597-de2d4265fba3',
  ],
}

function getImageForKeyword(keyword: string): string {
  const kw = keyword.toLowerCase()
  let pool = TOPIC_IMAGES.default
  for (const [topic, imgs] of Object.entries(TOPIC_IMAGES)) {
    if (kw.includes(topic)) { pool = imgs; break }
  }
  const photoId = pool[Math.floor(Math.random() * pool.length)]
  return `https://images.unsplash.com/${photoId}?w=1200&q=80`
}

async function fetchUnsplashImage(keyword: string): Promise<string | null> {
  try {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY
    if (accessKey) {
      const q = encodeURIComponent(keyword)
      const res = await fetch(`https://api.unsplash.com/photos/random?query=${q}&orientation=landscape&client_id=${accessKey}`)
      if (res.ok) {
        const data = await res.json()
        if (data.urls?.regular) return data.urls.regular
      }
    }
    // Fallback: curated pool by keyword topic
    return getImageForKeyword(keyword)
  } catch {
    return getImageForKeyword(keyword)
  }
}

function buildPrompt(keyword: string, intent: string, categoryName: string): string {
  return `Eres un experto redactor de contenido especializado en home office y equipamiento para trabajar desde casa en España. Tu contenido es útil, original, bien documentado y está dirigido a personas reales que buscan información de calidad.

KEYWORD PRINCIPAL: "${keyword}"
INTENCIÓN DE BÚSQUEDA: ${intent}
CATEGORÍA: ${categoryName}

INSTRUCCIONES:
- Escribe un artículo completo de 1800-2400 palabras en español
- Usa un tono cercano pero profesional, como si lo escribiera un experto que también trabaja desde casa
- Incluye datos reales, consejos prácticos y experiencias concretas
- NO uses frases genéricas como "en el mundo actual" o "en los tiempos modernos"
- NO repitas la keyword de forma artificial — úsala donde encaje naturalmente
- Estructura el artículo con H2 y H3 semánticos (no los numeres)
- Incluye al menos una tabla comparativa si es relevante
- Menciona rangos de precios reales en euros (aprox. 2025-2026)
- Añade advertencias o contras donde sea honesto hacerlo

ESTRUCTURA REQUERIDA (devuelve JSON válido):
{
  "title": "Título H1 optimizado para SEO (50-65 chars, incluye keyword)",
  "slug": "slug-en-kebab-case",
  "excerpt": "Descripción de 150-160 chars que resume el artículo y por qué vale la pena leerlo",
  "meta_title": "Meta title SEO (50-60 chars)",
  "meta_description": "Meta description (145-160 chars, incluye llamada a la acción)",
  "content": "HTML completo del artículo con H2, H3, párrafos, listas, tablas. Sin el H1.",
  "faqs": [
    {"question": "Pregunta frecuente 1?", "answer": "Respuesta completa de 2-3 frases."},
    {"question": "Pregunta frecuente 2?", "answer": "Respuesta completa."},
    {"question": "Pregunta frecuente 3?", "answer": "Respuesta completa."}
  ]
}

Devuelve ÚNICAMENTE el JSON, sin explicaciones ni markdown adicional.`
}

export async function POST(request: NextRequest) {
  try {
    const { keyword, intent = 'informational', categoryId, categoryName } = await request.json()

    if (!keyword || !categoryId) {
      return NextResponse.json({ error: 'keyword y categoryId son requeridos' }, { status: 400 })
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: buildPrompt(keyword, intent, categoryName || 'Home Office'),
      }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''

    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(raw)
    } catch {
      const match = raw.match(/\{[\s\S]*\}/)
      if (!match) throw new Error('No se pudo parsear la respuesta de IA')
      parsed = JSON.parse(match[0])
    }

    const imageUrl = await fetchUnsplashImage(keyword)
    const wordCount = String(parsed.content).split(/\s+/).filter(Boolean).length
    const baseSlug = slugify(String(parsed.slug || parsed.title), { lower: true, strict: true, locale: 'es' })

    const supabase = await createServiceClient()

    // Ensure unique slug
    let slug = baseSlug
    let attempt = 0
    while (true) {
      const { data } = await supabase.from('articles').select('id').eq('slug', slug).single()
      if (!data) break
      attempt++
      slug = `${baseSlug}-${attempt}`
    }

    const { data: article, error } = await supabase
      .from('articles')
      .insert({
        title: parsed.title,
        slug,
        excerpt: parsed.excerpt,
        content: parsed.content,
        meta_title: parsed.meta_title,
        meta_description: parsed.meta_description,
        focus_keyword: keyword,
        category_id: categoryId,
        image_url: imageUrl,
        faqs: parsed.faqs,
        word_count: wordCount,
        reading_time: Math.ceil(wordCount / 200),
        status: 'pending_review',
      })
      .select('id, title, slug')
      .single()

    if (error) throw error

    // Mark keyword as in_progress
    await supabase
      .from('keywords')
      .update({ status: 'in_progress' })
      .eq('keyword', keyword)

    return NextResponse.json({ ok: true, article })

  } catch (err) {
    console.error('Generate error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
