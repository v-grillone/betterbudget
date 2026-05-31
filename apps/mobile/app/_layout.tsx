import { useEffect, useState } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { useFonts, Raleway_300Light, Raleway_700Bold } from '@expo-google-fonts/raleway'
import { Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat'
import * as SplashScreen from 'expo-splash-screen'
import '../global.css'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const router = useRouter()
  const segments = useSegments()

  const [fontsLoaded] = useFonts({
    Raleway_300Light,
    Raleway_700Bold,
    Montserrat_400Regular,
    Montserrat_500Medium,
  })

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => setSession(session))
      .catch(() => setSession(null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (fontsLoaded && session !== undefined) SplashScreen.hideAsync()
  }, [fontsLoaded, session])

  useEffect(() => {
    if (session === undefined) return
    const inAuth = (segments[0] as string) === '(auth)'
    const inApp = (segments[0] as string) === '(app)'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session && !inAuth) router.replace('/(auth)/sign-in' as any)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    else if (session && !inApp) router.replace('/(app)' as any)
  }, [session, segments])

  if (session === undefined || !fontsLoaded) return null

  return <Slot />
}
