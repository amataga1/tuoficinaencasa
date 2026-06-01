import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  
}

const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://tuoficinaencasa.com'

export default function PoliticaPrivacidad() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Privacidad</h1>
      <div className="prose prose-gray max-w-none">

        <h2>Responsable del tratamiento</h2>
        <ul>
          <li><strong>Responsable:</strong> Albert Mata (NIF: 51812650K)</li>
          <li><strong>Email:</strong> comercial@rformas.es</li>
        </ul>

        <h2>Datos que recogemos</h2>
        <p>Este sitio web puede recoger los siguientes datos:</p>
        <ul>
          <li><strong>Datos de navegación:</strong> dirección IP, navegador, páginas visitadas, tiempo de visita. Recogidos de forma anónima mediante Google Analytics.</li>
          <li><strong>Cookies publicitarias:</strong> Google AdSense utiliza cookies para mostrar anuncios personalizados según tus intereses.</li>
          <li><strong>Formulario de contacto:</strong> si nos contactas por email, guardamos tu dirección de correo para responderte.</li>
        </ul>

        <h2>Base legal del tratamiento</h2>
        <p>El tratamiento de datos se basa en tu consentimiento (art. 6.1.a RGPD) otorgado a través del banner de cookies, y en el interés legítimo del responsable para fines analíticos.</p>

        <h2>Finalidad</h2>
        <ul>
          <li>Análisis estadístico del uso del sitio web (Google Analytics)</li>
          <li>Mostrar publicidad relevante (Google AdSense)</li>
          <li>Seguimiento de compras a través de enlaces de afiliado (Amazon)</li>
        </ul>

        <h2>Destinatarios</h2>
        <p>Los datos pueden ser compartidos con:</p>
        <ul>
          <li><strong>Google LLC</strong> — Analytics y AdSense. Política: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a></li>
          <li><strong>Amazon EU S.à r.l.</strong> — Programa de afiliados. Política: <a href="https://www.amazon.es/gp/help/customer/display.html?nodeId=201909010" target="_blank" rel="noopener noreferrer">Amazon Privacy</a></li>
        </ul>

        <h2>Transferencias internacionales</h2>
        <p>Google LLC está adherida al Marco de Privacidad de Datos UE-EE.UU., que garantiza un nivel adecuado de protección.</p>

        <h2>Conservación de datos</h2>
        <p>Los datos analíticos se conservan durante 14 meses (configuración predeterminada de Google Analytics 4).</p>

        <h2>Tus derechos</h2>
        <p>Tienes derecho a acceder, rectificar, suprimir, oponerte al tratamiento y portabilidad de tus datos. Para ejercerlos, escríbenos a comercial@rformas.es.</p>
        <p>También puedes presentar una reclamación ante la <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">Agencia Española de Protección de Datos (AEPD)</a>.</p>

        <h2>Publicidad y afiliados</h2>
        <p>
          Este sitio participa en el Programa de Afiliados de Amazon. Cuando haces clic en un enlace de afiliado y realizas una compra, recibimos una pequeña comisión sin coste adicional para ti. Esto nos permite mantener el sitio gratuito.
        </p>

        <p className="text-sm text-gray-400">Última actualización: mayo 2026</p>
      </div>
    </div>
  )
}
