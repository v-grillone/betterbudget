# Homepage Skeleton — Next.js + DESIGN.md

How to take a functional but unstyled `page.tsx` and build a fully styled, interactive homepage with navigation, a ledger, a budget chart, and auth pages — all following a project design system.

---

## Architecture

```
/ (page.tsx — server component)
  ├── Header (app title + gear icon → BudgetModal + sign out)
  ├── MonthTabs (folder tab strip, URL param ?month=YYYY-MM)
  └── Ledger
       ├── LedgerTable (styled transaction rows, filtered by month)
       ├── TransactionForm (inline input row at bottom of table)
       └── BudgetChart (doughnut + category summary)
```

---

## Phase 1 — Page Layout + Header

**Files:** `src/app/page.tsx`, `src/app/layout.tsx`

- Wrap content in `min-h-screen bg-stone-50` with `max-w-4xl mx-auto px-4 sm:px-8 py-6`
- Header: app title left, gear icon + sign-out button right
- Sign-out: ghost button style (`text-stone-500 hover:bg-stone-100`)
- Gear icon opens `BudgetModal`
- Update `layout.tsx` `<title>` and `<meta description>`

```tsx
// page.tsx header pattern
<header className="flex items-center justify-between">
  <h1 className="text-xl font-semibold text-stone-800">betterbudget</h1>
  <div className="flex items-center gap-2">
    <BudgetModal budget={budget} />
    <form action={signOut}>
      <button className="px-3 py-1.5 text-sm text-stone-500 rounded hover:bg-stone-100">
        Sign out
      </button>
    </form>
  </div>
</header>
```

---

## Phase 2 — Month Folder Tab Navigation

**Files:** `src/components/MonthTabs.tsx` (new), `src/app/page.tsx`, `src/app/actions/transactions.ts`

- `MonthTabs` is a client component: renders 12 tab buttons, calls `router.push('/?month=YYYY-MM')` on click
- `page.tsx`: read `searchParams.month`, validate with `/^\d{4}-(0[1-9]|1[0-2])$/`, fall back to current month
- `getTransactions`: accept optional `month` param, filter by date range using `.gte('date', start).lte('date', end)`

```tsx
// MonthTabs.tsx — tab strip
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

{MONTHS.map((label, i) => {
  const month = `${year}-${String(i + 1).padStart(2, '0')}`
  const isActive = month === activeMonth
  return (
    <button
      key={month}
      onClick={() => router.push(`/?month=${month}`)}
      aria-current={isActive ? 'true' : undefined}
      className={isActive ? '...active styles...' : '...inactive styles...'}
    >
      {label}
    </button>
  )
})}
```

```ts
// getTransactions — month filter
if (month) {
  if (!/^\d{4}-\d{2}$/.test(month)) throw new Error(`Invalid month: ${month}`)
  const [yearStr, monStr] = month.split('-')
  const monNum = Number(monStr)
  if (monNum < 1 || monNum > 12) throw new Error(`Invalid month value: ${monStr}`)
  const start = `${yearStr}-${monStr}-01`
  const lastDay = new Date(Number(yearStr), monNum, 0).getDate()
  const end = `${yearStr}-${monStr}-${String(lastDay).padStart(2, '0')}`
  query = query.gte('date', start).lte('date', end)
}
const { data, error } = await query
if (error) { console.error('getTransactions:', error.message); return [] }
return data ?? []
```

---

## Phase 3 — Ledger Table

**Files:** `src/components/LedgerTable.tsx` (new)

- Columns: Date · Description · Category · Amount
- Date format: `Mon, Mar 7` using `new Date(t.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })`
- Amount color-coded by category: needs = indigo, wants = red/orange, investing = emerald
- Category badge: pill with muted background
- Empty state row: `"No transactions yet. Add one below."`
- Wrap in `<div className="overflow-x-auto">` for mobile

---

## Phase 4 — Transaction Input Row

**Files:** `src/components/TransactionForm.tsx`

- Inline row at the bottom of the ledger — no card or floating panel
- Borderless inputs inside a `<fieldset disabled={pending}>` (blocks keyboard submission)
- `aria-busy={pending}` on the `<form>`
- `aria-label` on each input (Date, Description, Category, Amount) since there are no visible labels
- `+` submit button in amber
- Default date seeds from the active month prop, not always today

