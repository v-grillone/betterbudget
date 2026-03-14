'use client'

import { upsertBudget } from '@/app/actions/budget'
import { useActionState, useState } from 'react'

type Budget = {
  weekly_amount: number
  needs_pct: number
  wants_pct: number
  investing_pct: number
} | null

export default function BudgetForm({ budget, onSuccess }: { budget: Budget; onSuccess?: () => void }) {
  const [weeklyAmount, setWeeklyAmount] = useState(budget?.weekly_amount ?? 0)

  const [error, action, pending] = useActionState(
    async (prev: string | undefined, formData: FormData) => {
      const result = await upsertBudget(prev, formData)
      if (!result) onSuccess?.()
      return result
    },
    undefined
  )

  const dailyBudget = weeklyAmount / 7

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="weekly_amount" className="text-xs font-medium text-stone-500 uppercase tracking-wide">Weekly amount</label>
        <input
          id="weekly_amount"
          name="weekly_amount"
          type="number"
          step="0.01"
          min="0"
          value={weeklyAmount}
          onChange={e => setWeeklyAmount(parseFloat(e.target.value) || 0)}
          required
          className="px-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Daily budget</label>
        <div className="px-3 py-2 text-sm border border-stone-200 rounded bg-stone-100 text-stone-400 cursor-not-allowed">
          ${dailyBudget.toFixed(2)}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="needs_pct" className="text-xs font-medium text-stone-500 uppercase tracking-wide">Needs %</label>
        <input
          id="needs_pct"
          name="needs_pct"
          type="number"
          min="0"
          max="100"
          defaultValue={budget?.needs_pct ?? 50}
          required
          className="px-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="wants_pct" className="text-xs font-medium text-stone-500 uppercase tracking-wide">Wants %</label>
        <input
          id="wants_pct"
          name="wants_pct"
          type="number"
          min="0"
          max="100"
          defaultValue={budget?.wants_pct ?? 30}
          required
          className="px-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="investing_pct" className="text-xs font-medium text-stone-500 uppercase tracking-wide">Investing %</label>
        <input
          id="investing_pct"
          name="investing_pct"
          type="number"
          min="0"
          max="100"
          defaultValue={budget?.investing_pct ?? 20}
          required
          className="px-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className={`px-4 py-2 text-sm font-medium text-white bg-stone-700 rounded hover:bg-stone-800 transition-colors duration-150 ${pending ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {pending ? 'Saving...' : budget ? 'Update budget' : 'Set budget'}
      </button>
    </form>
  )
}
