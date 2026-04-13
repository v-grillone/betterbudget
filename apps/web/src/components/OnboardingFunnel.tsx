'use client'

import { upsertBudget } from '@/app/actions/budget'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CATEGORIES } from '@/lib/constants'
import Image from 'next/image'
import { motion } from 'motion/react'
import { useActionState, useState } from 'react'

const EXAMPLES: Record<string, string> = {
  needs: 'The essentials — rent, groceries, utilities, and getting around.',
  wants: 'The fun stuff — dining out, subscriptions, clothes, entertainment.',
  investing: 'Your future self — savings, stocks, retirement contributions.',
}


export default function OnboardingFunnel({ name }: { name: string | null }) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [weeklyAmount, setWeeklyAmount] = useState(0)
  const [needs, setNeeds] = useState(50)
  const [wants, setWants] = useState(30)
  const [investing, setInvesting] = useState(20)

  const [error, action, pending] = useActionState(upsertBudget, undefined)

  const total = needs + wants + investing
  const dailyBudget = weeklyAmount / 7

  const activeStep = pending ? 4 : step

  return (
    <div className="flex-1 flex flex-col bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6">

        <header className="flex items-center mb-6">
          <div className="flex items-center gap-2">
            <Image src="/images/logos/bb-logo.svg" alt="" width={28} height={24} priority />
            <span className="text-xl font-heading font-light text-stone-800">betterbudget</span>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center flex-1">
          <div className="w-full max-w-sm bg-white border border-stone-200 rounded-lg p-6">

            {/* Step 1: Welcome */}
            {activeStep === 1 && (
              <>
                <h2 className="font-heading font-bold text-stone-800 mb-2">
                  {name ? `Hey ${name}! 👋` : 'Hey there! 👋'}
                </h2>
                <p className="text-sm text-stone-500 mb-6">
                  Welcome to betterbudget, a simple way to stay on top of your money.
                  Every dollar you spend gets tracked across three categories: Needs, Wants, and Investing.
                </p>
                <Button
                  onClick={() => setStep(2)}
                  className="w-full bg-stone-700 hover:bg-stone-800 cursor-pointer"
                >
                  Continue
                </Button>
              </>
            )}

            {/* Step 2: Concept explanation */}
            {activeStep === 2 && (
              <>
                <h2 className="font-heading font-bold text-stone-800 mb-1">Here&apos;s how it works</h2>
                <p className="text-sm text-stone-500 mb-4">
                  Think of every purchase as falling into one of three buckets. The goal is to be intentional with your spending not restrictive.
                </p>
                <div className="flex flex-col gap-3 mb-4">
                  {CATEGORIES.map(cat => (
                    <div key={cat.key} className="flex items-start gap-2">
                      <span className={`mt-2 w-2.5 h-2.5 rounded-full shrink-0 ${cat.swatch}`} />
                      <div>
                        <span className="text-sm font-medium text-stone-800">{cat.label}</span>
                        <span className="text-xs text-stone-500 block">{EXAMPLES[cat.key]}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setStep(3)}
                  className="w-full bg-stone-700 hover:bg-stone-800 cursor-pointer"
                >
                  Continue
                </Button>
              </>
            )}

            {/* Step 3: Budget allocation */}
            {activeStep === 3 && (
              <>
                <h2 className="font-heading font-bold text-stone-800 mb-1">Set your budget</h2>
                <p className="text-xs text-stone-500 mb-4">
                  Decide how much to spend weekly and how to split it.
                </p>
                <form action={action} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="weekly_amount" className="text-xs font-medium text-stone-500 uppercase tracking-wide">
                      Weekly amount
                    </label>
                    <Input
                      id="weekly_amount"
                      name="weekly_amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={weeklyAmount}
                      onChange={e => setWeeklyAmount(parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">
                      Daily budget
                    </label>
                    <div className="px-3 py-2 text-sm border border-stone-200 rounded bg-stone-100 text-stone-400 cursor-not-allowed">
                      ${dailyBudget.toFixed(2)}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="needs_pct" className="text-xs font-medium text-indigo-400 uppercase tracking-wide">
                        Needs %
                      </label>
                      <Input
                        id="needs_pct"
                        name="needs_pct"
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        value={needs}
                        onChange={e => setNeeds(parseInt(e.target.value) || 0)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="wants_pct" className="text-xs font-medium text-red-400 uppercase tracking-wide">
                        Wants %
                      </label>
                      <Input
                        id="wants_pct"
                        name="wants_pct"
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        value={wants}
                        onChange={e => setWants(parseInt(e.target.value) || 0)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="investing_pct" className="text-xs font-medium text-emerald-400 uppercase tracking-wide">
                        Investing %
                      </label>
                      <Input
                        id="investing_pct"
                        name="investing_pct"
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        value={investing}
                        onChange={e => setInvesting(parseInt(e.target.value) || 0)}
                        required
                      />
                    </div>
                  </div>
                  <p className={`text-xs ${total === 100 ? 'text-emerald-400' : 'text-red-400'}`}>
                    Total: {total}%{total === 100 ? ' ✓' : ' — must equal 100%'}
                  </p>
                  {error && <p className="text-xs text-red-600">{error}</p>}
                  <Button
                    type="submit"
                    disabled={total !== 100 || pending}
                    className="w-full bg-stone-700 hover:bg-stone-800 cursor-pointer"
                  >
                    Set my budget
                  </Button>
                </form>
              </>
            )}

            {/* Step 4: Loading */}
            {activeStep === 4 && (
              <div className="flex flex-col items-center gap-3 py-4">
                <p className="text-sm text-stone-800">
                  Building your budget
                  {[0, 1, 2].map(i => (
                    <motion.span
                      key={i}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
                    >
                      .
                    </motion.span>
                  ))}
                </p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}
