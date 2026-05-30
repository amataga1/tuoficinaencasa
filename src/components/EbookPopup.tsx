'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function EbookPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show after 40 seconds or on exit intent, only once per session
    const dismissed = sessionStorage.getItem('ebook-popup-dismissed')
    if (dismissed) return

    // Timer: show after 40s
    const timer = setTimeout(() => setVisible(true), 40000)

    // Exit intent on desktop
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) setVisible(true)
    }
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  function dismiss() {
    sessionStorage.setItem('ebook-popup-dismissed', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Close */}
        <button onClick={dismiss}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors z-10">
          ✕
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white text-center">
          <div className="text-4xl mb-2">📘</div>
          <p className="text-blue-200 text-sm font-medium uppercase tracking-wider mb-1">Guía gratuita</p>
          <h2 className="text-xl font-extrabold leading-tight">
            Home office perfecto<br />
            <span className="text-amber-400">con menos de 500€</span>
          </h2>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 text-sm mb-4 text-center">
            26 páginas con recomendaciones reales, tablas comparativas y 3 builds completos por presupuesto.
          </p>

          <div className="space-y-2 mb-5">
            {['Sillas desde 120€', 'Escritorios desde 80€', '3 configuraciones completas'].map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500 font-bold">✓</span>
                {item}
              </div>
            ))}
          </div>

          <Link href="/ebook" onClick={dismiss}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-center transition-colors">
            📥 Quiero la guía gratis →
          </Link>

          <button onClick={dismiss}
            className="block w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-3 transition-colors">
            No gracias, ya tengo mi setup perfecto
          </button>
        </div>
      </div>
    </div>
  )
}
