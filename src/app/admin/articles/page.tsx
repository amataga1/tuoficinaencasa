import { Suspense } from 'react'
import { getAdminArticles } from '@/lib/queries'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft:          { label: 'Borrador',   color: 'bg-gray-100 text-gray-600' },
  pending_review: { label: 'Revisión',   color: 'bg-yellow-100 text-yellow-700' },
  approved:       { label: 'Aprobado',   color: 'bg-blue-100 text-blue-700' },
  published:      { label: 'Publicado',  color: 'bg-green-100 text-green-700' },
  rejected:       { label: 'Rechazado',  color: 'bg-red-100 text-red-700' },
}

async function ArticlesList({ status }: { status?: string }) {
  const articles = await getAdminArticles(status)

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {articles.length === 0 ? (
        <div className="p-8 text-center text-gray-400">No hay artículos.</div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Título</th>
              <th className="px-4 py-3 text-left">Categoría</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Palabras</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {articles.map((article) => {
              const s = STATUS_LABELS[article.status]
              return (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-xs">
                    <span className="line-clamp-1">{article.title}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{article.category?.name ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s?.color}`}>{s?.label}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{article.word_count ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(article.created_at)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/articles/${article.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      Editar
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

async function StatusResolver({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams
  return (
    <>
      <div className="flex gap-2 mb-6 flex-wrap">
        {[undefined, 'pending_review', 'approved', 'published', 'draft', 'rejected'].map((s) => (
          <Link key={s ?? 'all'} href={s ? `/admin/articles?status=${s}` : '/admin/articles'}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              status === s || (!status && !s)
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}>
            {s ? STATUS_LABELS[s]?.label : 'Todos'}
          </Link>
        ))}
      </div>
      <Suspense fallback={<div className="bg-white rounded-xl border p-8 text-center text-gray-400 animate-pulse">Cargando…</div>}>
        <ArticlesList status={status} />
      </Suspense>
    </>
  )
}

export default function AdminArticlesPage(props: { searchParams: Promise<{ status?: string }> }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Artículos</h1>
        <Link href="/admin/generate"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          + Generar nuevo
        </Link>
      </div>
      <Suspense fallback={<div className="animate-pulse h-8 bg-gray-100 rounded w-1/2" />}>
        <StatusResolver searchParams={props.searchParams} />
      </Suspense>
    </div>
  )
}
