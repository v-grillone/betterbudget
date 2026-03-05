'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signUp } from '@/app/actions/auth'

export default function SignUpPage() {
  const [error, action, pending] = useActionState(signUp, undefined)

  return (
    <div>
      <h1>Sign Up</h1>
      <form action={action}>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required minLength={6} />
        </div>
        {error ? <p>{error}</p> : null}
        <button type="submit" disabled={pending}>
          {pending ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p>
        Already have an account? <Link href="/signin">Sign In</Link>
      </p>
    </div>
  )
}
