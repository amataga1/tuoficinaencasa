import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'setupoficina-21'

export async function POST(request: NextRequest) {
  const { adminSecret, articleId } = await request.json()

  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createServiceClient()

  // Get one article (specific or next without links)
  let query = supabase
    .from('articles')
    .select('id, title, focus_keyword, content')
    .eq('status', 'published')
    .not('content', 'like', '%amazon-link%')
    .order('created_at', { ascending: true })
    .limit(1)

  if (articleId) {
    query = supabase
      .from('articles')
      .select('id, title, focus_keyword, content')
      .eq('id', articleId)
      .limit(1)
  }

  const { data: articles } = await query
  if (!articles?.length) {
    return NextResponse.json({ done: true, message: 'All articles already have Amazon links' })
  }

  const article = articles[0]
  const keyword = article.focus_keyword || article.title

  const prompt = `Eres un experto en marketing de afiliados. Tienes este artículo HTML sobre home office en español.

Tu tarea: añadir entre 5 y 8 links de afiliado de Amazon de forma NATURAL y DISCRETA dentro del texto existente.

KEYWORD DEL ARTÍCULO: ${keyword}
AMAZON AFFILIATE TAG: ${TAG}

REGLAS ESTRICTAS:
1. Añade los links DISTRIBUIDOS por todo el artículo, no solo al final
2. Formato exacto: <a href="https://www.amazon.es/s?k=TÉRMINO&tag=${TAG}" target="_blank" rel="nofollow sponsored" class="amazon-link">texto natural</a>
3. El término de búsqueda debe ser específico (ej: "silla+ergonómica+oficina", "monitor+4k+trabajo")
4. Textos naturales para los links: "ver en Amazon", "comparar precios aquí", "esta opción", "ver modelos", "ver precio →"
5. En tablas, añade una celda/columna con "Ver precio →"
6. NO cambies el contenido existente, SOLO inserta los links donde encajen
7. Devuelve ÚNICAMENTE el HTML del contenido modificado, sin explicaciones

CONTENIDO:
${article.content}`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  })

  const newContent = message.content[0].type === 'text' ? message.content[0].text : article.content

  await supabase
    .from('articles')
    .update({ content: newContent })
    .eq('id', article.id)

  return NextResponse.json({
    ok: true,
    id: article.id,
    title: article.title,
    linksAdded: (newContent.match(/amazon-link/g) || []).length,
  })
}
