import { useState } from 'react'
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView,
  Text, TextInput, View,
} from 'react-native'
import { Link } from 'expo-router'
import { signIn } from '@/lib/api'

export default function SignInScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [pending, setPending] = useState(false)

  async function handleSubmit() {
    if (pending) return
    setPending(true)
    setError(undefined)
    const err = await signIn(email.trim(), password)
    if (err) { setError(err); setPending(false) }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-stone-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerClassName="flex-grow items-center justify-center px-4"
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-sm bg-white border border-stone-200 rounded-lg p-6">
          {/* Logo */}
          <Text className="text-xl font-bold text-stone-800 mb-6">betterbudget</Text>

          {/* Email */}
          <View className="mb-4">
            <Text className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              className="px-3 py-2 text-sm border border-stone-200 rounded bg-white text-stone-800"
            />
          </View>

          {/* Password */}
          <View className="mb-4">
            <Text className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              className="px-3 py-2 text-sm border border-stone-200 rounded bg-white text-stone-800"
            />
          </View>

          {error && <Text className="text-xs text-red-600 mb-3">{error}</Text>}

          <Pressable
            onPress={handleSubmit}
            disabled={pending}
            className={`px-4 py-2.5 rounded bg-stone-700 items-center mb-4 ${pending ? 'opacity-50' : ''}`}
          >
            <Text className="text-sm font-medium text-white">
              {pending ? 'Signing in...' : 'Sign in'}
            </Text>
          </Pressable>

          <View className="border-t border-stone-200 mb-4" />

          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link href={"/(auth)/sign-up" as any} asChild>
            <Pressable className="px-4 py-2.5 rounded border border-stone-700 items-center">
              <Text className="text-sm font-medium text-stone-700">Sign up</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
