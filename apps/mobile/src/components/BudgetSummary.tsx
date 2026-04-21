import { Text, View } from 'react-native'
import { CATEGORIES } from '@betterbudget/shared'
import type { Budget, Transaction } from '@betterbudget/shared'

interface Props {
  transactions: Transaction[]
  budget: Budget
  dailyBudget: number
  monthlyBudget: number
  days: number
}

export default function BudgetSummary({ transactions, budget, dailyBudget, monthlyBudget, days }: Props) {
  const spent = {
    needs:     transactions.filter(t => t.category === 'needs').reduce((s, t) => s + Number(t.amount), 0),
    wants:     transactions.filter(t => t.category === 'wants').reduce((s, t) => s + Number(t.amount), 0),
    investing: transactions.filter(t => t.category === 'investing').reduce((s, t) => s + Number(t.amount), 0),
  }

  const totalSpent = spent.needs + spent.wants + spent.investing
  const netRemaining = monthlyBudget - totalSpent

  return (
    <View className="py-4 border-b border-stone-200">
      {/* Budget line */}
      <Text className="text-xs text-stone-400 mb-3">
        ${dailyBudget.toFixed(2)}/day × {days} days = ${monthlyBudget.toFixed(2)}/mo
      </Text>

      {/* Net remaining */}
      <View className="flex-row items-baseline gap-1 mb-4">
        <Text className={`text-2xl font-bold ${netRemaining < 0 ? 'text-red-500' : 'text-stone-800'}`}>
          ${Math.abs(netRemaining).toFixed(2)}
        </Text>
        <Text className="text-sm text-stone-400">{netRemaining < 0 ? 'over budget' : 'remaining'}</Text>
      </View>

      {/* Category rows */}
      {CATEGORIES.map(c => {
        const s = spent[c.key as keyof typeof spent]
        const alloc = monthlyBudget * ((budget[c.pctKey as keyof Budget] as number) / 100)
        const remaining = alloc - s
        const fillPct = alloc > 0 ? Math.min((s / alloc) * 100, 100) : 0

        return (
          <View key={c.key} className="mb-3">
            <View className="flex-row justify-between mb-1">
              <View className="flex-row items-center gap-2">
                <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <Text className="text-sm text-stone-600">
                  {c.label} ({budget[c.pctKey as keyof Budget]}%)
                </Text>
              </View>
              <Text className="text-xs text-stone-500">
                ${s.toFixed(2)} / ${alloc.toFixed(2)}
              </Text>
            </View>
            {/* Progress bar */}
            <View className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{ width: `${fillPct}%`, backgroundColor: s > alloc ? '#ef4444' : c.color }}
              />
            </View>
            <Text className="text-xs text-stone-400 mt-0.5">
              {remaining >= 0 ? `$${remaining.toFixed(2)} left` : `$${Math.abs(remaining).toFixed(2)} over`}
            </Text>
          </View>
        )
      })}
    </View>
  )
}
