import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase/server'
import slugify from 'slugify'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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
