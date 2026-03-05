'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function getTransactions() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  return data ?? []
}

export async function addTransaction(_: string | undefined, formData: FormData): Promise<string | undefined> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 'Not authenticated'

  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const amount = parseFloat(formData.get('amount') as string)
  const date = formData.get('date') as string

  const { error } = await supabase
    .from('transactions')
    .insert({ user_id: user.id, category, description, amount, date })

  if (error) return error.message

  revalidatePath('/')
}
