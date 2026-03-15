import { formatDate } from '@/lib/dates'
import { AMOUNT_CLASS } from '@/lib/constants'
import type { Transaction } from '@/lib/types'

export default function LedgerTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="mt-4 w-full border border-stone-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-stone-100">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-stone-500 uppercase tracking-wide">Date</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-stone-500 uppercase tracking-wide">Description</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-stone-500 uppercase tracking-wide">Category</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-stone-500 uppercase tracking-wide">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-3 py-8 text-center text-sm text-stone-400">
                No transactions yet. Add one above.
              </td>
            </tr>
          ) : (
            transactions.map((t) => (
              <tr key={t.id} className="border-t border-stone-200 hover:bg-stone-300 transition-colors duration-150">
                <td className="px-3 py-3 text-sm text-stone-500">{formatDate(t.date)}</td>
                <td className="px-3 py-3 text-sm text-stone-800">{t.description}</td>
                <td className="px-3 py-3 text-sm text-stone-500 capitalize">{t.category}</td>
                <td className={`px-3 py-3 text-sm font-medium text-right ${AMOUNT_CLASS[t.category] ?? 'text-stone-400'}`}>
                  ${Number(t.amount).toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
