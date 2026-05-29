'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Article } from '@/types'

export default function ArticleEditor({ article }: { article: Article }) {
  const router = useRouter()
  const [title, setTitle] = useState(article.title)
  const [content, setContent] = useState(article.content)
  const [metaTitle, setMetaTitle] = useState(article.meta_title || '')
  const [metaDesc, setMetaDesc] = useState(article.meta_description || '')
  const [excerpt, setExcerpt] = useState(article.excerpt || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function updateStatus(status: string) {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, title, content, meta_title: metaTitle, meta_description: metaDesc, excerpt }),
      })
      if (!res.ok) throw new Error('Error al guardar')
      setMessage(status === 'published' ? '✓ Publicado correctamente' : `✓ Estado cambiado a ${status}`)
      if (status === 'published') {
        setTimeout(() => router.push('/admin/articles'), 1500)
      }
    } catch {
      setMessage('✗ Error al guardar. Inténtalo de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-900 mb-2 block">
            ← Volver
          </button>
          <h1 className="text-xl font-bold text-gray-900">Revisar artículo</h1>
        </div>
        <div className="flex items-center gap-2">
          {message && (
            <span className={`text-sm ${message.startsWith('✓') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </span>
          )}
          <button
            onClick={() => updateStatus('rejected')}
            disabled={saving}
            className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            Rechazar
          </button>
          <button
            onClick={() => updateStatus('approved')}
            disabled={saving}
            className="px-4 py-2 border border-blue-200 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 disabled:opacity-50 transition-colors"
          >
            Aprobar
          </button>
          <button
            onClick={() => updateStatus('published')}
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Guardando…' : 'Publicar'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Título H1</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">{title.length} caracteres</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Extracto</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Contenido HTML
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={28}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
            <p className="text-xs text-gray-400 mt-1">
              {content.split(/\s+/).filter(Boolean).length} palabras aprox.
            </p>
          </div>
        </div>

        {/* SEO sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">SEO</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Meta title</label>
                <input
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className={`text-xs mt-1 ${metaTitle.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                  {metaTitle.length}/60
                </p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Meta description</label>
                <textarea
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className={`text-xs mt-1 ${metaDesc.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                  {metaDesc.length}/160
                </p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-sm space-y-2">
            <h2 className="font-semibold text-gray-900 mb-3">Info</h2>
            <p className="text-gray-500 text-xs">
              <span className="font-medium text-gray-700">Keyword: </span>
              {article.focus_keyword || '—'}
            </p>
            <p className="text-gray-500 text-xs">
              <span className="font-medium text-gray-700">Categoría: </span>
              {article.category?.name || '—'}
            </p>
            <p className="text-gray-500 text-xs">
              <span className="font-medium text-gray-700">Slug: </span>
              /articulo/{article.slug}
            </p>
            <p className="text-gray-500 text-xs">
              <span className="font-medium text-gray-700">Estado: </span>
              {article.status}
            </p>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">Preview Google</h2>
            <p className="text-blue-700 text-sm font-medium line-clamp-1">{metaTitle || title}</p>
            <p className="text-green-700 text-xs mt-0.5">
              tudominio.es/articulo/{article.slug}
            </p>
            <p className="text-gray-600 text-xs mt-1 line-clamp-2">{metaDesc || excerpt}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
