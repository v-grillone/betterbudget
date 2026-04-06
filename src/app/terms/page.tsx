import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — betterbudget',
}

export default function TermsPage() {
  return (
    <div className="flex-1 bg-stone-50">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:px-8 sm:py-12">
        <h1 className="font-heading font-bold text-stone-800 text-xl mb-2">Terms of Service</h1>
        <p className="text-xs text-stone-500 mb-8">Effective April 3, 2026</p>

        <h2 className="font-heading font-bold text-stone-800 mt-8 mb-2">1. What betterbudget is</h2>
        <p className="text-sm text-stone-700 leading-relaxed">
          betterbudget is a personal budget tracking tool. It helps you record and categorize spending relative to a self-defined weekly budget. betterbudget is not a financial institution, and nothing in the app constitutes financial advice, investment advice, or any regulated financial service.
        </p>

        <h2 className="font-heading font-bold text-stone-800 mt-8 mb-2">2. Your account</h2>
        <p className="text-sm text-stone-700 leading-relaxed">
          You are responsible for maintaining the security of your account credentials. Do not share your password. betterbudget cannot be held responsible for losses arising from unauthorized access to your account due to credential sharing or compromise on your end.
        </p>
        <p className="text-sm text-stone-700 leading-relaxed mt-3">
          You must provide accurate information when creating an account. Accounts created with false information may be terminated.
        </p>

        <h2 className="font-heading font-bold text-stone-800 mt-8 mb-2">3. Acceptable use</h2>
        <p className="text-sm text-stone-700 leading-relaxed">You agree not to:</p>
        <ul className="list-disc list-inside text-sm text-stone-700 leading-relaxed space-y-1 mt-2">
          <li>Use betterbudget for any unlawful purpose</li>
          <li>Attempt to gain unauthorized access to any part of the service or its infrastructure</li>
          <li>Reverse engineer, decompile, or extract source code from the app</li>
          <li>Upload malicious content or scripts</li>
        </ul>

        <h2 className="font-heading font-bold text-stone-800 mt-8 mb-2">4. Service availability</h2>
        <p className="text-sm text-stone-700 leading-relaxed">
          betterbudget is provided on an "as is" and "as available" basis. We make no guarantees of uptime or uninterrupted access. We may modify, suspend, or discontinue features at any time, with reasonable effort to notify users of significant changes.
        </p>

        <h2 className="font-heading font-bold text-stone-800 mt-8 mb-2">5. Limitation of liability</h2>
        <p className="text-sm text-stone-700 leading-relaxed">
          To the fullest extent permitted by applicable law, betterbudget and its creators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service — including, but not limited to, financial decisions made based on data displayed in the app.
        </p>

        <h2 className="font-heading font-bold text-stone-800 mt-8 mb-2">6. Account termination</h2>
        <p className="text-sm text-stone-700 leading-relaxed">
          You may delete your account at any time. We reserve the right to suspend or terminate accounts that violate these terms.
        </p>

        <h2 className="font-heading font-bold text-stone-800 mt-8 mb-2">7. Changes to these terms</h2>
        <p className="text-sm text-stone-700 leading-relaxed">
          We may update these terms from time to time. Continued use of betterbudget after changes are posted constitutes acceptance of the revised terms.
        </p>

        <h2 className="font-heading font-bold text-stone-800 mt-8 mb-2">8. Governing law</h2>
        <p className="text-sm text-stone-700 leading-relaxed">
          These terms are governed by the laws of Ontario, Canada. Any disputes shall be resolved in the courts of that jurisdiction.
        </p>

        <h2 className="font-heading font-bold text-stone-800 mt-8 mb-2">9. Contact</h2>
        <p className="text-sm text-stone-700 leading-relaxed">
          Questions about these terms? Reach us at: <span className="text-stone-500">support@betterbudget.com</span>
        </p>
      </div>
    </div>
  )
}
