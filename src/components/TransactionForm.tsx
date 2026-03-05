'use client'

import { useActionState } from 'react'
import { addTransaction } from '@/app/actions/transactions'

const today = new Date().toISOString().split('T')[0]

export default function TransactionForm() {
  const [error, action, pending] = useActionState(addTransaction, undefined)

  return (
    <section>
      <h2>Add Transaction</h2>
      <form action={action}>
        <div>
          <label>Category:&nbsp;
            <select name="category" required>
              <option value="needs">Needs</option>
              <option value="wants">Wants</option>
              <option value="investing">Investing</option>
            </select>
          </label>
        </div>
        <div>
          <label>Description: <input name="description" type="text" required /></label>
        </div>
        <div>
          <label>Amount: <input name="amount" type="number" step="0.01" min="0.01" required /></label>
        </div>
        <div>
          <label>Date: <input name="date" type="date" defaultValue={today} required /></label>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={pending}>{pending ? 'Adding...' : 'Add'}</button>
      </form>
    </section>
  )
}
