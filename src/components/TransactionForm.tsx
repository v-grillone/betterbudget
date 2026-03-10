'use client'

import { addTransaction } from '@/app/actions/transactions'
import { Plus } from 'lucide-react'
import { useActionState } from 'react'

function defaultDate(month: string) {
  const now = new Date()
  const todayMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  if (month === todayMonth) {
    return `${todayMonth}-${String(now.getDate()).padStart(2, '0')}`
  }
  return `${month}-01`
}

export default function TransactionForm({ month }: { month: string }) {
  const [error, action, pending] = useActionState(addTransaction, undefined)

  return (
    <form action={action} aria-busy={pending}>
      <fieldset disabled={pending} className={`border-0 border-t border-stone-200 p-0 m-0 min-w-0 bg-white flex items-center gap-0 ${pending ? 'opacity-50' : ''}`}>
        <input
          name="date"
          type="date"
          defaultValue={defaultDate(month)}
          required
          aria-label="Date"
          className="w-36 px-3 py-2 text-sm bg-transparent border-none outline-none text-stone-800 focus:ring-0"
        />
        <input
          name="description"
          type="text"
          placeholder="Description"
          required
          aria-label="Description"
          className="flex-1 px-3 py-2 text-sm bg-transparent border-none outline-none placeholder:text-stone-400 text-stone-800 focus:ring-0"
        />
        <select
          name="category"
          required
          aria-label="Category"
          className="w-28 px-3 py-2 text-sm bg-transparent border-none outline-none text-stone-500 focus:ring-0"
        >
          <option value="needs">Needs</option>
          <option value="wants">Wants</option>
          <option value="investing">Investing</option>
        </select>
        <input
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          required
          aria-label="Amount"
          className="w-24 px-3 py-2 text-sm bg-transparent border-none outline-none placeholder:text-stone-400 text-stone-800 text-right focus:ring-0"
        />
        <button
          type="submit"
          className="px-3 py-2 text-amber-700 hover:text-amber-800 hover:bg-amber-50 rounded transition-colors duration-150"
          aria-label="Add transaction"
        >
          <Plus size={16} />
        </button>
      </fieldset>
      {error && (
        <p className="px-3 py-1.5 text-xs text-red-600 border-t border-stone-200 bg-white">
          {error}
        </p>
      )}
    </form>
  )
}
