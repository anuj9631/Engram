import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateEmbedding } from '@/lib/embeddings'

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { question } = await req.json()
  if (!question?.trim()) {
    return NextResponse.json({ error: 'Question is required' }, { status: 400 })
  }

  let queryEmbedding: number[]
  try {
    queryEmbedding = await generateEmbedding(question)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }

  const { data: matches, error: searchError } = await supabaseAdmin.rpc(
    'match_memories',
    {
      query_embedding: queryEmbedding,
      match_user_id: userId,
      match_count: 5,
      match_threshold: 0.4,
    }
  )

  if (searchError) return NextResponse.json({ error: searchError.message }, { status: 500 })

  if (!matches || matches.length === 0) {
    return NextResponse.json({
      answer: "I couldn't find anything relevant in your memories. Try adding more notes first.",
      sources: [],
    })
  }

  const context = matches
    .map((m: any, i: number) =>
      `[${i + 1}] ${m.title ? `"${m.title}" — ` : ''}${m.content}`
    )
    .join('\n\n')

  const llmRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are Engram, a personal AI memory assistant.
Answer ONLY from the user's memories provided.
Be specific, mention which memory you're drawing from.
If memories don't have enough info, say so honestly.`,
        },
        {
          role: 'user',
          content: `My memories:\n\n${context}\n\n---\n\nQuestion: ${question}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 700,
    }),
  })

  const llmData = await llmRes.json()
  const answer = llmData.choices?.[0]?.message?.content ?? 'Could not generate an answer.'

  return NextResponse.json({
    answer,
    sources: matches.map((m: any) => ({
      id: m.id,
      title: m.title,
      content: m.content.length > 140 ? m.content.slice(0, 140) + '…' : m.content,
      similarity: Math.round(m.similarity * 100),
      created_at: m.created_at,
    })),
  })
}