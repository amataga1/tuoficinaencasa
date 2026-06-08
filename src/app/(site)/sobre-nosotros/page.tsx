import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Sobre Nosotros | Setup Oficina — Expertos en Home Office',
  description: 'Conoce al equipo detrás de SetupOficina.es. Llevamos más de 8 años trabajando en remoto y ayudando a profesionales españoles a crear su espacio de trabajo ideal en casa.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Albert Mata',
  jobTitle: 'Experto en Home Office y Equipamiento para Teletrabajo',
  url: 'https://setupoficina.es/sobre-nosotros',
  worksFor: {
    '@type': 'Organization',
    name: 'Setup Oficina',
    url: 'https://setupoficina.es',
  },
  description:
    'Especialista en ergonomía y equipamiento para oficinas en casa con más de 8 años de experiencia en teletrabajo. Ha asesorado a cientos de profesionales españoles en la creación de su setup ideal.',
  knowsAbout: [
    'Ergonomía en el trabajo',
    'Sillas de oficina ergonómicas',
    'Escritorios elevables',
    'Monitores para home office',
    'Productividad en teletrabajo',
    'Iluminación para trabajo remoto',
  ],
  email: 'comercial@rformas.es',
  nationality: 'España',
}

export default function SobreNosotros() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sobre Setup Oficina
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Guías honestas sobre home office escritas por alguien que lleva más de 8 años
            trabajando desde casa y ha cometido (casi) todos los errores posibles.
          </p>
        </div>

        {/* Author card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-md">
                AM
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Albert Mata</h2>
              <p className="text-blue-600 font-medium mb-4">
                Experto en Home Office &amp; Ergonomía · Profesional Independiente
              </p>
              <p className="text-gray-700 mb-4">
                Llevo más de <strong>8 años trabajando en remoto</strong> como profesional independiente en España.
                En ese tiempo he montado y desmontado varios setups, probado decenas de sillas ergonómicas,
                escritorios elevables y monitores, y aprendido —a base de cervicales y facturas— qué
                merece la pena y qué es puro marketing.
              </p>
              <p className="text-gray-700 mb-4">
                Creé Setup Oficina en 2024 porque no encontraba en español una fuente de información
                realmente honesta sobre equipamiento para trabajar desde casa. La mayoría de webs
                recomiendan lo que más comisión da, no lo que mejor funciona.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['Ergonomía laboral', 'Teletrabajo', 'Productividad', 'Home Office', 'Análisis de producto'].map(tag => (
                  <span key={tag} className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { value: '+8 años', label: 'trabajando en remoto' },
            { value: '+60', label: 'artículos publicados' },
            { value: '+100', label: 'productos analizados' },
            { value: '100%', label: 'independiente' },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-50 rounded-xl p-5 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Methodology */}
        <div className="prose prose-gray max-w-none mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cómo trabajamos</h2>
          <div className="grid sm:grid-cols-3 gap-6 not-prose">
            {[
              {
                icon: '🔍',
                title: 'Investigación exhaustiva',
                desc: 'Antes de recomendar cualquier producto leemos especificaciones técnicas, comparamos con la competencia y revisamos cientos de opiniones reales de usuarios.',
              },
              {
                icon: '✅',
                title: 'Experiencia directa',
                desc: 'Siempre que es posible probamos los productos nosotros mismos. Lo que no hemos podido probar, lo indicamos claramente.',
              },
              {
                icon: '💬',
                title: 'Actualización continua',
                desc: 'Los precios, modelos y recomendaciones cambian. Revisamos y actualizamos los artículos regularmente para que la información sea siempre vigente.',
              },
            ].map(item => (
              <div key={item.title} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Transparency */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">🤝 Transparencia total</h2>
          <p className="text-gray-700 mb-3">
            Algunos enlaces de este sitio son de afiliado (principalmente Amazon España). Si compras
            a través de ellos, recibimos una pequeña comisión <strong>sin ningún coste adicional para ti</strong>.
            Esto nos permite mantener el sitio actualizado y gratuito.
          </p>
          <p className="text-gray-700">
            <strong>Nunca recomendamos algo por la comisión que genera.</strong> Si un producto no nos
            parece buena opción, lo decimos claramente aunque pierda afiliado. Nuestra reputación
            vale más que cualquier comisión.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-blue-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">¿Tienes alguna pregunta?</h2>
          <p className="text-blue-100 mb-6">
            Si tienes dudas sobre algún producto, quieres que analicemos algo concreto
            o simplemente quieres contarnos tu experiencia, escríbenos.
          </p>
          <a
            href="mailto:comercial@rformas.es"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            comercial@rformas.es
          </a>
        </div>

      </div>
    </>
  )
}
