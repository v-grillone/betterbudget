import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — betterbudget',
}

export default function PolicyPage() {
  return (
    <div className="flex-1 bg-stone-50">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:px-8 sm:py-12">
        <h1 className="font-heading font-bold text-stone-800 text-xl mb-2">Privacy Policy</h1>
        <p className="text-xs text-stone-500 mb-8">Effective April 3, 2026</p>

        <h2 className="font-heading font-bold text-stone-800 mt-8 mb-2">1. What we collect</h2>
        <p className="text-sm text-stone-700 leading-relaxed">
          When you create a betterbudget account, we collect your name, email address, and password. Your password is never stored in readable form — it is hashed and managed by Supabase Auth.
        </p>
        <p className="text-sm text-stone-700 leading-relaxed mt-3">Once you set up a budget, we also store:</p>
        <ul className="list-disc list-inside text-sm text-stone-700 leading-relaxed space-y-1 mt-2">
          <li>Your weekly spending amount and the percentage split across Needs, Wants, and Investing</li>
          <li>Transactions you log: category, description, amount, and date</li>
          <li>Optional feedback you submit (type and message)</li>
        </ul>
        <p className="text-sm text-stone-700 leading-relaxed mt-3">We do not collect payment information at this time.</p>

        <h2 className="font-heading font-bold text-stone-800 mt-8 mb-2">2. How we use your data</h2>
        <p className="text-sm text-stone-700 leading-relaxed">
          Your data is used exclusively to provide betterbudget's core functionality — showing you your budget, tracking your spending, and generating the charts and summaries you see in the app. We do not use your data for advertising or profiling.
        </p>

        <h2 className="font-heading font-bold text-stone-800 mt-8 mb-2">3. Data storage and processors</h2>
        <p className="text-sm text-stone-700 leading-relaxed">
          betterbudget is built on Supabase, which handles authentication and database storage. Your data is stored on Supabase-managed infrastructure. Row-level security (RLS) policies ensure that each user can only access their own data — even at the database query level.
        </p>
        <p className="text-sm text-stone-700 leading-relaxed mt-3">
          Stripe is part of our technical stack but is not currently used to process payments. If billing is introduced in the future, this policy will be updated before it takes effect.
        </p>

        <h2 className="font-heading font-bold text-stone-800 mt-8 mb-2">4. Data we do not sell</h2>
        <p className="text-sm text-stone-700 leading-relaxed">
          We do not sell, rent, or share your personal data with third parties for their commercial purposes.
        </p>

        <h2 className="font-heading font-bold text-stone-800 mt-8 mb-2">5. Your rights</h2>
        <p className="text-sm text-stone-700 leading-relaxed">
          You can delete your account at any time from the app's settings. Account deletion permanently removes your profile, budget, transactions, and feedback. This action cannot be undone.
        </p>
        <p className="text-sm text-stone-700 leading-relaxed mt-3">
          If you have questions about what data we hold about you, reach out using the contact below.
        </p>

        <h2 className="font-heading font-bold text-stone-800 mt-8 mb-2">6. Contact</h2>
        <p className="text-sm text-stone-700 leading-relaxed">
          For privacy-related questions, contact us at: <span className="text-stone-500">support@betterbudget.com</span>
        </p>
      </div>
    </div>
  )
}
