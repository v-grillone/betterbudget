import { useEffect, useState } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import '../../global.css'

export default function RootLayout() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session === undefined) return
    const inAuth = (segments[0] as string) === '(auth)'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session && !inAuth) router.replace('/(auth)/sign-in' as any)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (session && inAuth) router.replace('/(app)' as any)
  }, [session, segments])

  return <Slot />
}
