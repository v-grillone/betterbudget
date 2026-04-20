import { CATEGORIES } from './constants'

const VALID_CATEGORIES = CATEGORIES.map(c => c.key)

export function validateTransaction(
  category: string,
  description: string,
  amount: number,
  date: string
): string | undefined {
  if (!VALID_CATEGORIES.includes(category)) return 'Invalid category.'
  if (!description.trim() || description.length > 255) return 'Description must be 1–255 characters.'
  if (!isFinite(amount) || amount <= 0) return 'Amount must be a positive number.'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'Invalid date format.'
}

export function validateBudget(
  weeklyAmount: number,
  needsPct: number,
  wantsPct: number,
  investingPct: number
): string | undefined {
  if (!isFinite(weeklyAmount) || weeklyAmount <= 0) return 'Weekly amount must be a positive number.'
  for (const [label, pct] of [['needs', needsPct], ['wants', wantsPct], ['investing', investingPct]] as [string, number][]) {
    if (!isFinite(pct) || pct < 0 || pct > 100) return `Invalid ${label} percentage.`
  }
  if (Math.round(needsPct + wantsPct + investingPct) !== 100) return 'Percentages must sum to 100'
}
