'use client'

import BudgetForm from '@/components/BudgetForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ChartPie } from 'lucide-react'
import { useState } from 'react'

type Budget = {
  weekly_amount: number
  needs_pct: number
  wants_pct: number
  investing_pct: number
} | null

export default function BudgetModal({ budget }: { budget: Budget }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-1.5 rounded text-stone-500 hover:bg-stone-300 cursor-pointer transition-colors duration-150"
        aria-label="Budget settings"
      >
        <ChartPie size={18} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm bg-white border border-stone-200 shadow-sm rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-stone-800">Budget settings</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <BudgetForm budget={budget} onSuccess={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
