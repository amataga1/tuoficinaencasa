import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Mejores Productos Home Office 2026 | Setup Oficina',
  description: 'Los mejores productos para tu home office seleccionados por nuestros expertos. Sillas, escritorios, monitores y más con links directos a Amazon.',
}

const TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'setupoficina-21'

function amz(search: string) {
  return `https://www.amazon.es/s?k=${encodeURIComponent(search)}&tag=${TAG}`
}

const SECTIONS = [
  {
    title: '🪑 Mejores Sillas Ergonómicas',
    description: 'Invertir en una buena silla es lo más importante para tu salud y productividad.',
    products: [
      { name: 'Herman Miller Aeron', desc: 'La referencia absoluta. Cara pero dura 10+ años.', price: '1.200-1.500€', rating: '★★★★★', search: 'Herman Miller Aeron', badge: 'Top Premium' },
      { name: 'Secretlab Titan Softweave', desc: 'La mejor relación calidad-precio del mercado.', price: '350-450€', rating: '★★★★★', search: 'Secretlab Titan silla oficina', badge: 'Mejor Relación Calidad-Precio' },
      { name: 'Noblechairs Hero', desc: 'Comodidad premium con diseño elegante para oficina.', price: '400-500€', rating: '★★★★☆', search: 'Noblechairs Hero silla', badge: null },
      { name: 'IKEA Markus', desc: 'La opción más popular para empezar. Sólida y económica.', price: '180-220€', rating: '★★★★☆', search: 'IKEA Markus silla oficina', badge: 'Mejor Precio' },
    ]
  },
  {
    title: '🖥️ Mejores Escritorios',
    description: 'Desde opciones fijas hasta elevables eléctricos para trabajar de pie.',
    products: [
      { name: 'FlexiSpot E7', desc: 'El escritorio elevable eléctrico más vendido. Silencioso y resistente.', price: '450-550€', rating: '★★★★★', search: 'FlexiSpot E7 escritorio elevable', badge: 'Más Vendido' },
      { name: 'IKEA Bekant Elevable', desc: 'La opción elevable más asequible del mercado.', price: '280-350€', rating: '★★★★☆', search: 'IKEA Bekant elevable escritorio', badge: 'Mejor Precio Elevable' },
      { name: 'Escritorio IKEA Alex+Linnmon', desc: 'El combo clásico de IKEA para home office con cajones.', price: '150-200€', rating: '★★★★☆', search: 'IKEA Alex Linnmon escritorio', badge: null },
    ]
  },
  {
    title: '🖥️ Mejores Monitores',
    description: 'Pantallas que reducen la fatiga visual y aumentan tu espacio de trabajo.',
    products: [
      { name: 'LG 27UK850 4K USB-C', desc: 'El monitor de referencia para home office. 4K, USB-C, color perfecto.', price: '400-500€', rating: '★★★★★', search: 'LG 27UK850 monitor 4K USB-C', badge: 'Top Pick' },
      { name: 'Dell UltraSharp U2723D', desc: 'Calidad profesional para diseñadores y programadores.', price: '550-700€', rating: '★★★★★', search: 'Dell UltraSharp U2723D monitor', badge: 'Para Profesionales' },
      { name: 'Samsung 34" Curvo', desc: 'El ultrawide curvo que elimina la necesidad de doble pantalla.', price: '450-600€', rating: '★★★★☆', search: 'Samsung monitor curvo 34 pulgadas trabajo', badge: null },
      { name: 'Monitor económico 27" 1440p', desc: 'La resolución ideal para trabajar a buen precio.', price: '200-280€', rating: '★★★★☆', search: 'monitor 27 pulgadas 1440p trabajo', badge: 'Mejor Precio' },
    ]
  },
  {
    title: '⌨️ Mejores Teclados y Ratones',
    description: 'Periféricos que marcan la diferencia en comodidad y productividad.',
    products: [
      { name: 'Logitech MX Keys', desc: 'El teclado inalámbrico definitivo para trabajo. Silencioso y cómodo.', price: '100-120€', rating: '★★★★★', search: 'Logitech MX Keys teclado inalambrico', badge: 'Top Pick' },
      { name: 'Logitech MX Master 3', desc: 'El ratón ergonómico más popular entre trabajadores remotos.', price: '80-100€', rating: '★★★★★', search: 'Logitech MX Master 3 raton', badge: 'Más Vendido' },
      { name: 'Keychron K2 Mecánico', desc: 'El teclado mecánico compacto ideal para home office.', price: '80-100€', rating: '★★★★☆', search: 'Keychron K2 teclado mecanico', badge: null },
    ]
  },
  {
    title: '🎧 Mejores Auriculares',
    description: 'Aísla el ruido y mejora tus videollamadas con los mejores auriculares.',
    products: [
      { name: 'Sony WH-1000XM5', desc: 'La mejor cancelación de ruido del mercado para trabajar.', price: '280-350€', rating: '★★★★★', search: 'Sony WH-1000XM5 auriculares', badge: 'Top Premium' },
      { name: 'Jabra Evolve2 55', desc: 'El estándar profesional para reuniones y llamadas.', price: '280-380€', rating: '★★★★★', search: 'Jabra Evolve2 55 auriculares trabajo', badge: 'Para Profesionales' },
      { name: 'Anker Soundcore Q45', desc: 'Cancelación de ruido a precio asequible. Gran relación calidad-precio.', price: '60-80€', rating: '★★★★☆', search: 'Anker Soundcore Q45 auriculares cancelacion ruido', badge: 'Mejor Precio' },
    ]
  },
  {
    title: '💡 Mejor Iluminación',
    description: 'Cuida tu vista y mejora tu aspecto en videollamadas.',
    products: [
      { name: 'Elgato Key Light Air', desc: 'La iluminación profesional para videollamadas. Control por app.', price: '100-130€', rating: '★★★★★', search: 'Elgato Key Light Air', badge: 'Top Pick' },
      { name: 'BenQ ScreenBar Plus', desc: 'La lámpara de monitor definitiva. Sin reflejos en pantalla.', price: '150-180€', rating: '★★★★★', search: 'BenQ ScreenBar Plus lampara monitor', badge: 'Para Ojos' },
      { name: 'Ring Light escritorio', desc: 'Para mejorar el aspecto en videollamadas a buen precio.', price: '30-50€', rating: '★★★★☆', search: 'ring light escritorio videollamadas', badge: 'Mejor Precio' },
    ]
  },
]

