'use client'

import { useState } from 'react'
import type { Keyword, Category } from '@/types'

const STATUS_COLORS: Record<string, string> = {
  pending:     'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  done:        'bg-green-100 text-green-700',
  discarded:   'bg-gray-100 text-gray-500',
}

const INTENT_LABELS: Record<string, string> = {
  informational: 'Info',
  commercial:    'Comercial',
  transactional: 'Transac.',
  navigational:  'Nav.',
}

export default function KeywordsManager({
  initialKeywords,
  categories,
}: {
  initialKeywords: Keyword[]
  categories: Category[]
}) {
  const [keywords, setKeywords] = useState(initialKeywords)
  const [newKw, setNewKw] = useState('')
  const [newIntent, setNewIntent] = useState('informational')
  const [newCluster, setNewCluster] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('')

  const filtered = filterStatus === 'all'
    ? keywords
    : keywords.filter(k => k.status === filterStatus)

  async function addKeyword() {
    if (!newKw.trim()) return
    setSaving(true)
    const res = await fetch('/api/keywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword: newKw.trim(), intent: newIntent, cluster: newCluster || null }),
    })
    const data = await res.json()
    if (data.keyword) {
      setKeywords(prev => [data.keyword, ...prev])
      setNewKw('')
      setNewCluster('')
    }
    setSaving(false)
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/keywords/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setKeywords(prev => prev.map(k => k.id === id ? { ...k, status: status as Keyword['status'] } : k))
  }

  async function generateArticle(keyword: Keyword) {
    if (!selectedCategory) {
      alert('Selecciona una categoría primero (arriba a la derecha)')
      return
    }
    setGenerating(keyword.id)
    const cat = categories.find(c => c.id === selectedCategory)
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        keyword: keyword.keyword,
        intent: keyword.intent || 'informational',
        categoryId: selectedCategory,
        categoryName: cat?.name,
      }),
    })
    const data = await res.json()
    if (data.ok) {
      await updateStatus(keyword.id, 'in_progress')
      alert(`✓ Artículo generado: "${data.article.title}". Ve a Artículos > Revisión para aprobarlo.`)
    } else {
      alert(`Error: ${data.error}`)
    }
    setGenerating(null)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Keywords</h1>

      {/* Add keyword */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Añadir keyword</h2>
        <div className="flex flex-wrap gap-3">
          <input
            value={newKw}
            onChange={e => setNewKw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addKeyword()}
            placeholder="mejor silla ergonómica para casa"
            className="flex-1 min-w-48 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newIntent}
            onChange={e => setNewIntent(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="informational">Informacional</option>
            <option value="commercial">Comercial</option>
            <option value="transactional">Transaccional</option>
          </select>
          <input
            value={newCluster}
            onChange={e => setNewCluster(e.target.value)}
            placeholder="Cluster (opcional)"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addKeyword}
            disabled={saving || !newKw.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Guardando…' : 'Añadir'}
          </button>
        </div>
      </div>

      {/* Filters + category selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-2">
          {['all', 'pending', 'in_progress', 'done', 'discarded'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === s
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {s === 'all' ? 'Todas' : s === 'in_progress' ? 'En progreso' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Categoría para generar…</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No hay keywords. Añade la primera arriba.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Keyword</th>
                <th className="px-4 py-3 text-left">Intención</th>
                <th className="px-4 py-3 text-left">Cluster</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(kw => (
                <tr key={kw.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{kw.keyword}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {kw.intent ? INTENT_LABELS[kw.intent] : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{kw.cluster || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[kw.status]}`}>
                      {kw.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      {kw.status === 'pending' && (
                        <button
                          onClick={() => generateArticle(kw)}
                          disabled={generating === kw.id}
                          className="text-xs bg-blue-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap"
                        >
                          {generating === kw.id ? 'Generando…' : '✨ Generar'}
                        </button>
                      )}
                      <select
                        value={kw.status}
                        onChange={e => updateStatus(kw.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none"
                      >
                        <option value="pending">pending</option>
                        <option value="in_progress">in_progress</option>
                        <option value="done">done</option>
                        <option value="discarded">discarded</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
