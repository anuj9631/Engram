export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch(
    'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputs: text.slice(0, 512),
        options: { wait_for_model: true },
      }),
    }
  )

  if (!response.ok) {
    throw new Error('Embedding failed: ' + response.statusText)
  }

  const data = await response.json()

  // HuggingFace returns array of arrays — flatten to single array
  const embedding = Array.isArray(data[0]) ? data[0] : data
  return embedding as number[]
}