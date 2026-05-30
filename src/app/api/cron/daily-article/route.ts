import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// Bank of 200 keywords to consume one per day
// Each entry: [keyword, categoryId, categoryName]
const KEYWORD_BANK: [string, string, string][] = [
  // Sillas de Oficina
  ['mejor silla de oficina para teletrabajar todo el día', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla ergonómica con reposacabezas para oficina', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['diferencia entre silla ergonómica y silla normal', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla de oficina con ruedas para suelo de madera', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla de oficina sin reposabrazos pros contras', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['Herman Miller Aeron vale la pena el precio', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla de oficina para embarazadas trabajar desde casa', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla ergonómica segunda mano vale la pena', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['cuánto tiempo puede durar una silla de oficina', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla de oficina para personas con ciática', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['reposabrazos para silla de oficina ergonómico', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla de oficina con soporte lumbar ajustable', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla de oficina para personas con sobrepeso reforzada', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['Secretlab Titan como silla de oficina diaria', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla de pelota para trabajar desde casa beneficios', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  // Escritorios
  ['escritorio con almacenamiento integrado home office', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['escritorio de madera maciza para home office', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['IKEA Bekant escritorio elevable opinión 2026', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['escritorio plegable para habitación pequeña', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['altura ideal del escritorio para trabajar sentado', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['escritorio con soporte para monitor integrado', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['montar escritorio gaming en casa para trabajar', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['escritorio blanco minimalista home office ideas', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['escritorio doble para dos personas en casa', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['sujeción de cables bajo escritorio soluciones', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['escritorio de pie beneficios y riesgos reales', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['FlexiSpot E7 escritorio elevable análisis completo', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['escritorio esquinero ikea para oficina en casa', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['tapete protector suelo escritorio cuál elegir', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['escritorio industrial estilo loft home office', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  // Monitores
  ['monitor 1440p vs 4K para trabajar cuál elegir', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['mejor monitor económico para home office menos de 300 euros', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['monitor IPS vs VA para trabajar diferencias', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['monitor sin marco para setup minimalista', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['Dell UltraSharp análisis home office 2026', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['monitor con USB-C para cargar portátil trabajando', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['LG 27UK850 monitor home office análisis', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['soporte de monitor para escritorio elevado', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['calibrar monitor para trabajar con colores correctos', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['monitor para trabajar con Excel y documentos grande', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['frecuencia de actualización monitor para trabajar 60hz suficiente', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['monitor con altavoces integrados para home office', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['brazo articulado monitor escritorio instalar', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['monitor gaming como monitor de trabajo sirve', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['Samsung monitor curvo 34 vs 27 pulgadas flat', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  // Iluminación
  ['pantalla azul cómo reducir fatiga visual trabajando', '385453c6-8fe7-40ea-80c9-97d5034a511a', 'Iluminación'],
  ['iluminación indirecta escritorio sin reflejos pantalla', '385453c6-8fe7-40ea-80c9-97d5034a511a', 'Iluminación'],
  ['Elgato Key Light Air análisis home office', '385453c6-8fe7-40ea-80c9-97d5034a511a', 'Iluminación'],
  ['tira LED escritorio detrás monitor bias lighting', '385453c6-8fe7-40ea-80c9-97d5034a511a', 'Iluminación'],
  ['mejor posición de la lámpara para trabajar con ordenador', '385453c6-8fe7-40ea-80c9-97d5034a511a', 'Iluminación'],
  ['lámpara escritorio con clip para portátil', '385453c6-8fe7-40ea-80c9-97d5034a511a', 'Iluminación'],
  ['luz cálida o fría para trabajar cuál es mejor', '385453c6-8fe7-40ea-80c9-97d5034a511a', 'Iluminación'],
  ['iluminación home office con Philips Hue', '385453c6-8fe7-40ea-80c9-97d5034a511a', 'Iluminación'],
  ['cómo iluminar fondo videollamadas profesional sin gastar', '385453c6-8fe7-40ea-80c9-97d5034a511a', 'Iluminación'],
  ['BenQ ScreenBar lámpara monitor análisis', '385453c6-8fe7-40ea-80c9-97d5034a511a', 'Iluminación'],
  // Productividad
  ['cómo montar setup trabajo remoto profesional desde cero', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['herramientas esenciales para trabajar desde casa', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['mejores soportes de portátil para escritorio 2026', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['Logitech MX Keys análisis teclado trabajo remoto', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['Logitech MX Master 3 ratón home office análisis', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['Apple Magic Keyboard vs Logitech para Mac trabajo', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['Sony WH-1000XM5 para trabajar desde casa vale la pena', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['Jabra Evolve2 auriculares trabajo análisis', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['Blue Yeti micrófono para reuniones online análisis', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['Logitech C920 webcam trabajo remoto análisis 2026', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['cómo mejorar calidad videollamadas zoom teams', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['escritorio de pie cuántas horas al día es sano', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['método Pomodoro para trabajar desde casa funciona', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['organizar mesa trabajo minimalismo productividad', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['cable management escritorio DIY soluciones baratas', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['mejores extensiones regletas para home office', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['SAI para ordenador de sobremesa home office necesito uno', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['segunda pantalla iPhone iPad como monitor Mac', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['dock CalDigit Thunderbolt análisis para MacBook', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['Anker hub USB-C para home office análisis', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['papel pintado detrás escritorio videollamadas ideas', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['mejorar WiFi en casa para teletrabajar sin cortes', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['powerline adaptador ethernet para home office', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['cómo pedir a la empresa equipamiento para teletrabajo', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['ergonomía postura correcta trabajar ordenador casa', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['síndrome del túnel carpiano prevenir trabajando ordenador', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['ejercicios para hacer en el escritorio sin levantarse', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['home office en el dormitorio cómo separar espacios', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['home office en el salón ideas para esconder el escritorio', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['setup home office completo menos de 300 euros', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['setup home office para programadores desarrolladores', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['setup home office para diseñadores gráficos', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['setup home office para abogados profesionales', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['gadgets home office que merece la pena comprar 2026', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['gadgets home office que NO merece la pena comprar', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['cómo deducir gastos home office como autónomo España', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['regulación teletrabajo España derechos trabajador', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['mejor silla de oficina para adolescentes estudiar', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla de oficina tapizada en tela vs cuero cual mejor', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['cómo limpiar y mantener silla de oficina', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['ruedas silla de oficina cuáles cambiar para parquet', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['Markus IKEA silla oficina análisis vale la pena', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['Noblechairs Hero análisis silla oficina', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['monitor ultrawide 49 pulgadas para trabajar vale la pena', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['qué resolución de monitor necesito para home office', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['HDMI vs DisplayPort para conectar monitor diferencias', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['Asus ProArt monitor para diseño y trabajo análisis', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
]

export async function GET(request: NextRequest) {
  // Verify this is called by Vercel Cron
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createServiceClient()

  try {
    // Find next keyword not yet used
    const { data: existing } = await supabase
      .from('articles')
      .select('focus_keyword')

    const usedKeywords = new Set((existing || []).map((a: { focus_keyword: string }) =>
      a.focus_keyword?.toLowerCase().trim()
    ))

    const next = KEYWORD_BANK.find(([kw]) =>
      !usedKeywords.has(kw.toLowerCase().trim())
    )

    if (!next) {
      return NextResponse.json({ message: 'All keywords used — add more to KEYWORD_BANK' })
    }

    const [keyword, categoryId, categoryName] = next

    // Call the generate endpoint
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://setupoficina.es'
    const res = await fetch(`${siteUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword, categoryId, categoryName, intent: 'informational' }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Generate failed: ${err}`)
    }

    const data = await res.json()

    // Auto-publish
    await supabase
      .from('articles')
      .update({ status: 'published', published_at: new Date().toISOString() })
      .eq('id', data.article.id)

    return NextResponse.json({
      ok: true,
      article: data.article.title,
      keyword,
    })
  } catch (err) {
    console.error('Cron error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
