'use client'

import { signIn } from '@/app/actions/auth'
import Link from 'next/link'
import { useActionState } from 'react'

export default function SignInPage() {
  const [error, action, pending] = useActionState(signIn, undefined)

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-lg p-6">
        <h1 className="text-xl font-semibold text-stone-800 mb-6">betterbudget</h1>
        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-xs font-medium text-stone-500 uppercase tracking-wide">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="px-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-xs font-medium text-stone-500 uppercase tracking-wide">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="px-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className={`px-4 py-2 text-sm font-medium text-white bg-amber-700 rounded hover:bg-amber-800 transition-colors duration-150 ${pending ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {pending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="mt-4 text-xs text-stone-500">
          No account?{' '}
          <Link href="/signup" className="text-amber-700 hover:text-amber-800">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