export default function MejoresProductosPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 text-sm text-amber-700 font-medium mb-4">
          ⭐ Selección de expertos · Actualizado 2026
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Mejores Productos Home Office</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Hemos probado y analizado decenas de productos. Esta es nuestra selección honesta de lo mejor para cada categoría y presupuesto.
        </p>
        <p className="text-xs text-gray-400 mt-3">
          Esta página contiene enlaces de afiliado a Amazon. Ganamos una pequeña comisión sin coste adicional para ti.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-16">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <p className="text-gray-500 mb-6">{section.description}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.products.map((p) => (
                <a key={p.name} href={amz(p.search)} target="_blank" rel="nofollow sponsored"
                  className="group relative bg-white border border-gray-200 rounded-2xl p-5 hover:border-amber-300 hover:shadow-lg transition-all card-hover flex flex-col">
                  {p.badge && (
                    <span className="absolute -top-3 left-4 bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {p.badge}
                    </span>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors mb-1">{p.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{p.desc}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-amber-500 font-semibold">{p.price}</span>
                      <span className="text-yellow-500">{p.rating}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
                    🛒 Ver en Amazon →
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-16 p-6 bg-gray-50 rounded-2xl text-sm text-gray-500 text-center">
        <p>Como afiliados de Amazon, ganamos comisiones por compras realizadas a través de nuestros enlaces. Esto no influye en nuestras recomendaciones — solo incluimos productos que genuinamente recomendamos.</p>
      </div>
    </div>
  )
}
