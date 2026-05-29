import { cacheLife, cacheTag } from 'next/cache'
import { createPublicClient } from './supabase/public'
import { createClient } from './supabase/server'
import type { Article, Category, Keyword, SiteStats } from '@/types'

// ─────────────────────────────────────────────────────────────
// QUERIES PÚBLICAS — cacheadas, sin cookies
// ─────────────────────────────────────────────────────────────

export async function getPublishedArticles(limit = 10, offset = 0): Promise<Article[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('articles')

  const supabase = createPublicClient()
  if (!supabase) return []

  const { data } = await supabase
    .from('articles')
    .select('*, category:categories(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  return (data as Article[]) ?? []
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  'use cache'
  cacheLife('days')
  cacheTag('articles', `article-${slug}`)

  const supabase = createPublicClient()
  if (!supabase) return null

  const { data } = await supabase
    .from('articles')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  return (data as unknown as Article) ?? null
}

export async function getCategories(): Promise<Category[]> {
  'use cache'
  cacheLife('days')
  cacheTag('categories')

  const supabase = createPublicClient()
  if (!supabase) return []

  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (data as Category[]) ?? []
}

export async function getArticlesByCategory(categorySlug: string, limit = 10): Promise<Article[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('articles', `category-${categorySlug}`)

  const supabase = createPublicClient()
  if (!supabase) return []

  const { data } = await supabase
    .from('articles')
    .select('*, category:categories!inner(*)')
    .eq('status', 'published')
    .eq('categories.slug', categorySlug)
    .order('published_at', { ascending: false })
    .limit(limit)

  return (data as Article[]) ?? []
}

export async function getRelatedArticles(articleId: string, categoryId: string, limit = 4): Promise<Article[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('articles')

  const supabase = createPublicClient()
  if (!supabase) return []

  const { data } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, published_at, reading_time, category:categories(*)')
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .neq('id', articleId)
    .order('published_at', { ascending: false })
    .limit(limit)

  return (data as unknown as Article[]) ?? []
}

// ─────────────────────────────────────────────────────────────
// QUERIES ADMIN — sin cache, con cookies para auth futura
// ─────────────────────────────────────────────────────────────

export async function getAdminArticles(status?: string): Promise<Article[]> {
  const supabase = await createClient()
  let query = supabase
    .from('articles')
    .select('*, category:categories(*)')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data } = await query
  return (data as Article[]) ?? []
}

export async function getAdminKeywords(status?: string): Promise<Keyword[]> {
  const supabase = await createClient()
  let query = supabase
    .from('keywords')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data } = await query
  return (data as Keyword[]) ?? []
}

export async function getSiteStats(): Promise<SiteStats> {
  const supabase = await createClient()

  const [
    { count: total },
    { count: published },
    { count: pending },
    { count: totalKw },
    { count: pendingKw },
  ] = await Promise.all([
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'pending_review'),
    supabase.from('keywords').select('*', { count: 'exact', head: true }),
    supabase.from('keywords').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  return {
    total_articles: total ?? 0,
    published_articles: published ?? 0,
    pending_review: pending ?? 0,
    total_keywords: totalKw ?? 0,
    pending_keywords: pendingKw ?? 0,
  }
}
