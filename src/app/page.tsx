import { signOut } from '@/app/actions/auth'
import { getBudget } from '@/app/actions/budget'
import { getTransactions } from '@/app/actions/transactions'
import BudgetChart from '@/components/BudgetChart'
import BudgetModal from '@/components/BudgetModal'
import LedgerTable from '@/components/LedgerTable'
import MonthTabs from '@/components/MonthTabs'
import TransactionForm from '@/components/TransactionForm'

function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

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

  const [budget, transactions] = await Promise.all([getBudget(), getTransactions(month)])

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6">

        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-stone-800">betterbudget</h1>
          <div className="flex items-center gap-2">
            <BudgetModal budget={budget} />
            <form action={signOut}>
              <button
                type="submit"
                className="px-3 py-1.5 text-sm text-stone-500 rounded hover:bg-stone-100 transition-colors duration-150"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>

        {/* Month tabs */}
        <div className="mt-6">
          <MonthTabs year={year} activeMonth={month} />

          {/* Ledger */}
          <div className="bg-white border border-t-0 border-stone-200 rounded-b-lg px-4 pb-6">
            <LedgerTable transactions={transactions} />
            <TransactionForm month={month} />
            <BudgetChart transactions={transactions} budget={budget} />
          </div>
        </div>

      </div>
    </div>
  )
}
