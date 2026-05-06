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

  // Step 1 — Embed the question
  let queryEmbedding: number[]
  try {
    queryEmbedding = await generateEmbedding(question)
  } catch (e: any) {
    return NextResponse.json({ error: 'Embedding failed: ' + e.message }, { status: 500 })
  }

  // Step 2 — Semantic search over memories
  const { data: matches, error: searchError } = await supabaseAdmin.rpc(
    'match_memories',
    {
      query_embedding:  queryEmbedding,
      match_user_id:    userId,
      match_count:      5,
      match_threshold:  0.3,
    }
  )

  if (searchError) {
    return NextResponse.json({ error: searchError.message }, { status: 500 })
  }

  if (!matches || matches.length === 0) {
    return NextResponse.json({
      answer:  "I couldn't find anything relevant in your memories. Try adding more notes first.",
      sources: [],
    })
  }

  // Step 3 — Build context from matches
  const context = matches
    .map((m: any, i: number) =>
      `[${i + 1}] ${m.title ? '"' + m.title + '" — ' : ''}${m.content}`
    )
    .join('\n\n')

  // Step 4 — Call Groq (free, fast, no billing needed)
  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role:    'system',
          content: `You are Engram, a personal AI memory assistant.
Answer ONLY from the user's memories provided below.
Be specific, mention which memory you are drawing from.
If the memories do not contain enough information, say so honestly.
Keep answers clear, concise and useful.`,
        },
        {
          role:    'user',
          content: `My memories:\n\n${context}\n\n---\n\nQuestion: ${question}`,
        },
      ],
      temperature: 0.3,
      max_tokens:  700,
    }),
  })

  if (!groqRes.ok) {
    const err = await groqRes.json()
    return NextResponse.json(
      { error: 'Groq error: ' + (err.error?.message ?? groqRes.statusText) },
      { status: 500 }
    )
  }

  const groqData = await groqRes.json()
  const answer   = groqData.choices?.[0]?.message?.content ?? 'Could not generate an answer.'

  // Step 5 — Return answer + source memories
  return NextResponse.json({
    answer,
    sources: matches.map((m: any) => ({
      id:         m.id,
      title:      m.title,
      content:    m.content.length > 140 ? m.content.slice(0, 140) + '…' : m.content,
      similarity: Math.round(m.similarity * 100),
      created_at: m.created_at,
    })),
  })
}