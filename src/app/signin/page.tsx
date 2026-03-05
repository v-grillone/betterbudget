'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signIn } from '@/app/actions/auth'

export default function SignInPage() {
  const [error, action, pending] = useActionState(signIn, undefined)

  return (
    <div>
      <h1>Sign In</h1>
      <form action={action}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required />
        </div>
        {error ? <p>{error}</p> : null}
        <button type="submit" disabled={pending}>
          {pending ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p>
        No account? <Link href="/signup">Sign Up</Link>
      </p>
    </div>
  )
}
