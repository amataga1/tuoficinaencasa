import Link from 'next/link'
import { getCategories } from '@/lib/queries'
import CookieBanner from '@/components/CookieBanner'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories()

  return (
    <>
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-gray-900">
              {process.env.NEXT_PUBLIC_SITE_NAME || 'Tu Oficina en Casa'}
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {categories.slice(0, 5).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categoria/${cat.slug}`}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <CookieBanner />
      <footer className="bg-gray-900 text-gray-400 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-3">
                {process.env.NEXT_PUBLIC_SITE_NAME || 'Tu Oficina en Casa'}
              </h3>
              <p className="text-sm">
                Guías, comparativas y consejos para crear tu espacio de trabajo ideal en casa.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Categorías</h3>
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
              <h3 className="text-white font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/aviso-legal" className="hover:text-white transition-colors">Aviso Legal</Link></li>
                <li><Link href="/politica-de-privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
                <li><Link href="/politica-de-cookies" className="hover:text-white transition-colors">Política de Cookies</Link></li>
                <li><Link href="/sobre-nosotros" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>© 2026 {process.env.NEXT_PUBLIC_SITE_NAME || 'Tu Oficina en Casa'}. Algunos enlaces son de afiliado — ver <Link href="/politica-de-privacidad" className="underline">política de privacidad</Link>.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
