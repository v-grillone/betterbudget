'use client'

import { changePassword } from '@/app/actions/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useRef, useState } from 'react'

export default function ResetPasswordPage() {
  const [error, action, pending] = useActionState(changePassword, undefined)
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState(false)
  const submitted = useRef(false)
  const router = useRouter()

  const checks = {
    length: password.length >= 8,
    number: /\d/.test(password),
    special: /[^a-zA-Z0-9]/.test(password),
  }
  const passwordValid = checks.length && checks.number && checks.special

  useEffect(() => {
    if (submitted.current && !pending && error === undefined) {
      router.push('/')
    }
  }, [pending, error, router])

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Image src="/images/logos/bb-logo.svg" alt="" width={28} height={24} priority />
          <span className="text-xl font-heading font-light text-stone-800">betterbudget</span>
        </div>
        <form
          action={action}
          onSubmit={() => { submitted.current = true }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-xs font-medium text-stone-500 uppercase tracking-wide">New password</label>
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
          {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={pending || !passwordValid}
            className={`px-4 py-2 text-sm font-medium text-white bg-stone-700 rounded hover:bg-stone-800 transition-colors duration-150 cursor-pointer ${(pending || !passwordValid) ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {pending ? 'Saving...' : 'Set new password'}
          </button>
        </form>
        <p className="mt-4 text-xs text-stone-500">
          <Link href="/signin" className="text-stone-500 hover:text-stone-700">← Back to sign in</Link>
        </p>
      </div>
    </div>
  )
}
