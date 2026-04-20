import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnon)

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type SourceType = 'note' | 'idea' | 'doc' | 'chat'

export type Memory = {
  id: string
  user_id: string
  title: string | null
  content: string
  source_type: SourceType
  tags: string[]
  created_at: string
  updated_at: string
  similarity?: number
}