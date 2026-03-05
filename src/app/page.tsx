import { signOut } from '@/app/actions/auth'
import { getBudget } from '@/app/actions/budget'
import { getTransactions } from '@/app/actions/transactions'
import BudgetForm from '@/components/BudgetForm'
import TransactionForm from '@/components/TransactionForm'

export default async function Home() {
  const [budget, transactions] = await Promise.all([getBudget(), getTransactions()])

  return (
    <div>
      <h1>betterbudget</h1>
      <form action={signOut}>
        <button type="submit">Sign Out</button>
      </form>

      <hr />
      <BudgetForm budget={budget} />

      <hr />
      <TransactionForm />

      <hr />
      <section>
        <h2>Transactions</h2>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.category}</td>
                  <td>{t.description}</td>
                  <td>${t.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
