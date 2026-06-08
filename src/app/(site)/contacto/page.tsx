import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto | Setup Oficina',
  description: 'Contacta con el equipo de Setup Oficina. Resolvemos tus dudas sobre home office, equipamiento para teletrabajo y cualquier consulta sobre nuestro contenido.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contacto — Setup Oficina',
  url: 'https://setupoficina.es/contacto',
  mainEntity: {
    '@type': 'Organization',
    name: 'Setup Oficina',
    email: 'comercial@rformas.es',
    url: 'https://setupoficina.es',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'comercial@rformas.es',
      contactType: 'customer support',
      availableLanguage: 'Spanish',
    },
  },
}

export default function Contacto() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contacto</h1>
          <p className="text-xl text-gray-600">
            ¿Tienes una pregunta, sugerencia o quieres que analicemos algún producto?
            Escríbenos, respondemos en menos de 48 horas.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">✉️</div>
            <h2 className="font-bold text-gray-900 mb-2">Email</h2>
            <p className="text-gray-600 text-sm mb-4">Para consultas generales, sugerencias o colaboraciones</p>
            <a
              href="mailto:comercial@rformas.es"
              className="inline-block bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              comercial@rformas.es
            </a>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">⏱️</div>
            <h2 className="font-bold text-gray-900 mb-2">Tiempo de respuesta</h2>
            <p className="text-gray-600 text-sm mb-4">Respondemos todos los emails en un plazo máximo de</p>
            <span className="inline-block bg-green-600 text-white font-semibold px-6 py-2 rounded-lg text-sm">
              48 horas laborables
            </span>
          </div>
        </div>

        {/* FAQ contacto */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">¿Para qué nos puedes escribir?</h2>
          <div className="space-y-4">
            {[
              {
                icon: '🪑',
                title: 'Dudas sobre productos',
                desc: 'Si no encuentras lo que buscas o necesitas una recomendación personalizada según tu caso concreto.',
              },
              {
                icon: '✏️',
                title: 'Correcciones o actualizaciones',
                desc: 'Si detectas información desactualizada o incorrecta en alguno de nuestros artículos.',
              },
              {
                icon: '🤝',
                title: 'Colaboraciones',
                desc: 'Propuestas de colaboración, guest posts o análisis de productos.',
              },
              {
                icon: '💡',
                title: 'Sugerencias de contenido',
                desc: 'Si quieres que analicemos un producto o escribamos sobre un tema concreto.',
              },
            ].map(item => (
              <div key={item.title} className="flex gap-4 items-start">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aviso afiliados */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-sm text-gray-700">
          <p>
            <strong>Nota sobre solicitudes de reseñas:</strong> Analizamos productos de forma independiente.
            Si eres una marca y quieres que analicemos tu producto, escríbenos indicando el producto y
            las características. Toda colaboración se indica claramente en el contenido.
          </p>
        </div>

      </div>
    </>
  )
}
