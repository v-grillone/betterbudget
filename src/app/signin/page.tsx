'use client'

import { signIn } from '@/app/actions/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useActionState } from 'react'

export default function SignInPage() {
  const [error, action, pending] = useActionState(signIn, undefined)

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Image src="/images/logos/bb-logo.svg" alt="" width={28} height={24} priority />
          <span className="text-xl font-heading font-light text-stone-800">betterbudget</span>
        </div>
        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-xs font-medium text-stone-500 uppercase tracking-wide">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="px-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-medium text-stone-500 uppercase tracking-wide">Password</label>
              <Link href="/forgot-password" className="text-xs text-stone-500 hover:text-stone-700">Forgot password?</Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="px-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
            />
          </div>
          {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className={`px-4 py-2 text-sm font-medium text-white bg-stone-700 rounded hover:bg-stone-800 transition-colors duration-150 cursor-pointer ${pending ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {pending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="mt-4 border-t border-stone-200" />
        <Link
          href="/signup"
          className="mt-4 flex items-center justify-center px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-700 rounded hover:bg-stone-50 transition-colors duration-150"
        >
          Sign up
        </Link>
      </div>
    </div>
  )
}
