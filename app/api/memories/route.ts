import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { generateEmbedding } from '@/lib/embeddings'

function getUserId(req: NextRequest) {
  return req.headers.get('x-user-id')
}

// GET /api/memories
export async function GET(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('memories')
    .select('id, title, content, source_type, tags, created_at, updated_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('GET memories error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ memories: data ?? [] })
}

// POST /api/memories
export async function POST(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { title, content, source_type = 'note', tags = [] } = body

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 })
  }

  // Try to generate embedding — but don't fail if it doesn't work
  const textToEmbed = [title, content].filter(Boolean).join('\n')
  const embedding   = await generateEmbedding(textToEmbed)

  if (!embedding) {
    console.warn('Embedding failed or unavailable — saving memory without embedding')
  }

  // Save to Supabase — works with or without embedding
  const { data, error } = await supabaseAdmin
    .from('memories')
    .insert({
      user_id:     userId,
      title:       title?.trim() || null,
      content:     content.trim(),
      source_type,
      tags,
      embedding:   embedding ?? null,
    })
    .select('id, title, content, source_type, tags, created_at')
    .single()

  if (error) {
    console.error('INSERT memory error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ memory: data }, { status: 201 })
}

// DELETE /api/memories?id=xxx
export async function DELETE(req: NextRequest) {
  const userId = getUserId(req)
  const id     = req.nextUrl.searchParams.get('id')

  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!id)     return NextResponse.json({ error: 'Missing id'    }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('memories')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    console.error('DELETE memory error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}