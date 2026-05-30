'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Metadata } from 'next'

export default function EbookPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !name) return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al suscribirse')
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left — ebook preview */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 rounded-full px-4 py-1.5 text-sm text-amber-300 font-medium mb-6">
              📘 Ebook gratuito · 26 páginas
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
              Monta tu home office perfecto con
              <span className="text-amber-400"> menos de 500€</span>
            </h1>
            <p className="text-blue-200 text-lg mb-8">
              La guía definitiva para trabajar desde casa sin arruinarte. Sillas, escritorios, monitores y 3 builds completos.
            </p>

            <div className="space-y-3 mb-8">
              {[
                'Qué comprar primero (y qué esperar)',
                'Opciones reales desde 120€',
                '3 configuraciones completas: 300€, 400€ y 500€',
                'Recomendaciones honestas sin publicidad',
                'Checklist descargable incluida',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-blue-100 text-sm">{item}</span>
                </div>
              ))}
            </div>

            {/* Fake book cover */}
            <div className="bg-blue-600 rounded-2xl p-6 max-w-xs shadow-2xl border border-blue-400/30">
              <div className="bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                GUÍA GRATUITA 2026
              </div>
              <h3 className="text-white font-extrabold text-xl leading-tight mb-1">
                Home Office Perfecto
              </h3>
              <p className="text-blue-200 text-sm mb-4">con menos de 500€</p>
              <div className="text-3xl font-black text-amber-400">500€</div>
              <p className="text-blue-300 text-xs mt-2">setupoficina.es</p>
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Ya es tuyo!</h2>
                <p className="text-gray-500 mb-6">
                  Te hemos enviado el ebook a <strong>{email}</strong>. Revisa también la carpeta de spam.
                </p>
                <a
                  href="/ebook-home-office-500.pdf"
                  download
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  📥 Descargar ahora
                </a>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Descarga gratis la guía
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Introduce tu email y recíbela al instante. Sin spam, solo contenido útil sobre home office.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tu nombre</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Albert"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tu email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl transition-colors text-lg"
                  >
                    {status === 'loading' ? 'Enviando...' : '📥 Quiero la guía gratis →'}
                  </button>
                </form>

                <p className="text-xs text-gray-400 text-center mt-4">
                  Sin spam. Puedes darte de baja cuando quieras.
                  Al suscribirte aceptas la <a href="/politica-de-privacidad" className="underline">política de privacidad</a>.
                </p>

                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-6 text-xs text-gray-400">
                  <span>✅ Gratuito</span>
                  <span>✅ Sin spam</span>
                  <span>✅ Descarga inmediata</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
