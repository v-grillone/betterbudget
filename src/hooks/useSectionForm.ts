'use client'

import { useState, useTransition } from 'react'

type ServerAction = (state: undefined, formData: FormData) => Promise<string | undefined>

export function useSectionForm(action: ServerAction, onSuccess?: () => void) {
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState(false)

  function handleSubmit(formData: FormData) {
    setError(undefined)
    start(async () => {
      const err = await action(undefined, formData)
      if (err) {
        setError(err)
      } else {
        setSuccess(true)
        onSuccess?.()
        setTimeout(() => setSuccess(false), 3000)
      }
    })
  }

  return { pending, error, success, handleSubmit }
}
