import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getArticleBySlug, getRelatedArticles } from '@/lib/queries'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import type { Article, FAQ } from '@/types'

// Metadata — también necesita el slug (params es async)
export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params
  const article = await getArticleBySlug(slug)
  if (!article) return {}

  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt,
    openGraph: {
      title: article.meta_title || article.title,
      description: article.meta_description || article.excerpt || '',
      type: 'article',
      publishedTime: article.published_at || undefined,
    },
    alternates: { canonical: `/articulo/${article.slug}` },
  }
}

// Componente async que hace el data fetching — dentro de Suspense
async function ArticleContent({ slug }: { slug: string }) {
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: { '@type': 'Organization', name: process.env.NEXT_PUBLIC_SITE_NAME },
    publisher: { '@type': 'Organization', name: process.env.NEXT_PUBLIC_SITE_NAME },
  }

  const faqSchema = article.faqs?.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqs.map((faq: FAQ) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  } : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-900">Inicio</Link>
          <span>/</span>
          {article.category && (
            <>
              <Link href={`/categoria/${article.category.slug}`} className="hover:text-gray-900">{article.category.name}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900 line-clamp-1">{article.title}</span>
        </nav>

        <header className="mb-8">
          {article.category && (
            <Link href={`/categoria/${article.category.slug}`} className="text-xs font-semibold uppercase tracking-wider text-blue-600 hover:text-blue-800">
              {article.category.name}
            </Link>
          )}
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">{article.title}</h1>
          <p className="mt-4 text-lg text-gray-600">{article.excerpt}</p>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
            <span>Actualizado el {formatDate(article.updated_at)}</span>
            <span>·</span>
            <span>{article.reading_time} min de lectura</span>
            <span>·</span>
            <span>{article.word_count} palabras</span>
          </div>
        </header>

        {article.image_url && (
          <div className="rounded-2xl aspect-video overflow-hidden relative mb-10">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        )}

        <article
          className="prose prose-gray max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {article.faqs && article.faqs.length > 0 && (
          <section className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {article.faqs.map((faq: FAQ, i: number) => (
                <details key={i} className="group border border-gray-200 rounded-xl p-4">
                  <summary className="font-medium text-gray-900 cursor-pointer list-none flex justify-between items-center">
                    {faq.question}
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {article.category_id && (
          <Suspense fallback={null}>
            <RelatedArticles articleId={article.id} categoryId={article.category_id} />
          </Suspense>
        )}
      </div>
    </>
  )
}

async function RelatedArticles({ articleId, categoryId }: { articleId: string; categoryId: string }) {
  const related = await getRelatedArticles(articleId, categoryId)
  if (!related.length) return null
  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Artículos relacionados</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {related.map((rel: Article) => (
          <Link key={rel.id} href={`/articulo/${rel.slug}`} className="group p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
            <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">{rel.title}</p>
            <p className="mt-1 text-xs text-gray-400">{rel.reading_time} min</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

// Página principal — solo recibe params y delega a ArticleContent dentro de Suspense
export default function ArticlePage(props: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-8 bg-gray-100 rounded animate-pulse mb-4 w-3/4" />
        <div className="h-4 bg-gray-100 rounded animate-pulse mb-2 w-full" />
        <div className="h-4 bg-gray-100 rounded animate-pulse mb-2 w-5/6" />
      </div>
    }>
      <SlugResolver params={props.params} />
    </Suspense>
  )
}

async function SlugResolver({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ArticleContent slug={slug} />
}
