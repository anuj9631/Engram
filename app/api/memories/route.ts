import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateEmbedding } from '@/lib/embeddings'

function getUserId(req: NextRequest) {
  return req.headers.get('x-user-id')
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('memories')
    .select('id, title, content, source_type, tags, created_at, updated_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ memories: data })
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, content, source_type = 'note', tags = [] } = await req.json()
  if (!content?.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 })
  }

  const textToEmbed = [title, content].filter(Boolean).join('\n')

  let embedding: number[]
  try {
    embedding = await generateEmbedding(textToEmbed)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }

  const { data, error } = await supabaseAdmin
    .from('memories')
    .insert({
      user_id: userId,
      title: title?.trim() || null,
      content: content.trim(),
      source_type,
      tags,
      embedding,
    })
    .select('id, title, content, source_type, tags, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ memory: data }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const userId = getUserId(req)
  const id = req.nextUrl.searchParams.get('id')

  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('memories')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}