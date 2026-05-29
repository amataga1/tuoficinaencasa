import { Suspense } from 'react'
import { getAdminKeywords, getCategories } from '@/lib/queries'
import KeywordsManager from './KeywordsManager'

async function KeywordsLoader() {
  const [keywords, categories] = await Promise.all([
    getAdminKeywords(),
    getCategories(),
  ])
  return <KeywordsManager initialKeywords={keywords} categories={categories} />
}

export default function KeywordsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-8 bg-gray-100 rounded w-1/4" />}>
      <KeywordsLoader />
    </Suspense>
  )
}
