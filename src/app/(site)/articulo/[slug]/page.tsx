import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getArticleBySlug, getRelatedArticles } from '@/lib/queries'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import type { Article, FAQ } from '@/types'
import PinterestButton from '@/components/PinterestButton'

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
      images: article.image_url ? [{ url: article.image_url }] : [],
    },
    alternates: { canonical: `/articulo/${article.slug}` },
  }
}

async function ArticleContent({ slug }: { slug: string }) {
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.image_url,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: {
      '@type': 'Person',
      name: 'Albert Mata',
      jobTitle: 'Experto en Home Office y Ergonomía',
      url: 'https://setupoficina.es/sobre-nosotros',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Setup Oficina',
      url: 'https://setupoficina.es',
      logo: { '@type': 'ImageObject', url: 'https://setupoficina.es/favicon.ico' },
    },
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

      {/* Hero image full-width */}
      {article.image_url && (
        <div className="w-full aspect-[21/9] relative bg-gray-900 overflow-hidden max-h-[480px]">
          <Image src={article.image_url} alt={article.title} fill className="object-cover opacity-85" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
          <span>›</span>
          {article.category && (
            <>
              <Link href={`/categoria/${article.category.slug}`} className="hover:text-blue-600 transition-colors">
                {article.category.name}
              </Link>
              <span>›</span>
            </>
          )}
          <span className="text-gray-600 line-clamp-1">{article.title}</span>
        </nav>

        {/* Article header */}
        <header className="mb-10">
          {article.category && (
            <Link href={`/categoria/${article.category.slug}`}
              className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4 hover:bg-blue-100 transition-colors uppercase tracking-wider">
              {article.category.name}
            </Link>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-5">
            {article.title}
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed mb-6 font-light">{article.excerpt}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 pb-8 border-b border-gray-100">
            <Link href="/sobre-nosotros" className="flex items-center gap-2 hover:text-blue-600 transition-colors group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">AM</div>
              <div>
                <span className="font-semibold text-gray-700 group-hover:text-blue-600 block leading-tight">Albert Mata</span>
                <span className="text-xs text-gray-400 leading-tight">Experto en Home Office</span>
              </div>
            </Link>
            <span>·</span>
            <span>Actualizado el {formatDate(article.updated_at)}</span>
            <span>·</span>
            <span className="bg-gray-100 px-2.5 py-1 rounded-full font-medium text-gray-600">
              {article.reading_time} min de lectura
            </span>
            <span className="bg-gray-100 px-2.5 py-1 rounded-full font-medium text-gray-600">
              {article.word_count} palabras
            </span>
            {article.image_url && (
              <PinterestButton
                imageUrl={article.image_url}
                title={article.title}
                url={`${process.env.NEXT_PUBLIC_SITE_URL}/articulo/${article.slug}`}
              />
            )}
          </div>
        </header>

        {/* Article body */}
        <article
          className="prose prose-lg prose-gray max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-md
            prose-table:text-sm prose-th:bg-gray-50
            prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50/50 prose-blockquote:rounded-r-xl prose-blockquote:py-1
            prose-strong:text-gray-900
          "
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Author bio card */}
        <div className="mt-12 border border-gray-200 rounded-2xl p-6 bg-gray-50 flex gap-5 items-start">
          <div className="flex-shrink-0">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md">AM</div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-900">Albert Mata</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Autor</span>
            </div>
            <p className="text-xs text-gray-500 mb-2">Experto en Home Office &amp; Ergonomía · +8 años trabajando en remoto</p>
            <p className="text-sm text-gray-600">
              Profesional independiente con más de 8 años de experiencia en teletrabajo. Ha analizado
              y probado decenas de productos de home office para ayudar a profesionales españoles a
              crear su espacio de trabajo ideal. Todos los artículos están basados en experiencia real
              e investigación exhaustiva.
            </p>
            <Link href="/sobre-nosotros" className="inline-block mt-3 text-sm text-blue-600 hover:underline font-medium">
              Conoce más sobre el autor →
            </Link>
          </div>
        </div>

        {/* FAQs */}
        {article.faqs && article.faqs.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Preguntas frecuentes</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="space-y-3">
              {article.faqs.map((faq: FAQ, i: number) => (
                <details key={i} className="group border border-gray-200 rounded-xl bg-white overflow-hidden">
                  <summary className="flex justify-between items-center p-5 cursor-pointer list-none font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                    <span>{faq.question}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform ml-4 flex-shrink-0 text-lg">▾</span>
                  </summary>
                  <div className="px-5 pb-5 text-gray-600 leading-relaxed text-sm border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related articles */}
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
    <section className="mt-14 pt-10 border-t border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Artículos relacionados</h2>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {related.map((rel: Article) => (
          <Link key={rel.id} href={`/articulo/${rel.slug}`}
            className="group flex gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all bg-white">
            {rel.image_url && (
              <div className="w-20 h-16 rounded-lg overflow-hidden relative flex-shrink-0 bg-gray-100">
                <Image src={rel.image_url} alt={rel.title} fill className="object-cover" unoptimized />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm leading-snug">{rel.title}</p>
              <p className="mt-1 text-xs text-gray-400">{rel.reading_time} min lectura</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default function ArticlePage(props: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
        <div className="h-10 bg-gray-100 rounded-xl animate-pulse w-3/4" />
        <div className="h-5 bg-gray-100 rounded animate-pulse w-full" />
        <div className="h-5 bg-gray-100 rounded animate-pulse w-5/6" />
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
