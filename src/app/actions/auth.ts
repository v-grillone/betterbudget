'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signUp(_: string | undefined, formData: FormData): Promise<string | undefined> {
  const supabase = await createClient()

  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '').trim()

  if (!name || !email || !password) return 'All fields are required.'
  if (password.length < 8) return 'Password must be at least 8 characters.'

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

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/signin')
}
