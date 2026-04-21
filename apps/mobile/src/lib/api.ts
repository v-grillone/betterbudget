import { validateBudget, validateTransaction } from '@betterbudget/shared'
import { supabase } from './supabase/client'

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getBudget() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('budgets').select('*').eq('user_id', user.id).single()
  return data
}

export async function getTransactions(month: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const [yearStr, monStr] = month.split('-')
  const lastDay = new Date(Number(yearStr), Number(monStr), 0).getDate()
  const start = `${yearStr}-${monStr}-01`
  const end = `${yearStr}-${monStr}-${String(lastDay).padStart(2, '0')}`
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', start)
    .lte('date', end)
    .order('date', { ascending: false })
  if (error) return []
  return data ?? []
}

export async function addTransaction(
  category: string, description: string, amount: number, date: string
): Promise<string | undefined> {
  const err = validateTransaction(category, description, amount, date)
  if (err) return err
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 'Not authenticated'
  const { error } = await supabase.from('transactions').insert({ user_id: user.id, category, description, amount, date })
  return error?.message
}

export async function updateTransaction(
  id: string, category: string, description: string, amount: number, date: string
): Promise<string | undefined> {
  const err = validateTransaction(category, description, amount, date)
  if (err) return err
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 'Not authenticated'
  const { error } = await supabase
    .from('transactions')
    .update({ category, description, amount, date })
    .eq('id', id)
    .eq('user_id', user.id)
  return error?.message
}

export async function deleteTransaction(id: string): Promise<string | undefined> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 'Not authenticated'
  const { error } = await supabase.from('transactions').delete().eq('id', id).eq('user_id', user.id)
  return error?.message
}

export async function upsertBudget(
  weeklyAmount: number, needsPct: number, wantsPct: number, investingPct: number
): Promise<string | undefined> {
  const err = validateBudget(weeklyAmount, needsPct, wantsPct, investingPct)
  if (err) return err
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 'Not authenticated'
  const { error } = await supabase.from('budgets').upsert(
    { user_id: user.id, weekly_amount: weeklyAmount, needs_pct: needsPct, wants_pct: wantsPct, investing_pct: investingPct },
    { onConflict: 'user_id' }
  )
  return error?.message
}

export async function signIn(email: string, password: string): Promise<string | undefined> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return error?.message
}

export async function signUp(name: string, email: string, password: string): Promise<string | undefined> {
  const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
  return error?.message
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

export async function changeName(name: string): Promise<string | undefined> {
  const { error } = await supabase.auth.updateUser({ data: { name } })
  return error?.message
}

export async function changePassword(password: string): Promise<string | undefined> {
  const { error } = await supabase.auth.updateUser({ password })
  return error?.message
}

export async function deleteAccount(): Promise<string | undefined> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 'Not authenticated'
  const { error } = await supabase.functions.invoke('delete-account')
  if (error) return error.message
  await supabase.auth.signOut()
}
