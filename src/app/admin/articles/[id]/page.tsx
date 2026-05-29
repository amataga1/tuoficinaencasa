import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import ArticleEditor from './ArticleEditor'
import type { Article } from '@/types'

async function getArticle(id: string): Promise<Article | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single()
  return (data as Article) ?? null
}

async function EditorLoader({ id }: { id: string }) {
  const article = await getArticle(id)
  if (!article) notFound()
  return <ArticleEditor article={article} />
}

async function IdResolver({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <EditorLoader id={id} />
}

export default function ArticleReviewPage(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="animate-pulse h-8 bg-gray-100 rounded w-1/3" />}>
      <IdResolver params={props.params} />
    </Suspense>
  )
}
