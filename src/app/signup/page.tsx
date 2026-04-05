'use client'

import { signUp } from '@/app/actions/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useActionState, useState } from 'react'

export default function SignUpPage() {
  const [error, action, pending] = useActionState(signUp, undefined)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [touched, setTouched] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const checks = {
    length: password.length >= 8,
    number: /\d/.test(password),
    special: /[^a-zA-Z0-9]/.test(password),
  }
  const passwordValid = checks.length && checks.number && checks.special
  const passwordsMatch = password === confirmPassword
  const canSubmit = passwordValid && (confirmPassword === '' || passwordsMatch) && agreed

  return (
    <div className="flex-1 bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Image src="/images/logos/bb-logo.svg" alt="" width={28} height={24} priority />
          <span className="text-xl font-heading font-light text-stone-800">betterbudget</span>
        </div>
        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-xs font-medium text-stone-500 uppercase tracking-wide">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="px-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
            />
          </div>
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
            <label htmlFor="password" className="text-xs font-medium text-stone-500 uppercase tracking-wide">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={e => { setPassword(e.target.value); setTouched(true) }}
              className="px-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
            />
            {touched && (
              <ul className="flex flex-col gap-0.5 mt-1">
                <li className={`text-xs ${checks.length ? 'text-emerald-600' : 'text-red-500'}`}>
                  {checks.length ? '✓' : '✗'} At least 8 characters
                </li>
                <li className={`text-xs ${checks.number ? 'text-emerald-600' : 'text-red-500'}`}>
                  {checks.number ? '✓' : '✗'} Contains a number
                </li>
                <li className={`text-xs ${checks.special ? 'text-emerald-600' : 'text-red-500'}`}>
                  {checks.special ? '✓' : '✗'} Contains a special character
                </li>
              </ul>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" className="text-xs font-medium text-stone-500 uppercase tracking-wide">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="px-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
            />
            {confirmPassword && (
              <p className={`text-xs mt-0.5 ${passwordsMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>
          {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
          <div className="flex items-start gap-2">
            <input
              id="agree"
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 accent-stone-700 cursor-pointer"
            />
            <label htmlFor="agree" className="text-xs text-stone-500 leading-relaxed cursor-pointer">
              I agree to the{' '}
              <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-stone-700 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/policy" target="_blank" rel="noopener noreferrer" className="text-stone-700 hover:underline">Privacy Policy</Link>
            </label>
          </div>
          <button
            type="submit"
            disabled={pending || !canSubmit}
            className={`px-4 py-2 text-sm font-medium text-white bg-stone-700 rounded hover:bg-stone-800 transition-colors duration-150 cursor-pointer ${(pending || !canSubmit) ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {pending ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <div className="mt-4 border-t border-stone-200" />
        <Link
          href="/signin"
          className="mt-4 flex items-center justify-center px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-700 rounded hover:bg-stone-50 transition-colors duration-150"
        >
          I already have an account
        </Link>
      </div>
    </div>
  )
}
