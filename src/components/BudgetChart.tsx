'use client'

import { CATEGORIES } from '@/lib/constants'
import type { Budget, Transaction } from '@/lib/types'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

interface Props {
  transactions: Transaction[]
  budget: Budget | null
  dailyBudget: number
  monthlyBudget: number
  days: number
}

export default function BudgetChart({ transactions, budget, dailyBudget, monthlyBudget, days }: Props) {
  const monthly = monthlyBudget

  const spent = {
    needs:     transactions.filter(t => t.category === 'needs').reduce((s, t) => s + Number(t.amount), 0),
    wants:     transactions.filter(t => t.category === 'wants').reduce((s, t) => s + Number(t.amount), 0),
    investing: transactions.filter(t => t.category === 'investing').reduce((s, t) => s + Number(t.amount), 0),
  }

  const allocated = {
    needs:     monthly * ((budget?.needs_pct ?? 0) / 100),
    wants:     monthly * ((budget?.wants_pct ?? 0) / 100),
    investing: monthly * ((budget?.investing_pct ?? 0) / 100),
  }

  const totalSpent = spent.needs + spent.wants + spent.investing
  const netRemaining = monthly - totalSpent

  const chartData = CATEGORIES.map(c => ({
    name:  c.key,
    value: spent[c.key as keyof typeof spent] || 0,
    color: c.color,
  }))

  const hasAnySpend = totalSpent > 0
  const displayData = hasAnySpend
    ? chartData
    : [{ name: 'empty', value: 1, color: '#e7e5e4' }]

  return (
    <div className="py-6 border-b border-stone-200">
      <div className="flex gap-6 items-start">
        {/* Doughnut */}
        <div className="relative w-36 h-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
                dataKey="value"
                strokeWidth={0}
              >
                {displayData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-stone-500">{netRemaining < 0 ? 'over' : 'left'}</span>
            <span className={`text-sm font-medium ${netRemaining < 0 ? 'text-red-600' : 'text-stone-400'}`}>
              ${Math.abs(netRemaining).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Category summary */}
        <div className="flex flex-col gap-3 flex-1">
          <p className="text-xs text-stone-400">
            Monthly Budget: ${dailyBudget.toFixed(2)}/day × {days} days = ${monthlyBudget.toFixed(2)}/mo
          </p>
          {CATEGORIES.map(c => {
            const s = spent[c.key as keyof typeof spent]
            const alloc = allocated[c.key as keyof typeof allocated]
            const remaining = alloc - s
            const budgetPct = budget?.[c.pctKey as keyof Budget] ?? 0
            const spendPct = totalSpent > 0 ? Math.round((s / totalSpent) * 100) : null
            return (
              <div key={c.key} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${c.swatch}`} />
                <span className="text-sm text-stone-500 w-28">{c.label} ({budgetPct}%)</span>
                <span className="text-sm text-stone-800">${s.toFixed(2)} spent</span>
                {spendPct !== null && (
                  <span className="text-xs text-stone-400">({spendPct}%)</span>
                )}
                <span className="text-xs text-stone-500 ml-1">
                  {remaining >= 0 ? `$${remaining.toFixed(2)} left` : `$${Math.abs(remaining).toFixed(2)} over`}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
