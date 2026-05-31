import Link from 'next/link'
import Image from 'next/image'
import { getPublishedArticles, getCategories } from '@/lib/queries'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME,
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
}

const CATEGORY_ICONS: Record<string, string> = {
  'sillas-de-oficina': '🪑',
  'escritorios': '🖥️',
  'monitores': '🖥️',
  'iluminacion': '💡',
  'productividad': '⚡',
}

export default async function HomePage() {
  const [articles, categories] = await Promise.all([
    getPublishedArticles(9),
    getCategories(),
  ])

  const featured = articles[0]
  const secondary = articles.slice(1, 3)
  const rest = articles.slice(3)

  return (
    <div>
      {/* Hero section */}
      <section className="relative text-white overflow-hidden" style={{ minHeight: '520px', position: 'relative' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1593640408182-31c228b42d1b?w=1600&q=80"
          alt="Setup oficina en casa"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 text-sm text-blue-300 mb-6">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              Guías actualizadas 2026
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              El setup de oficina
              <span className="block gradient-text">perfecto en casa</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-xl">
              Comparativas honestas, guías de compra y consejos reales para montar tu espacio de trabajo ideal — sin gastar de más.
            </p>
            <div className="flex flex-wrap gap-3">
              {categories.slice(0, 4).map((cat) => (
                <Link key={cat.id} href={`/categoria/${cat.slug}`}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-medium transition-all hover:scale-105">
                  {CATEGORY_ICONS[cat.slug] || '📦'} {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Featured article */}
        {featured && (
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Destacado</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <Link href={`/articulo/${featured.slug}`}
              className="group grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-gray-200 bg-white card-hover shadow-sm">
              <div className="aspect-[4/3] md:aspect-auto overflow-hidden bg-gray-100 relative img-zoom">
                {featured.image_url ? (
                  <Image src={featured.image_url} alt={featured.title} fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <span className="text-4xl">🪑</span>
                  </div>
                )}
                {featured.category && (
                  <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {featured.category.name}
                  </span>
                )}
              </div>
              <div className="p-8 flex flex-col justify-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-4">
                  {featured.title}
                </h2>
                <p className="text-gray-500 line-clamp-3 mb-6 leading-relaxed">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    <span>{formatDate(featured.published_at!)}</span>
                    <span className="mx-2">·</span>
                    <span>{featured.reading_time} min lectura</span>
                  </div>
                  <span className="text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform inline-block">
                    Leer →
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Secondary articles (2 columns) */}
        {secondary.length > 0 && (
          <section className="mb-14">
            <div className="grid sm:grid-cols-2 gap-6">
              {secondary.map((article) => (
                <Link key={article.id} href={`/articulo/${article.slug}`}
                  className="group rounded-2xl overflow-hidden border border-gray-200 bg-white card-hover shadow-sm flex flex-col">
                  <div className="aspect-video overflow-hidden bg-gray-100 relative img-zoom">
                    {article.image_url ? (
                      <Image src={article.image_url} alt={article.title} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200" />
                    )}
                    {article.category && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full">
                        {article.category.name}
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug text-lg mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 flex-1 mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{formatDate(article.published_at!)}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded-full">{article.reading_time} min</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Categories band */}
        {categories.length > 0 && (
          <section className="mb-14">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
              <h2 className="text-lg font-bold mb-5">Explorar por categoría</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {categories.map((cat) => (
                  <Link key={cat.id} href={`/categoria/${cat.slug}`}
                    className="bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl p-3 text-center transition-all hover:scale-105 group">
                    <div className="text-2xl mb-1">{CATEGORY_ICONS[cat.slug] || '📦'}</div>
                    <div className="text-xs font-medium leading-tight">{cat.name}</div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Rest of articles */}
        {rest.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Últimos artículos</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((article) => (
                <Link key={article.id} href={`/articulo/${article.slug}`}
                  className="group rounded-2xl overflow-hidden border border-gray-200 bg-white card-hover shadow-sm flex flex-col">
                  <div className="aspect-video overflow-hidden bg-gray-100 relative img-zoom">
                    {article.image_url ? (
                      <Image src={article.image_url} alt={article.title} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200" />
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    {article.category && (
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">{article.category.name}</span>
                    )}
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 flex-1">{article.excerpt}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                      <span>{formatDate(article.published_at!)}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded-full">{article.reading_time} min</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {articles.length === 0 && (
          <div className="text-center py-32">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Contenido en camino</h2>
            <p className="text-gray-500">Estamos preparando las mejores guías para tu home office.</p>
          </div>
        )}
      </div>
    </div>
  )
}
