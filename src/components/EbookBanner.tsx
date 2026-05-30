'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function EbookBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('ebook-banner-dismissed')
    if (!dismissed) setVisible(true)
  }, [])

  function dismiss() {
    localStorage.setItem('ebook-banner-dismissed', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="bg-blue-600 text-white text-center py-2 px-4 text-sm relative">
      <span className="font-medium">📘 Guía gratis: </span>
      <Link href="/ebook" className="underline hover:text-blue-200 font-semibold">
        Monta tu home office perfecto con menos de 500€ →
      </Link>
      <button
        onClick={dismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white text-lg leading-none"
        aria-label="Cerrar"
      >
        ✕
      </button>
    </div>
  )
}
