'use client'

import { MONTHS } from '@/lib/constants'
import { useRouter } from 'next/navigation'

interface MonthTabsProps {
  year: number
  activeMonth: string // YYYY-MM
}

export default function MonthTabs({ year, activeMonth }: MonthTabsProps) {
  const router = useRouter()

  return (
    <div className="flex border-b border-stone-200 bg-stone-50">
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
                ? 'flex-1 px-1 py-2 text-xs sm:text-sm font-medium text-center text-stone-800 bg-white border border-b-0 border-stone-200 rounded-t -mb-px not-first:border-l-0'
                : 'flex-1 px-1 py-2 text-xs sm:text-sm text-center text-stone-500 bg-stone-100 border border-b-0 border-stone-200 rounded-t cursor-pointer hover:bg-stone-300 hover:text-stone-700 transition-colors duration-150 not-first:border-l-0'
            }
          >
            <span className="sm:hidden">{isActive ? label : label[0]}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
