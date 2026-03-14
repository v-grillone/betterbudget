'use client'

import { useRouter } from 'next/navigation'

interface YearSelectProps {
  activeYear: number
  activeMonthNum: string // e.g. "03"
}

export default function YearSelect({ activeYear, activeMonthNum }: YearSelectProps) {
  const router = useRouter()
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i)

  return (
    <div className="flex items-center gap-2 mb-2">
      <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Year</label>
      <select
        value={activeYear}
        onChange={(e) => router.push(`/?month=${e.target.value}-${activeMonthNum}`)}
        className="px-2 py-1 text-sm text-stone-700 bg-white border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent cursor-pointer"
      >
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  )
}
