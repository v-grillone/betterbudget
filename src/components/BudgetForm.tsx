'use client'

import { upsertBudget } from '@/app/actions/budget'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Budget } from '@/lib/types'
import { useActionState, useState } from 'react'

export default function BudgetForm({ budget, onSuccess }: { budget: Budget | null; onSuccess?: () => void }) {
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
        <Input
          id="weekly_amount"
          name="weekly_amount"
          type="number"
          step="0.01"
          min="0"
          value={weeklyAmount}
          onChange={e => setWeeklyAmount(parseFloat(e.target.value) || 0)}
          required
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
        <Input
          id="needs_pct"
          name="needs_pct"
          type="number"
          min="0"
          max="100"
          defaultValue={budget?.needs_pct ?? 50}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="wants_pct" className="text-xs font-medium text-stone-500 uppercase tracking-wide">Wants %</label>
        <Input
          id="wants_pct"
          name="wants_pct"
          type="number"
          min="0"
          max="100"
          defaultValue={budget?.wants_pct ?? 30}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="investing_pct" className="text-xs font-medium text-stone-500 uppercase tracking-wide">Investing %</label>
        <Input
          id="investing_pct"
          name="investing_pct"
          type="number"
          min="0"
          max="100"
          defaultValue={budget?.investing_pct ?? 20}
          required
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <Button type="submit" disabled={pending} className="w-full bg-stone-700 hover:bg-stone-800">
        {pending ? 'Saving...' : budget ? 'Update budget' : 'Set budget'}
      </Button>
    </form>
  )
}
