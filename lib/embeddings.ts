/**
 * lib/embeddings.ts
 * Generates embeddings using HuggingFace free API
 * Falls back gracefully if the API is slow or down
 */

export async function generateEmbedding(text: string): Promise<number[] | null> {
  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2',
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          inputs:  text.slice(0, 512),
          options: { wait_for_model: true },
        }),
        // 15 second timeout
        signal: AbortSignal.timeout(15000),
      }
    )

    if (!response.ok) {
      console.error('HuggingFace embedding failed:', response.status, response.statusText)
      return null
    }

    const data = await response.json()

    // HuggingFace returns different formats — handle both
    if (Array.isArray(data) && Array.isArray(data[0])) {
      return data[0] as number[]   // nested array format
    }
    if (Array.isArray(data) && typeof data[0] === 'number') {
      return data as number[]      // flat array format
    }

    console.error('Unexpected embedding format:', typeof data)
    return null

  } catch (e: any) {
    console.error('Embedding error:', e.message)
    return null  // return null instead of throwing — save still works
  }
}