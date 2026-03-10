'use client'

import { upsertBudget } from '@/app/actions/budget'
import { useActionState } from 'react'

type Budget = {
  monthly_amount: number
  needs_pct: number
  wants_pct: number
  investing_pct: number
} | null

export default function BudgetForm({ budget, onSuccess }: { budget: Budget; onSuccess?: () => void }) {
  const [error, action, pending] = useActionState(
    async (prev: string | undefined, formData: FormData) => {
      const result = await upsertBudget(prev, formData)
      if (!result) onSuccess?.()
      return result
    },
    undefined
  )

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="monthly_amount" className="text-xs font-medium text-stone-500 uppercase tracking-wide">Monthly amount</label>
        <input
          id="monthly_amount"
          name="monthly_amount"
          type="number"
          step="0.01"
          min="0"
          defaultValue={budget?.monthly_amount}
          required
          className="px-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
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
          className="px-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
          className="px-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
          className="px-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className={`px-4 py-2 text-sm font-medium text-white bg-amber-700 rounded hover:bg-amber-800 transition-colors duration-150 ${pending ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {pending ? 'Saving...' : budget ? 'Update budget' : 'Set budget'}
      </button>
    </form>
  )
}
