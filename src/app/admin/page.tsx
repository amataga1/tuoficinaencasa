import { Suspense } from 'react'
import { getSiteStats, getAdminArticles } from '@/lib/queries'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

async function DashboardContent() {
  const [stats, pending] = await Promise.all([
    getSiteStats(),
    getAdminArticles('pending_review'),
  ])

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {[
          { label: 'Total artículos', value: stats.total_articles, color: 'bg-blue-50 text-blue-700' },
          { label: 'Publicados',      value: stats.published_articles, color: 'bg-green-50 text-green-700' },
          { label: 'En revisión',     value: stats.pending_review, color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Keywords',        value: stats.total_keywords, color: 'bg-purple-50 text-purple-700' },
          { label: 'Kw pendientes',   value: stats.pending_keywords, color: 'bg-orange-50 text-orange-700' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-xl p-4`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs font-medium mt-1 opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Artículos pendientes de revisión
            {pending.length > 0 && (
              <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {pending.length}
              </span>
            )}
          </h2>
          <Link href="/admin/articles" className="text-sm text-blue-600 hover:text-blue-800">Ver todos →</Link>
        </div>

        {pending.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">
            <p>No hay artículos pendientes de revisión.</p>
            <Link href="/admin/generate" className="mt-3 inline-block text-blue-600 text-sm hover:underline">
              Generar nuevo contenido →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 divide-y">
            {pending.slice(0, 10).map((article) => (
              <div key={article.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{article.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {article.category?.name} · {formatDate(article.created_at)} · {article.word_count} palabras
                  </p>
                </div>
                <Link href={`/admin/articles/${article.id}`}
                  className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap ml-4">
                  Revisar
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <Suspense fallback={
        <div className="grid grid-cols-5 gap-4 mb-10">
          {[...Array(5)].map((_, i) => <div key={i} className="bg-gray-100 rounded-xl p-4 h-16 animate-pulse" />)}
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </div>
  )
}
