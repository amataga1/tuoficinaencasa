import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aviso Legal',
  description: 'Aviso legal e información sobre el titular del sitio web.',
  robots: { index: false, follow: false },
}

const SITE = process.env.NEXT_PUBLIC_SITE_NAME || 'Tu Oficina en Casa'
const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://tuoficinaencasa.com'

export default function AvisoLegal() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Aviso Legal</h1>
      <div className="prose prose-gray max-w-none">
        <h2>Identificación del titular</h2>
        <p>
          En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, de 11 de julio, de
          Servicios de la Sociedad de la Información y del Comercio Electrónico, a continuación se reflejan los
          siguientes datos:
        </p>
        <ul>
          <li><strong>Titular:</strong> Albert Mata</li>
          <li><strong>NIF:</strong> 51812650K</li>
          <li><strong>Email de contacto:</strong> comercial@rformas.es</li>
          <li><strong>Sitio web:</strong> {DOMAIN}</li>
        </ul>

        <h2>Objeto</h2>
        <p>
          {SITE} es un sitio web de contenido informativo y comparativas sobre equipamiento para home office y
          oficinas en casa. El acceso y uso del sitio es gratuito.
        </p>

        <h2>Propiedad intelectual</h2>
        <p>
          Todos los contenidos del sitio web (textos, imágenes, diseño) son propiedad del titular o se utilizan con
          licencia. Queda prohibida su reproducción total o parcial sin autorización expresa.
        </p>

        <h2>Exclusión de responsabilidad</h2>
        <p>
          El titular no se hace responsable de los daños y perjuicios de cualquier naturaleza que pudieran derivarse
          del acceso o uso de los contenidos del sitio web. Los precios y características de productos mencionados
          pueden variar. Consulta siempre el sitio del vendedor para información actualizada.
        </p>

        <h2>Enlazado externo y afiliación</h2>
        <p>
          Este sitio web participa en el Programa de Afiliados de Amazon EU, un programa de publicidad para afiliados
          diseñado para ofrecer a sitios web un modo de obtener comisiones por publicidad, publicitando e incluyendo
          enlaces a Amazon.es. Como Asociado de Amazon, obtenemos ingresos por las compras adscritas que cumplen los
          requisitos aplicables.
        </p>

        <h2>Ley aplicable y jurisdicción</h2>
        <p>
          Las presentes condiciones se rigen por la legislación española. Para la resolución de cualquier controversia,
          las partes se someten a los juzgados y tribunales del domicilio del usuario.
        </p>

        <p className="text-sm text-gray-400">Última actualización: mayo 2026</p>
      </div>
    </div>
  )
}
