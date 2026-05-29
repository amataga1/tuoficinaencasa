'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
    // Aquí activaríamos Google Analytics si lo tienes configurado
  }

  function reject() {
    localStorage.setItem('cookie-consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-gray-900 text-white rounded-2xl p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 text-sm text-gray-300 leading-relaxed">
            <p>
              Usamos cookies propias y de terceros (Google Analytics, Google AdSense) para analizar el tráfico
              y mostrar publicidad personalizada. Puedes aceptar todas las cookies o solo las necesarias.{' '}
              <Link href="/politica-de-cookies" className="underline hover:text-white">
                Más información
              </Link>
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={reject}
              className="px-4 py-2 text-sm border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Solo necesarias
            </button>
            <button
              onClick={accept}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Aceptar todas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
