import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params
  const body = await request.json()

  const supabase = await createServiceClient()

  const updates: Record<string, unknown> = {}
  if (body.title !== undefined) updates.title = body.title
  if (body.content !== undefined) {
    updates.content = body.content
    updates.word_count = body.content.split(/\s+/).filter(Boolean).length
    updates.reading_time = Math.ceil(updates.word_count as number / 200)
  }
  if (body.excerpt !== undefined) updates.excerpt = body.excerpt
  if (body.meta_title !== undefined) updates.meta_title = body.meta_title
  if (body.meta_description !== undefined) updates.meta_description = body.meta_description
  if (body.status !== undefined) {
    updates.status = body.status
    if (body.status === 'published') {
      updates.published_at = new Date().toISOString()
    }
  }

  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select('slug')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  revalidateTag('articles', 'max')

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params
  const supabase = await createServiceClient()

  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidateTag('articles', 'max')
  return NextResponse.json({ ok: true })
}
