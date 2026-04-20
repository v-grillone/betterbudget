import { useState } from 'react'
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView,
  Text, TextInput, View,
} from 'react-native'
import { Link } from 'expo-router'
import { signUp } from '@/lib/api'

export default function SignUpScreen() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [touched, setTouched] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [pending, setPending] = useState(false)

  const checks = {
    length: password.length >= 8,
    number: /\d/.test(password),
    special: /[^a-zA-Z0-9]/.test(password),
  }
  const passwordValid = checks.length && checks.number && checks.special
  const passwordsMatch = password === confirmPassword
  const canSubmit = passwordValid && passwordsMatch && agreed && name.trim().length > 0

  async function handleSubmit() {
    if (pending || !canSubmit) return
    setPending(true)
    setError(undefined)
    const err = await signUp(name.trim(), email.trim(), password)
    if (err) { setError(err); setPending(false) }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-stone-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerClassName="flex-grow items-center justify-center px-4 py-8"
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-sm bg-white border border-stone-200 rounded-lg p-6">
          <Text className="text-xl font-bold text-stone-800 mb-6">betterbudget</Text>

          {/* Name */}
          <View className="mb-4">
            <Text className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
              className="px-3 py-2 text-sm border border-stone-200 rounded bg-white text-stone-800"
            />
          </View>

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
              onChangeText={v => { setPassword(v); setTouched(true) }}
              secureTextEntry
              className="px-3 py-2 text-sm border border-stone-200 rounded bg-white text-stone-800"
            />
            {touched && (
              <View className="mt-1 gap-0.5">
                <Text className={`text-xs ${checks.length ? 'text-emerald-600' : 'text-red-500'}`}>
                  {checks.length ? '✓' : '✗'} At least 8 characters
                </Text>
                <Text className={`text-xs ${checks.number ? 'text-emerald-600' : 'text-red-500'}`}>
                  {checks.number ? '✓' : '✗'} Contains a number
                </Text>
                <Text className={`text-xs ${checks.special ? 'text-emerald-600' : 'text-red-500'}`}>
                  {checks.special ? '✓' : '✗'} Contains a special character
                </Text>
              </View>
            )}
          </View>

          {/* Confirm password */}
          <View className="mb-4">
            <Text className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">Confirm password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              className="px-3 py-2 text-sm border border-stone-200 rounded bg-white text-stone-800"
            />
            {confirmPassword.length > 0 && (
              <Text className={`text-xs mt-1 ${passwordsMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
              </Text>
            )}
          </View>

          {/* Terms */}
          <Pressable onPress={() => setAgreed(v => !v)} className="flex-row items-start gap-2 mb-4">
            <View className={`w-4 h-4 mt-0.5 rounded border items-center justify-center ${agreed ? 'bg-stone-700 border-stone-700' : 'border-stone-300'}`}>
              {agreed && <Text className="text-white text-xs leading-none">✓</Text>}
            </View>
            <Text className="text-xs text-stone-500 flex-1 leading-relaxed">
              I agree to the Terms of Service and Privacy Policy
            </Text>
          </Pressable>

          {error && <Text className="text-xs text-red-600 mb-3">{error}</Text>}

          <Pressable
            onPress={handleSubmit}
            disabled={pending || !canSubmit}
            className={`px-4 py-2.5 rounded bg-stone-700 items-center mb-4 ${(pending || !canSubmit) ? 'opacity-50' : ''}`}
          >
            <Text className="text-sm font-medium text-white">
              {pending ? 'Creating account...' : 'Create account'}
            </Text>
          </Pressable>

          <View className="border-t border-stone-200 mb-4" />

          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link href={"/(auth)/sign-in" as any} asChild>
            <Pressable className="px-4 py-2.5 rounded border border-stone-700 items-center">
              <Text className="text-sm font-medium text-stone-700">I already have an account</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