```tsx
function defaultDate(month: string) {
  const now = new Date()
  const todayMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  if (month === todayMonth) {
    return `${todayMonth}-${String(now.getDate()).padStart(2, '0')}`
  }
  return `${month}-01`
}
```

> Pass `month={month}` from `page.tsx` so submissions land in the visible ledger month.

---

## Phase 5 — Budget Chart

**Files:** `src/components/BudgetChart.tsx` (new), install `recharts`

```bash
npm install recharts
```

- Client component with `'use client'`
- Doughnut via recharts `<PieChart>` + `<Pie>` + `<Cell>` for per-slice colors
- Gray fallback slice when no budget or all amounts are zero
- Center label: net remaining balance — show `"over"` when negative, `"left"` when positive

```tsx
<span>{netRemaining < 0 ? 'over' : 'left'}</span>
```

- Category summary rows: color swatch + label + spent + remaining (red when over)
- Colors: needs = indigo-600, wants = amber-500, investing = emerald-600

---

## Phase 6 — Budget Modal

**Files:** `src/components/BudgetForm.tsx`, `src/components/BudgetModal.tsx` (new)

- `BudgetForm`: form logic only — inputs for `monthly_amount`, `needs_pct`, `wants_pct`, `investing_pct`
  - All labels must have `htmlFor` + matching `id` on inputs for accessibility
- `BudgetModal`: shadcn `<Dialog>` triggered by a gear icon (`<Settings size={16} />`) in the header
  - Closes on successful save via `open` state controlled by the form's action result

```tsx
// BudgetModal.tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <button aria-label="Budget settings"><Settings size={16} /></button>
  </DialogTrigger>
  <DialogContent>
    <BudgetForm budget={budget} onSuccess={() => setOpen(false)} />
  </DialogContent>
</Dialog>
```

---

## Phase 7 — Auth Pages

**Files:** `src/app/signin/page.tsx`, `src/app/signup/page.tsx`

- Centered card on `bg-stone-50`: `min-h-screen flex items-center justify-center`
- Card: `bg-white border border-stone-200 rounded-lg p-6 w-full max-w-sm`
- Labels: `text-xs font-medium text-stone-500 uppercase tracking-wide`
- Inputs: `px-3 py-2 text-sm border border-stone-200 rounded focus:ring-2 focus:ring-amber-500`
- Submit button: `bg-amber-700 hover:bg-amber-800 text-white`
- Error message must have `role="alert"` for screen readers

```tsx
{error && <p role="alert" className="text-xs text-red-600">{error}</p>}
```

- Link to the other auth page at the bottom

---

## Files Changed

| File | Change |
|---|---|
| `src/app/page.tsx` | Layout, header, searchParams, month validation |
| `src/app/layout.tsx` | Metadata |
| `src/app/actions/transactions.ts` | Month filter, input validation, error handling |
| `src/components/BudgetForm.tsx` | Strip layout, add label/id associations |
| `src/components/TransactionForm.tsx` | Inline row, fieldset disabled, aria, month prop |
| `src/components/MonthTabs.tsx` | New — tab strip with aria-current |
| `src/components/LedgerTable.tsx` | New — styled rows, empty state |
| `src/components/BudgetChart.tsx` | New — doughnut + category summary |
| `src/components/BudgetModal.tsx` | New — shadcn Dialog |
| `src/app/signin/page.tsx` | Design system, role="alert" |
| `src/app/signup/page.tsx` | Design system, role="alert" |

---

## Verification Checklist

- [ ] `npm run dev` loads at `localhost:3000`
- [ ] Unauthenticated → `/signin` (styled card)
- [ ] Sign in → homepage with current month tab active + `aria-current`
- [ ] Month tabs update URL + filter transactions
- [ ] Invalid `?month=` value falls back to current month
- [ ] Gear icon → budget modal; save closes modal
- [ ] Inline transaction row submits to the viewed month (not necessarily today)
- [ ] `fieldset disabled` blocks keyboard submission while pending
- [ ] Doughnut reflects actual monthly spend; center label shows "over" when negative
- [ ] Empty month shows empty state row
- [ ] Screen readers: labels associated, errors announced, busy state on form
