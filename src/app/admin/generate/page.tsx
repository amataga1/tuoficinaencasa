'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Category { id: string; name: string }

export default function GeneratePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [keyword, setKeyword] = useState('')
  const [intent, setIntent] = useState('informational')
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories)
  }, [])

  async function generate(e: React.FormEvent) {
    e.preventDefault()
    if (!keyword.trim() || !categoryId) return

    setLoading(true)
    setStatus('Generando artículo con IA… (30-60 segundos)')

    try {
      const cat = categories.find(c => c.id === categoryId)
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, intent, categoryId, categoryName: cat?.name }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setStatus(`✓ Artículo "${data.article.title}" creado. Redirigiendo a revisión…`)
      setTimeout(() => router.push(`/admin/articles/${data.article.id}`), 1500)
    } catch (err) {
      setStatus(`✗ Error: ${err instanceof Error ? err.message : 'Error desconocido'}`)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Generar artículo</h1>
      <p className="text-gray-500 text-sm mb-8">
        El artículo se generará con IA y quedará en cola de revisión. Podrás editarlo antes de publicar.
      </p>

      <form onSubmit={generate} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Keyword principal <span className="text-red-500">*</span>
          </label>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="ej: mejor silla ergonómica para casa"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">Usa la keyword exacta tal como la buscaría un usuario</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría <span className="text-red-500">*</span>
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Selecciona categoría…</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Intención de búsqueda</label>
          <select
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="informational">Informacional — el usuario quiere aprender</option>
            <option value="commercial">Comercial — el usuario compara antes de comprar</option>
            <option value="transactional">Transaccional — el usuario quiere comprar</option>
          </select>
        </div>

        {status && (
          <div className={`p-4 rounded-xl text-sm ${
            status.startsWith('✓') ? 'bg-green-50 text-green-700' :
            status.startsWith('✗') ? 'bg-red-50 text-red-700' :
            'bg-blue-50 text-blue-700'
          }`}>
            {loading && !status.startsWith('✓') && !status.startsWith('✗') && (
              <span className="inline-block w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2 align-middle" />
            )}
            {status}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Generando…' : 'Generar artículo con IA'}
        </button>
      </form>

      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Recuerda:</strong> Después de generarlo, revisa el artículo, ajusta lo que necesites y publícalo.
        Nunca publiques sin revisar — la revisión humana es la principal señal de calidad para Google.
      </div>
    </div>
  )
}
