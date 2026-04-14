export interface Transaction {
  id: string
  category: string
  description: string
  amount: number
  date: string
}

export interface Budget {
  weekly_amount: number
  needs_pct: number
  wants_pct: number
  investing_pct: number
}
