'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function signUp(_: string | undefined, formData: FormData): Promise<string | undefined> {
  const supabase = await createClient()

  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '').trim()

  if (!name || !email || !password) return 'All fields are required.'
  if (name.length > 100) return 'Name must be 100 characters or fewer.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email address.'
  if (password.length < 8) return 'Password must be at least 8 characters.'
  if (!/\d/.test(password)) return 'Password must contain at least one number.'
  if (!/[^a-zA-Z0-9]/.test(password)) return 'Password must contain at least one special character.'
  if (!formData.get('agreed')) return 'You must agree to the Terms of Service and Privacy Policy.'

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  })

  if (error) return error.message

  redirect('/')
}

export async function signIn(_: string | undefined, formData: FormData): Promise<string | undefined> {
  const supabase = await createClient()

  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '').trim()

  if (!email || !password) return 'All fields are required.'
  if (password.length < 8) return 'Password must be at least 8 characters.'

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return error.message

  redirect('/')
}

type ResetPasswordState = { error?: string; success?: boolean }

export async function requestPasswordReset(
  _: ResetPasswordState | undefined,
  formData: FormData
): Promise<ResetPasswordState> {
  const supabase = await createClient()

  const email = String(formData.get('email') ?? '').trim().toLowerCase()

  if (!email) return { error: 'Email is required.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Invalid email address.' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!siteUrl) return { error: 'Site URL is not configured.' }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  })

  if (error) return { error: error.message }

  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/signin')
}

export async function getUser(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.user_metadata?.name ?? null
}

export async function changeName(_: string | undefined, formData: FormData): Promise<string | undefined> {
  const supabase = await createClient()

  const name = String(formData.get('name') ?? '').trim()
  if (!name) return 'Name is required.'
  if (name.length > 100) return 'Name must be 100 characters or fewer.'

  const { error } = await supabase.auth.updateUser({ data: { name } })
  if (error) return error.message

  revalidatePath('/')
}

export async function changePassword(_: string | undefined, formData: FormData): Promise<string | undefined> {
  const supabase = await createClient()

  const password = String(formData.get('password') ?? '').trim()
  if (!password || password.length < 8) return 'Password must be at least 8 characters.'
  if (!/\d/.test(password)) return 'Password must contain at least one number.'
  if (!/[^a-zA-Z0-9]/.test(password)) return 'Password must contain at least one special character.'

  const { error } = await supabase.auth.updateUser({ password })
  if (error) return error.message
}

export async function deleteAccount(): Promise<string | undefined> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 'Not authenticated.'

  const uid = user.id

  await supabase.from('transactions').delete().eq('user_id', uid)
  await supabase.from('budgets').delete().eq('user_id', uid)
  await supabase.from('feedback').delete().eq('user_id', uid)
  await supabase.from('users').delete().eq('user_id', uid)

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.deleteUser(uid)
  if (error) return error.message

  redirect('/signin')
}
