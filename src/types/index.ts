export type ArticleStatus = 'draft' | 'pending_review' | 'approved' | 'published' | 'rejected'

export type KeywordDifficulty = 'low' | 'medium' | 'high'

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  meta_title: string
  meta_description: string
  focus_keyword: string
  category_id: string
  status: ArticleStatus
  schema_markup: Record<string, unknown> | null
  faqs: FAQ[] | null
  reading_time: number
  word_count: number
  image_url: string | null
  published_at: string | null
  created_at: string
  updated_at: string
  category?: Category
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  meta_title: string
  meta_description: string
  created_at: string
}

export interface Keyword {
  id: string
  keyword: string
  search_volume: number | null
  difficulty: KeywordDifficulty | null
  cpc: number | null
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational' | null
  status: 'pending' | 'in_progress' | 'done' | 'discarded'
  cluster: string | null
  notes: string | null
  created_at: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface SiteStats {
  total_articles: number
  published_articles: number
  pending_review: number
  total_keywords: number
  pending_keywords: number
}
