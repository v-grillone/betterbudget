import { useEffect, useState } from 'react'
import { Modal, Pressable, Text, TextInput, View } from 'react-native'
import { CATEGORIES } from '@betterbudget/shared'
import type { Transaction } from '@betterbudget/shared'
import { deleteTransaction, updateTransaction } from '@/lib/api'

interface Props {
  transaction: Transaction | null
  onClose: () => void
  onSaved: () => void
}

export default function TransactionModal({ transaction, onClose, onSaved }: Props) {
  const [category, setCategory] = useState(transaction?.category ?? 'needs')
  const [description, setDescription] = useState(transaction?.description ?? '')
  const [amount, setAmount] = useState(transaction ? String(Number(transaction.amount).toFixed(2)) : '')
  const [date, setDate] = useState(transaction?.date ?? '')
  const [error, setError] = useState<string | undefined>()
  const [pending, setPending] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (transaction) {
      setCategory(transaction.category)
      setDescription(transaction.description)
      setAmount(String(Number(transaction.amount).toFixed(2)))
      setDate(transaction.date)
      setError(undefined)
    }
  }, [transaction])

  async function handleSave() {
    if (!transaction || pending) return
    setPending(true)
    setError(undefined)
    const err = await updateTransaction(transaction.id, category, description.trim(), parseFloat(amount), date)
    setPending(false)
    if (err) { setError(err) } else { onSaved(); onClose() }
  }

  async function handleDelete() {
    if (!transaction || deleting) return
    setDeleting(true)
    const err = await deleteTransaction(transaction.id)
    setDeleting(false)
    if (err) { setError(err) } else { onSaved(); onClose() }
  }

  return (
    <Modal
      visible={transaction !== null}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white px-6 pt-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-base font-semibold text-stone-800">Edit Transaction</Text>
          <Pressable onPress={onClose} className="p-1">
            <Text className="text-stone-500 text-sm">Cancel</Text>
          </Pressable>
        </View>

        {/* Category */}
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
            className="px-3 py-2 text-sm border border-stone-200 rounded bg-white text-stone-800"
          />
        </View>

        {/* Amount + Date */}
        <View className="flex-row gap-3 mb-3">
          <View className="flex-1">
            <Text className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">Amount</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
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

        {error && <Text className="text-xs text-red-600 mb-3">{error}</Text>}

        <View className="flex-row gap-3">
          <Pressable
            onPress={handleDelete}
            disabled={deleting || pending}
            className={`flex-1 py-2.5 rounded border border-red-200 items-center ${(deleting || pending) ? 'opacity-50' : ''}`}
          >
            <Text className="text-sm font-medium text-red-500">
              {deleting ? 'Deleting…' : 'Delete'}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleSave}
            disabled={pending || deleting}
            className={`flex-1 py-2.5 rounded bg-stone-700 items-center ${(pending || deleting) ? 'opacity-50' : ''}`}
          >
            <Text className="text-sm font-medium text-white">
              {pending ? 'Saving…' : 'Save'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}
