'use client'

import { useRouter } from 'next/navigation'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface MonthTabsProps {
  year: number
  activeMonth: string // YYYY-MM
}

export default function MonthTabs({ year, activeMonth }: MonthTabsProps) {
  const router = useRouter()

  return (
    <div className="flex border-b border-stone-200 bg-stone-50 px-4 gap-1 overflow-x-auto">
      {MONTHS.map((label, i) => {
        const month = `${year}-${String(i + 1).padStart(2, '0')}`
        const isActive = month === activeMonth
        return (
          <button
            key={month}
            onClick={() => router.push(`/?month=${month}`)}
            aria-current={isActive ? 'true' : undefined}
            className={
              isActive
                ? 'px-4 py-2 text-sm font-medium text-stone-800 bg-white border border-b-0 border-stone-200 rounded-t -mb-px whitespace-nowrap'
                : 'px-4 py-2 text-sm text-stone-500 bg-stone-100 border border-b-0 border-stone-200 rounded-t cursor-pointer hover:bg-stone-300 hover:text-stone-700 transition-colors duration-150 whitespace-nowrap'
            }
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
