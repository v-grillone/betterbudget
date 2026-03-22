import { getUser } from '@/app/actions/auth'
import { getBudget } from '@/app/actions/budget'
import { getTransactions } from '@/app/actions/transactions'
import BudgetChart from '@/components/BudgetChart'
import BudgetModal from '@/components/BudgetModal'
import LedgerTable from '@/components/LedgerTable'
import MonthTabs from '@/components/MonthTabs'
import SettingsModal from '@/components/SettingsModal'
import TransactionForm from '@/components/TransactionForm'
import WelcomeMessage from '@/components/WelcomeMessage'
import YearSelect from '@/components/YearSelect'
import { currentMonth, daysInMonth } from '@/lib/dates'
import Image from 'next/image'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>
}) {
  const { month: monthParam } = await searchParams
  const month = monthParam && /^\d{4}-(0[1-9]|1[0-2])$/.test(monthParam)
    ? monthParam
    : currentMonth()
  const year = Number(month.split('-')[0])

  const [budget, transactions, name] = await Promise.all([getBudget(), getTransactions(month), getUser()])

  const days = daysInMonth(month)
  const dailyBudget = (budget?.weekly_amount ?? 0) / 7
  const monthlyBudget = dailyBudget * days

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6">

        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Image src="/images/logos/bb-logo.svg" alt="" width={28} height={24} priority />
            <span className="text-xl font-heading font-light text-stone-800">betterbudget</span>
          </div>
          <div className="flex items-center gap-2">
            <BudgetModal budget={budget} />
            <SettingsModal name={name} />
          </div>
        </header>

        <WelcomeMessage name={name} />

        {/* Month tabs */}
        <div className="mt-2">
          <YearSelect activeYear={year} activeMonthNum={month.split('-')[1]} />
          <MonthTabs year={year} activeMonth={month} />

          {/* Ledger */}
          <div className="bg-white border border-t-0 border-stone-200 rounded-b-lg px-4 pb-6">
            <BudgetChart transactions={transactions} budget={budget} dailyBudget={dailyBudget} monthlyBudget={monthlyBudget} days={days} />
            <TransactionForm month={month} />
            <LedgerTable transactions={transactions} />
          </div>
        </div>

      </div>
    </div>
  )
}
