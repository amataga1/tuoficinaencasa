import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recursos para Home Office | Herramientas que usamos',
  description: 'Las herramientas, apps y servicios que recomendamos para trabajar desde casa de forma más productiva y profesional.',
}

const TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'setupoficina-21'
function amz(s: string) { return `https://www.amazon.es/s?k=${encodeURIComponent(s)}&tag=${TAG}` }

const RESOURCES = [
  {
    category: '🛋️ Hardware esencial',
    items: [
      { name: 'Silla ergonómica', desc: 'Lo más importante para tu salud. No escatimes aquí.', link: amz('silla ergonómica oficina'), cta: 'Ver opciones en Amazon' },
      { name: 'Monitor externo', desc: 'Un buen monitor reduce la fatiga visual y multiplica tu productividad.', link: amz('monitor 27 pulgadas trabajo'), cta: 'Ver monitores en Amazon' },
      { name: 'Teclado mecánico silencioso', desc: 'Escribir horas es más cómodo con un teclado de calidad.', link: amz('teclado mecánico silencioso oficina'), cta: 'Ver teclados en Amazon' },
      { name: 'Ratón ergonómico', desc: 'Previene el síndrome del túnel carpiano en uso intensivo.', link: amz('ratón ergonómico trabajo'), cta: 'Ver ratones en Amazon' },
      { name: 'Webcam 1080p', desc: 'Imprescindible para dar buena imagen en videollamadas.', link: amz('webcam 1080p trabajo'), cta: 'Ver webcams en Amazon' },
      { name: 'Auriculares con cancelación de ruido', desc: 'Para concentrarte y tener llamadas sin interferencias.', link: amz('auriculares cancelación ruido trabajo'), cta: 'Ver auriculares en Amazon' },
    ]
  },
  {
    category: '💻 Software y apps (gratis o freemium)',
    items: [
      { name: 'Notion', desc: 'El todo-en-uno para notas, proyectos y base de conocimiento. Gratis para uso personal.', link: 'https://notion.so', cta: 'Ir a Notion →' },
      { name: 'Toggl Track', desc: 'Tracking de tiempo gratuito. Imprescindible para autónomos.', link: 'https://toggl.com', cta: 'Ir a Toggl →' },
      { name: 'Loom', desc: 'Graba tu pantalla y envía vídeos en vez de emails largos.', link: 'https://loom.com', cta: 'Ir a Loom →' },
      { name: 'Krisp', desc: 'Elimina el ruido de fondo en tus llamadas con IA. Funciona con cualquier app.', link: 'https://krisp.ai', cta: 'Ir a Krisp →' },
      { name: '1Password', desc: 'Gestor de contraseñas. Esencial si trabajas con varios clientes o proyectos.', link: 'https://1password.com', cta: 'Ir a 1Password →' },
      { name: 'Figma', desc: 'Diseño colaborativo en el navegador. Gratis para proyectos personales.', link: 'https://figma.com', cta: 'Ir a Figma →' },
    ]
  },
  {
    category: '📡 Conectividad',
    items: [
      { name: 'Router WiFi 6', desc: 'Para tener conexión estable. El WiFi 5 ya se queda corto si trabajas en remoto.', link: amz('router WiFi 6 casa'), cta: 'Ver routers en Amazon' },
      { name: 'Adaptador powerline', desc: 'Si el WiFi no llega bien a tu escritorio, ethernet por el cable de luz.', link: amz('adaptador powerline ethernet'), cta: 'Ver adaptadores en Amazon' },
      { name: 'Hub USB-C', desc: 'Para conectar todo desde un MacBook o portátil moderno.', link: amz('hub USB-C multipuerto trabajo'), cta: 'Ver hubs en Amazon' },
    ]
  },
  {
    category: '💡 Iluminación y ambiente',
    items: [
      { name: 'Lámpara de escritorio LED', desc: 'Luz cálida o fría regulable para reducir la fatiga visual.', link: amz('lámpara escritorio LED regulable'), cta: 'Ver lámparas en Amazon' },
      { name: 'Ring light para videollamadas', desc: 'Para que te vean bien en reuniones aunque tengas mala luz natural.', link: amz('ring light escritorio videollamadas'), cta: 'Ver ring lights en Amazon' },
      { name: 'Plantas para escritorio', desc: 'Mejoran el ambiente, reducen el estrés y quedan genial de fondo.', link: amz('plantas escritorio interior fácil'), cta: 'Ver plantas en Amazon' },
    ]
  },
]

export default function RecursosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Recursos</span>
        <h1 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">Lo que usamos y recomendamos</h1>
        <p className="text-xl text-gray-500">
          Esta página recoge todas las herramientas, apps y productos que genuinamente recomendamos para trabajar mejor desde casa. Sin relleno.
        </p>
        <p className="text-xs text-gray-400 mt-3">
          Los enlaces de Amazon son de afiliado — ganamos una pequeña comisión sin coste adicional para ti.
        </p>
      </div>

      {/* Resource sections */}
      <div className="space-y-14">
        {RESOURCES.map((section) => (
          <section key={section.category}>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              {section.category}
              <div className="flex-1 h-px bg-gray-200" />
            </h2>
            <div className="space-y-3">
              {section.items.map((item) => (
                <a key={item.name} href={item.link} target="_blank" rel="nofollow sponsored"
                  className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                  <div className="flex-1 min-w-0 mr-4">
                    <span className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{item.name}</span>
                    <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <span className="flex-shrink-0 text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform whitespace-nowrap">
                    {item.cta}
                  </span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 p-6 bg-gray-50 rounded-2xl text-sm text-gray-500 text-center">
        <p>¿Echas en falta alguna herramienta? Esta página se actualiza regularmente con nuevas recomendaciones.</p>
      </div>
    </div>
  )
}
