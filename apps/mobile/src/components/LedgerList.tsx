import { Pressable, Text, View } from 'react-native'
import { formatDate } from '@betterbudget/shared'
import type { Transaction } from '@betterbudget/shared'

const AMOUNT_COLOR: Record<string, string> = {
  needs: '#818cf8',
  wants: '#f87171',
  investing: '#34d399',
}

interface Props {
  transactions: Transaction[]
  onSelect: (t: Transaction) => void
}

export default function LedgerList({ transactions, onSelect }: Props) {
  if (transactions.length === 0) {
    return (
      <View className="py-8 items-center border border-stone-200 rounded-lg mt-4">
        <Text className="text-sm text-stone-400">No transactions yet. Add one above.</Text>
      </View>
    )
  }

  return (
    <View className="mt-4 border border-stone-200 rounded-lg overflow-hidden">
      {/* Header */}
      <View className="flex-row bg-stone-100 px-3 py-2">
        <Text className="flex-1 text-xs font-medium text-stone-500 uppercase tracking-wide">Date</Text>
        <Text className="flex-[2] text-xs font-medium text-stone-500 uppercase tracking-wide">Description</Text>
        <Text className="w-20 text-xs font-medium text-stone-500 uppercase tracking-wide text-right">Amount</Text>
      </View>

      {transactions.map((t, i) => (
        <Pressable
          key={t.id}
          onPress={() => onSelect(t)}
          className={`flex-row items-center px-3 py-3 ${i > 0 ? 'border-t border-stone-200' : ''} active:bg-stone-100`}
        >
          <Text className="flex-1 text-xs text-stone-500">{formatDate(t.date)}</Text>
          <Text className="flex-[2] text-sm text-stone-800" numberOfLines={1}>{t.description}</Text>
          <Text
            className="w-20 text-sm font-medium text-right"
            style={{ color: AMOUNT_COLOR[t.category] ?? '#a8a29e' }}
          >
            ${Number(t.amount).toFixed(2)}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}
