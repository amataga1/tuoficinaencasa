import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies | Setup Oficina',
}

export default function PoliticaCookies() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Cookies</h1>
      <div className="prose prose-gray max-w-none">

        <p>Este sitio web utiliza cookies y tecnologías similares. A continuación te explicamos qué son, para qué se usan y cómo puedes controlarlas.</p>

        <h2>¿Qué son las cookies?</h2>
        <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Permiten que el sitio recuerde tus preferencias y analice cómo lo usas.</p>

        <h2>Tipos de cookies que usamos</h2>

        <h3>Cookies técnicas (necesarias)</h3>
        <p>Imprescindibles para el funcionamiento del sitio. No requieren consentimiento.</p>

        <h3>Cookies analíticas</h3>
        <table>
          <thead>
            <tr><th>Cookie</th><th>Proveedor</th><th>Finalidad</th><th>Duración</th></tr>
          </thead>
          <tbody>
            <tr><td>_ga</td><td>Google Analytics</td><td>Distinguir usuarios</td><td>2 años</td></tr>
            <tr><td>_ga_*</td><td>Google Analytics</td><td>Sesión de Analytics</td><td>2 años</td></tr>
          </tbody>
        </table>

        <h3>Cookies publicitarias</h3>
        <table>
          <thead>
            <tr><th>Cookie</th><th>Proveedor</th><th>Finalidad</th><th>Duración</th></tr>
          </thead>
          <tbody>
            <tr><td>IDE</td><td>Google AdSense</td><td>Publicidad personalizada</td><td>13 meses</td></tr>
            <tr><td>test_cookie</td><td>Google</td><td>Verificar soporte de cookies</td><td>Sesión</td></tr>
            <tr><td>ANID</td><td>Google</td><td>Publicidad</td><td>13 meses</td></tr>
          </tbody>
        </table>

        <h2>Cómo gestionar o desactivar las cookies</h2>
        <p>Puedes gestionar las cookies a través del banner de consentimiento que aparece en tu primera visita, o modificando la configuración de tu navegador:</p>
        <ul>
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan-en-" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
        </ul>
        <p>También puedes optar por no recibir publicidad personalizada de Google en <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">google.com/settings/ads</a>.</p>

        <h2>Actualizaciones</h2>
        <p>Esta política puede actualizarse. Te recomendamos revisarla periódicamente.</p>

        <p className="text-sm text-gray-400">Última actualización: mayo 2026</p>
      </div>
    </div>
  )
}
