import { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { CATEGORIES } from '@betterbudget/shared'
import { defaultDate } from '@betterbudget/shared'
import { addTransaction } from '@/lib/api'

interface Props {
  month: string
  onAdded: () => void
}

export default function TransactionForm({ month, onAdded }: Props) {
  const [category, setCategory] = useState('needs')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(defaultDate(month))
  const [error, setError] = useState<string | undefined>()
  const [pending, setPending] = useState(false)

  async function handleSubmit() {
    if (pending) return
    setPending(true)
    setError(undefined)
    const err = await addTransaction(category, description.trim(), parseFloat(amount), date)
    if (err) {
      setError(err)
      setPending(false)
    } else {
      setDescription('')
      setAmount('')
      setDate(defaultDate(month))
      setPending(false)
      onAdded()
    }
  }

  return (
    <View className={`py-4 ${pending ? 'opacity-50' : ''}`}>
      <Text className="text-base font-bold text-stone-800 mb-3">Transactions</Text>

      {/* Category selector */}
      <View className="mb-3">
        <Text className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">Category</Text>
        <View className="flex-row gap-2">
          {CATEGORIES.map(c => (
            <Pressable
              key={c.key}
              onPress={() => setCategory(c.key)}
              className={`flex-1 py-2 rounded border items-center ${category === c.key ? 'border-stone-700 bg-stone-700' : 'border-stone-200'}`}
            >
              <Text className={`text-xs font-medium ${category === c.key ? 'text-white' : 'text-stone-600'}`}>
                {c.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Description */}
      <View className="mb-3">
        <Text className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="e.g. Grocery run"
          placeholderTextColor="#a8a29e"
          className="px-3 py-2 text-sm border border-stone-200 rounded bg-white text-stone-800"
        />
      </View>

      {/* Amount + Date row */}
      <View className="flex-row gap-3 mb-3">
        <View className="flex-1">
          <Text className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">Amount</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor="#a8a29e"
            keyboardType="decimal-pad"
            className="px-3 py-2 text-sm border border-stone-200 rounded bg-white text-stone-800"
          />
        </View>
        <View className="flex-1">
          <Text className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">Date</Text>
          <TextInput
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#a8a29e"
            className="px-3 py-2 text-sm border border-stone-200 rounded bg-white text-stone-800"
          />
        </View>
      </View>

      {error && <Text className="text-xs text-red-600 mb-2">{error}</Text>}

      <Pressable
        onPress={handleSubmit}
        disabled={pending}
        className="py-2.5 rounded bg-stone-700 items-center"
      >
        <Text className="text-sm font-medium text-white">Add Transaction</Text>
      </Pressable>
    </View>
  )
}
