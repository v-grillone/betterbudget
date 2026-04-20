import { useState } from 'react'
import { Modal, Pressable, Text, TextInput, View } from 'react-native'
import type { Budget } from '@betterbudget/shared'
import { upsertBudget } from '@/lib/api'

interface Props {
  budget: Budget | null
  onSaved: () => void
  onClose: () => void
  visible: boolean
}

export default function BudgetModal({ budget, onSaved, onClose, visible }: Props) {
  const [weeklyAmount, setWeeklyAmount] = useState(String(budget?.weekly_amount ?? ''))
  const [needsPct, setNeedsPct] = useState(String(budget?.needs_pct ?? 50))
  const [wantsPct, setWantsPct] = useState(String(budget?.wants_pct ?? 30))
  const [investingPct, setInvestingPct] = useState(String(budget?.investing_pct ?? 20))
  const [error, setError] = useState<string | undefined>()
  const [pending, setPending] = useState(false)

  const daily = (parseFloat(weeklyAmount) || 0) / 7
  const total = (parseInt(needsPct) || 0) + (parseInt(wantsPct) || 0) + (parseInt(investingPct) || 0)

  async function handleSave() {
    if (pending) return
    setPending(true)
    setError(undefined)
    const err = await upsertBudget(
      parseFloat(weeklyAmount),
      parseInt(needsPct),
      parseInt(wantsPct),
      parseInt(investingPct)
    )
    setPending(false)
    if (err) { setError(err) } else { onSaved(); onClose() }
  }

  const field = 'px-3 py-2 text-sm border border-stone-200 rounded bg-white text-stone-800'
  const label = 'text-xs font-medium text-stone-500 uppercase tracking-wide mb-1'

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View className="flex-1 bg-white px-6 pt-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-base font-semibold text-stone-800">Budget</Text>
          <Pressable onPress={onClose} className="p-1">
            <Text className="text-stone-500 text-sm">Cancel</Text>
          </Pressable>
        </View>

        <View className="mb-3">
          <Text className={label}>Weekly amount</Text>
          <TextInput
            value={weeklyAmount}
            onChangeText={setWeeklyAmount}
            keyboardType="decimal-pad"
            className={field}
          />
        </View>

        <View className="mb-3">
          <Text className={label}>Daily budget</Text>
          <View className="px-3 py-2 border border-stone-200 rounded bg-stone-100">
            <Text className="text-sm text-stone-400">${daily.toFixed(2)}</Text>
          </View>
        </View>

        <View className="flex-row gap-3 mb-3">
          {[
            { key: 'needs', label: 'Needs %', val: needsPct, set: setNeedsPct, color: 'text-indigo-400' },
            { key: 'wants', label: 'Wants %', val: wantsPct, set: setWantsPct, color: 'text-red-400' },
            { key: 'investing', label: 'Investing %', val: investingPct, set: setInvestingPct, color: 'text-emerald-400' },
          ].map(f => (
            <View key={f.key} className="flex-1">
              <Text className={`text-xs font-medium uppercase tracking-wide mb-1 ${f.color}`}>{f.label}</Text>
              <TextInput
                value={f.val}
                onChangeText={f.set}
                keyboardType="number-pad"
                className={field}
              />
            </View>
          ))}
        </View>

        <Text className={`text-xs mb-3 ${total === 100 ? 'text-emerald-500' : 'text-red-400'}`}>
          Total: {total}%{total === 100 ? ' ✓' : ' — must equal 100%'}
        </Text>

        {error && <Text className="text-xs text-red-600 mb-3">{error}</Text>}

        <Pressable
          onPress={handleSave}
          disabled={pending || total !== 100}
          className={`py-2.5 rounded bg-stone-700 items-center ${(pending || total !== 100) ? 'opacity-50' : ''}`}
        >
          <Text className="text-sm font-medium text-white">
            {pending ? 'Saving...' : budget ? 'Update budget' : 'Set budget'}
          </Text>
        </Pressable>
      </View>
    </Modal>
  )
}
