#!/usr/bin/env node
/**
 * Pinterest auto-pinner — runs after article generation in GitHub Actions.
 * Posts a pin to the matching board based on article category.
 */

const PINTEREST_TOKEN = process.env.PINTEREST_ACCESS_TOKEN
const SITE_URL = process.env.SITE_URL || 'https://setupoficina.es'
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

// Board IDs by category name
const BOARD_BY_CATEGORY = {
  'Sillas de Oficina':  '884605620498276025',
  'Escritorios':        '884605620498276026',
  'Iluminación':        '884605620498276037',
  'Monitores':          '884605620498276035',
  'Productividad':      '884605620498276038',
}
const DEFAULT_BOARD = '884605620498276026' // Escritorios y Setups

async function getLatestArticle() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/articles?select=title,slug,excerpt,image_url,categories(name)&status=eq.published&order=created_at.desc&limit=1`,
    { headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` } }
  )
  const data = await res.json()
  return data?.[0] || null
}

async function createPin(article) {
  const categoryName = article.categories?.name || ''
  const boardId = BOARD_BY_CATEGORY[categoryName] || DEFAULT_BOARD
  const articleUrl = `${SITE_URL}/articulo/${article.slug}`

  const pin = {
    board_id: boardId,
    title: article.title,
    description: `${article.excerpt}\n\n🔗 Leer más en Setup Oficina\n\n#homeoffice #teletrabajo #oficinaencasa #setupoficina #trabajoremoto`,
    link: articleUrl,
    media_source: {
      source_type: 'image_url',
      url: article.image_url,
    },
  }

  const res = await fetch('https://api.pinterest.com/v5/pins', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINTEREST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pin),
  })

  const result = await res.json()

  if (res.ok) {
    console.log(`✅ Pin creado: "${article.title}"`)
    console.log(`   Tablero: ${categoryName || 'Default'}`)
    console.log(`   URL: https://pinterest.com/pin/${result.id}`)
  } else {
    console.error('❌ Error creando pin:', JSON.stringify(result))
    process.exit(1)
  }
}

async function main() {
  if (!PINTEREST_TOKEN) { console.log('No PINTEREST_ACCESS_TOKEN — skipping'); process.exit(0) }
  if (!SUPABASE_URL)    { console.error('Missing SUPABASE_URL'); process.exit(1) }

  const article = await getLatestArticle()
  if (!article) { console.log('No article found'); process.exit(0) }
  if (!article.image_url) { console.log('Article has no image — skipping pin'); process.exit(0) }

  console.log(`Pinning: "${article.title}"`)
  await createPin(article)
}

main().catch(err => { console.error(err); process.exit(1) })
