import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { keyword, intent, cluster } = body

  if (!keyword) return NextResponse.json({ error: 'keyword requerida' }, { status: 400 })

  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('keywords')
    .insert({ keyword, intent, cluster, status: 'pending' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ keyword: data })
}
