import Link from 'next/link'
import { getCategories } from '@/lib/queries'
import CookieBanner from '@/components/CookieBanner'
import EbookPopup from '@/components/EbookPopup'
import EbookBanner from '@/components/EbookBanner'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories()

  return (
    <>
      {/* Header */}
      <EbookBanner />

      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:bg-blue-700 transition-colors">
                SO
              </div>
              <span className="font-bold text-gray-900 text-lg hidden sm:block">Setup Oficina</span>
            </Link>

            {/* Nav */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {categories.slice(0, 5).map((cat) => (
                <Link key={cat.id} href={`/categoria/${cat.slug}`}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium whitespace-nowrap">
                  {cat.name}
                </Link>
              ))}
              <Link href="/mejores-productos"
                className="px-3 py-1.5 text-sm text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors font-bold whitespace-nowrap">
                ⭐ Top Productos
              </Link>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Search button */}
              <Link href="/buscar"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden sm:inline">Buscar</span>
              </Link>
              <Link href="/recursos"
                className="hidden sm:block px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                Recursos
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <CookieBanner />
      <EbookPopup />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 mt-20">
        <div className="h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">SO</div>
                <span className="text-white font-bold text-lg">Setup Oficina</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Guías, comparativas y consejos honestos para crear tu espacio de trabajo ideal en casa.
              </p>
              <p className="text-xs mt-4 text-gray-600">
                Algunos enlaces son de afiliado Amazon. Esto no afecta nuestras recomendaciones.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Categorías</h3>
              <ul className="space-y-2 text-sm">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/categoria/${cat.slug}`} className="hover:text-white transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Páginas</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/mejores-productos" className="hover:text-white transition-colors">⭐ Mejores Productos</Link></li>
                <li><Link href="/recursos" className="hover:text-white transition-colors">🔧 Recursos</Link></li>
                <li><Link href="/buscar" className="hover:text-white transition-colors">🔍 Buscador</Link></li>
                <li><Link href="/aviso-legal" className="hover:text-white transition-colors">Aviso Legal</Link></li>
                <li><Link href="/politica-de-privacidad" className="hover:text-white transition-colors">Privacidad</Link></li>
                <li><Link href="/politica-de-cookies" className="hover:text-white transition-colors">Cookies</Link></li>
                <li><Link href="/sobre-nosotros" className="hover:text-white transition-colors">Sobre nosotros</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-600">
            <p>© 2026 Setup Oficina. Todos los derechos reservados.</p>
            <p>Hecho con ❤️ para trabajadores remotos en España</p>
          </div>
        </div>
      </footer>
    </>
  )
}
