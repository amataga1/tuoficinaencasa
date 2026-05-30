'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Article } from '@/types'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!query.trim()) { setResults([]); setSearched(false); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.results || [])
        setSearched(true)
      } catch { setResults([]) }
      finally { setLoading(false) }
    }, 350)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Buscar en Setup Oficina</h1>
        <p className="text-gray-500">Encuentra guías, comparativas y consejos para tu home office</p>
      </div>

      {/* Search input */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ej: silla ergonómica, monitor 4K, escritorio elevable..."
          className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none bg-white shadow-sm transition-colors"
        />
        {loading && (
          <div className="absolute inset-y-0 right-4 flex items-center">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Results */}
      {searched && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            {results.length > 0
              ? `${results.length} resultado${results.length !== 1 ? 's' : ''} para "${query}"`
              : `Sin resultados para "${query}"`}
          </p>
          <div className="space-y-4">
            {results.map(article => (
              <Link key={article.id} href={`/articulo/${article.slug}`}
                className="group flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 hover:border-blue-200 hover:shadow-md transition-all card-hover">
                {article.image_url && (
                  <div className="w-24 h-20 rounded-xl overflow-hidden relative flex-shrink-0 bg-gray-100">
                    <Image src={article.image_url} alt={article.title} fill className="object-cover" unoptimized />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {article.category && (
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{article.category.name}</span>
                  )}
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mt-0.5">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{article.excerpt}</p>
                  <span className="text-xs text-gray-400 mt-1 inline-block">{article.reading_time} min lectura</span>
                </div>
                <div className="flex-shrink-0 flex items-center text-blue-500 group-hover:translate-x-1 transition-transform">
                  →
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state / suggestions */}
      {!searched && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="mb-6">Empieza a escribir para buscar artículos</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['silla ergonómica', 'monitor 4K', 'escritorio elevable', 'auriculares', 'webcam', 'iluminación'].map(s => (
              <button key={s} onClick={() => setQuery(s)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 rounded-full text-sm transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
