'use client'

import { useActionState } from 'react'
import { upsertBudget } from '@/app/actions/budget'

type Budget = {
  monthly_amount: number
  needs_pct: number
  wants_pct: number
  investing_pct: number
} | null

export default function BudgetForm({ budget }: { budget: Budget }) {
  const [error, action, pending] = useActionState(upsertBudget, undefined)

  return (
    <section>
      <h2>Budget</h2>
      {budget && (
        <p>
          Current: ${budget.monthly_amount}/mo — {budget.needs_pct}% needs / {budget.wants_pct}% wants / {budget.investing_pct}% investing
        </p>
      )}
      <form action={action}>
        <div>
          <label>Monthly amount: <input name="monthly_amount" type="number" step="0.01" defaultValue={budget?.monthly_amount} required /></label>
        </div>
        <div>
          <label>Needs %: <input name="needs_pct" type="number" defaultValue={budget?.needs_pct ?? 50} required /></label>
        </div>
        <div>
          <label>Wants %: <input name="wants_pct" type="number" defaultValue={budget?.wants_pct ?? 30} required /></label>
        </div>
        <div>
          <label>Investing %: <input name="investing_pct" type="number" defaultValue={budget?.investing_pct ?? 20} required /></label>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={pending}>
          {pending ? 'Saving...' : budget ? 'Update Budget' : 'Set Budget'}
        </button>
      </form>
    </section>
  )
}
