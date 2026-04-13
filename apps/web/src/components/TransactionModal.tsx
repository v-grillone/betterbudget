'use client'

import { updateTransaction, deleteTransaction } from '@/app/actions/transactions'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CATEGORIES } from '@/lib/constants'
import type { Transaction } from '@/lib/types'
import { useActionState, useEffect, useState, useTransition } from 'react'

interface Props {
  transaction: Transaction | null
  open: boolean
  onClose: () => void
}

export default function TransactionModal({ transaction, open, onClose }: Props) {
  const [error, action, pending] = useActionState(updateTransaction, undefined)
  const [deleteError, setDeleteError] = useState<string | undefined>()
  const [deleting, startDelete] = useTransition()
  const [category, setCategory] = useState(transaction?.category ?? 'needs')

  useEffect(() => {
    if (transaction) setCategory(transaction.category)
  }, [transaction])

  // Close on successful save (error becomes undefined after a successful action that revalidates)
  const [prevPending, setPrevPending] = useState(false)
  useEffect(() => {
    if (prevPending && !pending && !error) onClose()
    setPrevPending(pending)
  }, [pending, error]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleDelete() {
    if (!transaction) return
    startDelete(async () => {
      const err = await deleteTransaction(transaction.id)
      if (err) setDeleteError(err)
      else onClose()
    })
  }

  if (!transaction) return null

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-sm bg-white border border-stone-200 shadow-md rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-stone-800">Edit Transaction</DialogTitle>
        </DialogHeader>
        <form action={action} aria-busy={pending} className="mt-2 flex flex-col gap-3">
          <input type="hidden" name="id" value={transaction.id} />
          <input type="hidden" name="category" value={category} />
          <fieldset disabled={pending || deleting} className="contents">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Date</label>
              <Input
                name="date"
                type="date"
                defaultValue={transaction.date}
                required
                className="text-stone-800"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Description</label>
              <Input
                name="description"
                type="text"
                defaultValue={transaction.description}
                required
                className="text-stone-800"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="text-stone-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
                  ))}
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
                defaultValue={Number(transaction.amount).toFixed(2)}
                required
                className="text-stone-800"
              />
            </div>
            {(error || deleteError) && (
              <p className="text-xs text-red-600">{error ?? deleteError}</p>
            )}
            <div className="flex justify-between gap-2 mt-1">
              <Button
                type="button"
                onClick={handleDelete}
                disabled={deleting || pending}
                className="bg-white text-red-500 border border-red-200 hover:bg-red-50 cursor-pointer"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </Button>
              <Button
                type="submit"
                disabled={pending || deleting}
                className="bg-stone-700 text-white hover:bg-stone-800 cursor-pointer"
              >
                {pending ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  )
}
