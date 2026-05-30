import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient } from '@/lib/supabase/public'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) return NextResponse.json({ results: [] })

  const supabase = createPublicClient()
  if (!supabase) return NextResponse.json({ results: [] })

  const { data } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, reading_time, image_url, category:categories(name, slug)')
    .eq('status', 'published')
    .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,focus_keyword.ilike.%${q}%,content.ilike.%${q}%`)
    .order('published_at', { ascending: false })
    .limit(10)

  return NextResponse.json({ results: data || [] })
}
