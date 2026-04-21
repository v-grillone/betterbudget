'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { validateTransaction } from '@betterbudget/shared'

export async function getTransactions(month?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (month) {
    if (!/^\d{4}-\d{2}$/.test(month)) throw new Error(`Invalid month format: ${month}`)
    const [yearStr, monStr] = month.split('-')
    const monNum = Number(monStr)
    if (monNum < 1 || monNum > 12) throw new Error(`Invalid month value: ${monStr}`)
    const yearNum = Number(yearStr)
    const start = `${yearStr}-${monStr}-01`
    const lastDay = new Date(yearNum, monNum, 0).getDate()
    const end = `${yearStr}-${monStr}-${String(lastDay).padStart(2, '0')}`
    query = query.gte('date', start).lte('date', end)
  }

  const { data, error } = await query
  if (error) { console.error('getTransactions:', error.message); return [] }
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

  const validationError = validateTransaction(category, description, amount, date)
  if (validationError) return validationError

  const { error } = await supabase
    .from('transactions')
    .insert({ user_id: user.id, category, description, amount, date })

  if (error) return error.message

  revalidatePath('/')
}

export async function updateTransaction(_: string | undefined, formData: FormData): Promise<string | undefined> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 'Not authenticated'

  const id = formData.get('id') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const amount = parseFloat(formData.get('amount') as string)
  const date = formData.get('date') as string

  const validationError = validateTransaction(category, description, amount, date)
  if (validationError) return validationError

  const { error } = await supabase
    .from('transactions')
    .update({ category, description, amount, date })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return error.message

  revalidatePath('/')
}

export async function deleteTransaction(id: string): Promise<string | undefined> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 'Not authenticated'

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return error.message

  revalidatePath('/')
}
