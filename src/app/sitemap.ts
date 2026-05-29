import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tudominio.es'

  const supabase = await createClient()

  const [{ data: articles }, { data: categories }] = await Promise.all([
    supabase
      .from('articles')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false }),
    supabase
      .from('categories')
      .select('slug, created_at'),
  ])

  const articleUrls: MetadataRoute.Sitemap = (articles ?? []).map((a) => ({
    url: `${siteUrl}/articulo/${a.slug}`,
    lastModified: new Date(a.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const categoryUrls: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
    url: `${siteUrl}/categoria/${c.slug}`,
    lastModified: new Date(c.created_at),
    changeFrequency: 'daily',
    priority: 0.6,
  }))

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...categoryUrls,
    ...articleUrls,
  ]
}
