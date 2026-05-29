import Link from 'next/link'
import Image from 'next/image'
import { getPublishedArticles, getCategories } from '@/lib/queries'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME,
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
}

export default async function HomePage() {
  const [articles, categories] = await Promise.all([
    getPublishedArticles(9),
    getCategories(),
  ])

  const featured = articles[0]
  const rest = articles.slice(1)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Hero */}
      {featured && (
        <section className="mb-16">
          <Link href={`/articulo/${featured.slug}`} className="group grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl aspect-video overflow-hidden bg-gray-100 relative">
              {featured.image_url ? (
                <Image src={featured.image_url} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Sin imagen</div>
              )}
            </div>
            <div>
              {featured.category && (
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  {featured.category.name}
                </span>
              )}
              <h1 className="mt-2 text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                {featured.title}
              </h1>
              <p className="mt-3 text-gray-600 line-clamp-3">{featured.excerpt}</p>
              <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
                <span>{formatDate(featured.published_at!)}</span>
                <span>·</span>
                <span>{featured.reading_time} min lectura</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Explorar por categoría</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className="px-4 py-2 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-700 rounded-full text-sm font-medium transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Article grid */}
      {rest.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Últimos artículos</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((article) => (
              <Link
                key={article.id}
                href={`/articulo/${article.slug}`}
                className="group flex flex-col border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-video overflow-hidden bg-gray-100 relative">
                  {article.image_url ? (
                    <Image src={article.image_url} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin imagen</div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  {article.category && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
                      {article.category.name}
                    </span>
                  )}
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2 flex-1">{article.excerpt}</p>
                  <div className="mt-3 text-xs text-gray-400">
                    {formatDate(article.published_at!)} · {article.reading_time} min
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {articles.length === 0 && (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg">Próximamente — contenido en camino.</p>
        </div>
      )}
    </div>
  )
}
