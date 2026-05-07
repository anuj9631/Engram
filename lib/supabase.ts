import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function signInWithEmail(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password })
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  return await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  })
}

export async function signInWithGoogle() {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/dashboard' },
  })
}

export async function signOut() {
  return await supabase.auth.signOut()
}

export type SourceType = 'note' | 'idea' | 'doc' | 'chat'

export type Memory = {
  id:          string
  user_id:     string
  title:       string | null
  content:     string
  source_type: SourceType
  tags:        string[]
  created_at:  string
  updated_at:  string
  similarity?: number
}