'use server'

import { createClient } from '@/lib/supabase/server'

export async function sendFeedback(_: string | undefined, formData: FormData): Promise<string | undefined> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 'Not authenticated.'

  const type = String(formData.get('type') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  if (!message) return 'Message is required.'
  if (type !== 'feature' && type !== 'problem') return 'Invalid feedback type.'

  const { error } = await supabase.from('feedback').insert({ user_id: user.id, type, message })
  if (error) return error.message
}
