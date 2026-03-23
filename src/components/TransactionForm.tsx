'use client'

import { addTransaction } from '@/app/actions/transactions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { defaultDate } from '@/lib/dates'
import { Plus } from 'lucide-react'
import { useActionState, useState } from 'react'

export default function TransactionForm({ month }: { month: string }) {
  const [error, action, pending] = useActionState(addTransaction, undefined)
  const [category, setCategory] = useState('needs')

  return (
    <>
    <h2 className="px-3 pt-4 pb-0 text-lg font-heading font-bold text-stone-800">Add Transaction</h2>
    <form action={action} aria-busy={pending} className="">
      <fieldset disabled={pending} className={`border-0 p-0 m-0 min-w-0 bg-white flex items-center gap-0 ${pending ? 'opacity-50' : ''}`}>
        <Input
          name="date"
          type="date"
          defaultValue={defaultDate(month)}
          required
          aria-label="Date"
          className="w-36 border-none bg-transparent shadow-none focus-visible:ring-0 text-stone-800"
        />
        <Input
          name="description"
          type="text"
          placeholder="Description"
          required
          aria-label="Description"
          className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 placeholder:text-stone-400 text-stone-800"
        />
        <input type="hidden" name="category" value={category} />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger aria-label="Category" className="w-28 border-none bg-transparent shadow-none focus:ring-0 text-stone-500 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="needs">Needs</SelectItem>
            <SelectItem value="wants">Wants</SelectItem>
            <SelectItem value="investing">Investing</SelectItem>
          </SelectContent>
        </Select>
        <Input
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          required
          aria-label="Amount"
          className="w-24 border-none bg-transparent shadow-none focus-visible:ring-0 placeholder:text-stone-400 text-stone-800 text-right"
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          aria-label="Add transaction"
          className="text-stone-700 hover:text-stone-800 hover:bg-stone-300 cursor-pointer"
        >
          <Plus size={16} />
        </Button>
      </fieldset>
      {error && (
        <p className="px-3 py-1.5 text-xs text-red-600 border-t border-stone-200 bg-white">
          {error}
        </p>
      )}
    </form>
    </>
  )
}
