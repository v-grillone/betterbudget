'use client'

import { addTransaction } from '@/app/actions/transactions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { defaultDate } from '@/lib/dates'
import { useActionState, useState } from 'react'

export default function TransactionForm({ month }: { month: string }) {
  const [error, action, pending] = useActionState(addTransaction, undefined)
  const [category, setCategory] = useState('needs')

  return (
    <div className={`px-3 py-4 flex flex-col gap-4 ${pending ? 'opacity-50 pointer-events-none' : ''}`}>
      <h2 className="text-lg font-heading font-bold text-stone-800">Transactions</h2>
      <form action={action} aria-busy={pending}>
        <fieldset disabled={pending} className="contents">
          <div className="flex flex-col gap-4">
            {/* Row 1: Date + Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Date</label>
                <Input
                  name="date"
                  type="date"
                  defaultValue={defaultDate(month)}
                  required
                  className="w-full text-stone-800"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Description</label>
                <Input
                  name="description"
                  type="text"
                  placeholder="e.g. Grocery run"
                  required
                  className="w-full text-stone-800"
                />
              </div>
            </div>

            {/* Row 2: Category + Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Category</label>
                <input type="hidden" name="category" value={category} />
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full text-stone-800 cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="needs">Needs</SelectItem>
                    <SelectItem value="wants">Wants</SelectItem>
                    <SelectItem value="investing">Investing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Amount</label>
                <Input
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  required
                  className="w-full text-stone-800"
                />
              </div>
            </div>

            {/* Submit */}
            {error && <p className="text-xs text-red-600">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-stone-700 text-white hover:bg-stone-800 cursor-pointer"
            >
              Add Transaction
            </Button>
          </div>
        </fieldset>
      </form>
    </div>
  )
}
