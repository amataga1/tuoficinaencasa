import { Suspense } from 'react'
import Link from 'next/link'
import AdminNav from './AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-gray-900 text-gray-300 flex flex-col fixed inset-y-0 left-0">
        <div className="p-4 border-b border-gray-800">
          <Link href="/" className="text-white font-semibold text-sm">← Ver sitio</Link>
          <p className="text-gray-500 text-xs mt-1">Panel de administración</p>
        </div>
        <Suspense fallback={<div className="p-3 space-y-1">
          {[...Array(4)].map((_, i) => <div key={i} className="h-9 bg-gray-800 rounded-lg animate-pulse" />)}
        </div>}>
          <AdminNav />
        </Suspense>
      </aside>
      <div className="ml-56 flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
