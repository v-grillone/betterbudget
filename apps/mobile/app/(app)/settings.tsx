import { useState } from 'react'
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { changeName, changePassword, deleteAccount, signOut } from '@/lib/api'

type Section = 'name' | 'password' | 'feature' | 'problem' | 'delete' | null

export default function SettingsScreen() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<Section>(null)
  const [nameVal, setNameVal] = useState('')
  const [passwordVal, setPasswordVal] = useState('')
  const [featureMsg, setFeatureMsg] = useState('')
  const [problemMsg, setProblemMsg] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [pending, setPending] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | undefined>()

  function toggle(section: Section) {
    setActiveSection(prev => prev === section ? null : section)
    setError(undefined)
    setSuccessMsg(undefined)
  }

  async function handleChangeName() {
    if (!nameVal.trim()) return
    setPending(true); setError(undefined)
    const err = await changeName(nameVal.trim())
    setPending(false)
    if (err) { setError(err) } else { setSuccessMsg('Name updated'); setActiveSection(null) }
  }

  async function handleChangePassword() {
    if (!passwordVal) return
    setPending(true); setError(undefined)
    const err = await changePassword(passwordVal)
    setPending(false)
    if (err) { setError(err) } else { setSuccessMsg('Password updated'); setActiveSection(null) }
  }

  async function handleSignOut() {
    await signOut()
  }

  async function handleDeleteAccount() {
    Alert.alert(
      'Delete account',
      'This will permanently delete your account and all data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setPending(true)
            await deleteAccount()
            setPending(false)
          },
        },
      ]
    )
  }

  const rowBtnClass = 'flex-row items-center justify-between py-3'
  const inputClass = 'px-3 py-2 text-sm border border-stone-200 rounded bg-white text-stone-800 mb-3'
  const submitClass = 'py-2.5 rounded bg-stone-700 items-center mb-4'

  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-8">
        {/* Header */}
        <View className="flex-row items-center gap-3 py-4 mb-2">
          <Pressable onPress={() => router.back()} className="p-1">
            <Text className="text-stone-500 text-base">‹</Text>
          </Pressable>
          <Text className="text-xl font-bold text-stone-800">Settings</Text>
        </View>

        {successMsg && (
          <Text className="text-sm text-emerald-600 mb-3">{successMsg}</Text>
        )}

        <View className="bg-white border border-stone-200 rounded-lg px-4 divide-y divide-stone-100">

          {/* Change name */}
          <View>
            <Pressable onPress={() => toggle('name')} className={rowBtnClass}>
              <Text className="text-sm text-stone-800">Change name</Text>
              <Text className="text-stone-400">{activeSection === 'name' ? '↑' : '↓'}</Text>
            </Pressable>
            {activeSection === 'name' && (
              <View className="pb-3">
                <TextInput
                  value={nameVal}
                  onChangeText={setNameVal}
                  placeholder="Your name"
                  placeholderTextColor="#a8a29e"
                  autoCapitalize="words"
                  className={inputClass}
                />
                {error && <Text className="text-xs text-red-600 mb-2">{error}</Text>}
                <Pressable onPress={handleChangeName} disabled={pending} className={submitClass}>
                  <Text className="text-sm font-medium text-white">{pending ? 'Saving...' : 'Save name'}</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Change password */}
          <View>
            <Pressable onPress={() => toggle('password')} className={rowBtnClass}>
              <Text className="text-sm text-stone-800">Change password</Text>
              <Text className="text-stone-400">{activeSection === 'password' ? '↑' : '↓'}</Text>
            </Pressable>
            {activeSection === 'password' && (
              <View className="pb-3">
                <TextInput
                  value={passwordVal}
                  onChangeText={setPasswordVal}
                  placeholder="Min. 8 characters"
                  placeholderTextColor="#a8a29e"
                  secureTextEntry
                  className={inputClass}
                />
                {error && <Text className="text-xs text-red-600 mb-2">{error}</Text>}
                <Pressable onPress={handleChangePassword} disabled={pending} className={submitClass}>
                  <Text className="text-sm font-medium text-white">{pending ? 'Saving...' : 'Save password'}</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Delete account */}
          <View>
            <Pressable onPress={() => toggle('delete')} className={rowBtnClass}>
              <Text className="text-sm text-stone-800">Delete account</Text>
              <Text className="text-stone-400">{activeSection === 'delete' ? '↑' : '↓'}</Text>
            </Pressable>
            {activeSection === 'delete' && (
              <View className="pb-3">
                <Text className="text-xs text-stone-500 mb-3">
                  This will permanently delete your account and all data. This cannot be undone.
                </Text>
                <Pressable
                  onPress={handleDeleteAccount}
                  disabled={pending}
                  className="py-2.5 rounded border border-red-200 items-center mb-4"
                >
                  <Text className="text-sm font-medium text-red-500">Yes, delete my account</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Sign out */}
          <View className="pt-3 pb-1">
            <Pressable onPress={handleSignOut} className="py-2.5 rounded bg-stone-700 items-center">
              <Text className="text-sm font-medium text-white">Sign out</Text>
            </Pressable>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
