'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function getBudget() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return data
}

export async function upsertBudget(_: string | undefined, formData: FormData): Promise<string | undefined> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 'Not authenticated'

  const weekly_amount = parseFloat(formData.get('weekly_amount') as string)
  const needs_pct = parseFloat(formData.get('needs_pct') as string)
  const wants_pct = parseFloat(formData.get('wants_pct') as string)
  const investing_pct = parseFloat(formData.get('investing_pct') as string)

  if (needs_pct + wants_pct + investing_pct !== 100) {
    return 'Percentages must sum to 100'
  }

  const { error } = await supabase
    .from('budgets')
    .upsert({ user_id: user.id, weekly_amount, needs_pct, wants_pct, investing_pct }, { onConflict: 'user_id' })

  if (error) return error.message

  revalidatePath('/')
}
