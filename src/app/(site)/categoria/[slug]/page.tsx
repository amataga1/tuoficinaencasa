import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getCategories, getArticlesByCategory } from '@/lib/queries'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params
  const categories = await getCategories()
  const cat = categories.find((c) => c.slug === slug)
  if (!cat) return {}

  return {
    title: cat.meta_title || cat.name,
    description: cat.meta_description || cat.description,
    alternates: { canonical: `/categoria/${cat.slug}` },
  }
}

async function CategoryContent({ slug }: { slug: string }) {
  const [categories, articles] = await Promise.all([
    getCategories(),
    getArticlesByCategory(slug, 20),
  ])

  const category = categories.find((c) => c.slug === slug)
  if (!category) notFound()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-10">
        <nav className="text-sm text-gray-500 mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-900">Inicio</Link>
          <span>/</span>
          <span className="text-gray-900">{category.name}</span>
        </nav>
        <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
        {category.description && <p className="mt-3 text-gray-600 max-w-2xl">{category.description}</p>}
      </header>

      {articles.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/articulo/${article.slug}`}
              className="group flex flex-col border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gray-100 aspect-video flex items-center justify-center text-gray-400 text-xs">Imagen</div>
              <div className="p-5 flex flex-col flex-1">
                <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h2>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2 flex-1">{article.excerpt}</p>
                <div className="mt-3 text-xs text-gray-400">
                  {formatDate(article.published_at!)} · {article.reading_time} min
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">Próximamente artículos en esta categoría.</p>
      )}
    </div>
  )
}

export default function CategoryPage(props: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-12"><div className="h-8 bg-gray-100 rounded animate-pulse w-1/3 mb-4" /></div>}>
      <SlugResolver params={props.params} />
    </Suspense>
  )
}

async function SlugResolver({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <CategoryContent slug={slug} />
}
