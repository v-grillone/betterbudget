import { useCallback, useEffect, useState } from 'react'
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { Budget, Transaction } from '@betterbudget/shared'
import { currentMonth, daysInMonth } from '@betterbudget/shared'
import { getBudget, getTransactions, getUser } from '@/lib/api'
import { useRouter } from 'expo-router'
import BudgetSummary from '@/components/BudgetSummary'
import BudgetModal from '@/components/BudgetModal'
import LedgerList from '@/components/LedgerList'
import MonthTabs from '@/components/MonthTabs'
import TransactionForm from '@/components/TransactionForm'
import TransactionModal from '@/components/TransactionModal'

export default function DashboardScreen() {
  const [month, setMonth] = useState(currentMonth())
  const [year, setYear] = useState(Number(currentMonth().split('-')[0]))
  const [budget, setBudget] = useState<Budget | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [userName, setUserName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [budgetModalVisible, setBudgetModalVisible] = useState(false)
  const router = useRouter()

  const load = useCallback(async (m: string) => {
    const [b, txs, user] = await Promise.all([getBudget(), getTransactions(m), getUser()])
    setBudget(b)
    setTransactions(txs)
    setUserName(user?.user_metadata?.name ?? null)
    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => { load(month) }, [month])

  function handleMonthChange(m: string) {
    setMonth(m)
    setYear(Number(m.split('-')[0]))
  }

  function handleYearChange(y: number) {
    const [, mm] = month.split('-')
    const newMonth = `${y}-${mm}`
    setMonth(newMonth)
    setYear(y)
  }

  function handleRefresh() {
    setRefreshing(true)
    load(month)
  }

  const days = daysInMonth(month)
  const dailyBudget = (budget?.weekly_amount ?? 0) / 7
  const monthlyBudget = dailyBudget * days

  const greeting = (() => {
    const h = new Date().getHours()
    if (h >= 5 && h < 12) return 'Good morning'
    if (h >= 12 && h < 18) return 'Good afternoon'
    if (h >= 18 && h < 21) return 'Good evening'
    return 'Good night'
  })()

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-stone-50 items-center justify-center">
        <Text className="text-sm text-stone-400">Loading...</Text>
      </SafeAreaView>
    )
  }

  // Onboarding: no budget set yet
  if (!budget) {
    return (
      <SafeAreaView className="flex-1 bg-stone-50 px-4 justify-center">
        <View className="bg-white border border-stone-200 rounded-lg p-6">
          <Text className="text-xl font-bold text-stone-800 mb-2">
            {userName ? `Hey ${userName}!` : 'Hey there!'}
          </Text>
          <Text className="text-sm text-stone-500 mb-6">
            Welcome to betterbudget. Set your weekly budget to get started.
          </Text>
          <Pressable
            onPress={() => setBudgetModalVisible(true)}
            className="py-2.5 rounded bg-stone-700 items-center"
          >
            <Text className="text-sm font-medium text-white">Set my budget</Text>
          </Pressable>
        </View>
        <BudgetModal
          budget={null}
          visible={budgetModalVisible}
          onClose={() => setBudgetModalVisible(false)}
          onSaved={() => load(month)}
        />
      </SafeAreaView>
    )
  }

  const ListHeader = (
    <View className="px-4">
      {/* Header */}
      <View className="flex-row items-center justify-between py-4">
        <Text className="text-xl font-bold text-stone-800">betterbudget</Text>
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => setBudgetModalVisible(true)}
            className="px-3 py-1.5 rounded border border-stone-200"
          >
            <Text className="text-xs text-stone-600">Budget</Text>
          </Pressable>
          <Pressable
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onPress={() => router.push('/(app)/settings' as any)}
            className="px-3 py-1.5 rounded border border-stone-200"
          >
            <Text className="text-xs text-stone-600">Settings</Text>
          </Pressable>
        </View>
      </View>

      {/* Greeting */}
      <Text className="text-sm text-stone-500 mb-3">
        {greeting},{userName ? <Text className="font-medium text-stone-700"> {userName}</Text> : null} let&apos;s add to your budget...
      </Text>

      {/* Month navigation */}
      <MonthTabs
        year={year}
        activeMonth={month}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
      />

      {/* Budget summary + transaction form */}
      <View className="bg-white border border-t-0 border-stone-200 rounded-b-lg px-4 pb-2">
        <BudgetSummary
          transactions={transactions}
          budget={budget}
          dailyBudget={dailyBudget}
          monthlyBudget={monthlyBudget}
          days={days}
        />
        <TransactionForm month={month} onAdded={() => load(month)} />
        <LedgerList transactions={transactions} onSelect={setSelectedTx} />
      </View>
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={ListHeader}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        contentContainerClassName="pb-8"
        keyboardShouldPersistTaps="handled"
      />

      <TransactionModal
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
        onSaved={() => load(month)}
      />

      <BudgetModal
        budget={budget}
        visible={budgetModalVisible}
        onClose={() => setBudgetModalVisible(false)}
        onSaved={() => load(month)}
      />
    </SafeAreaView>
  )
}
