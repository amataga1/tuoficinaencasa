'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/admin',           label: 'Dashboard', icon: '▦' },
  { href: '/admin/articles',  label: 'Artículos', icon: '📄' },
  { href: '/admin/keywords',  label: 'Keywords',  icon: '🔑' },
  { href: '/admin/generate',  label: 'Generar',   icon: '✨' },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 p-3 space-y-1">
      {nav.map((item) => (
        <Link key={item.href} href={item.href}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            pathname === item.href
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-800 hover:text-white'
          )}>
          <span className="text-base">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
