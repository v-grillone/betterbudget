# Design System — betterbudget

## Overview

A minimalist budgeting app with a file-folder navigation model. Users drill down from year → month. Each ledger contains the days of the month, allowing users to add transactions for each day. The aesthetic is calm, warm, and distraction-free — the UI should feel like a well-organized notebook, not a dashboard. At the top of each monthly ledger, there should be a doughnut pie chart showing the percentage breakdown of the month’s needs, wants, and investing, along with a running total of each category’s spending and how much is left over from the monthly total budget.

---

## Color Palette

All colors map to Tailwind utility classes. Try to stay as close to this palette as possible. If a different color is needed, ask before implementing it.

| Role            | Tailwind Class          | Hex       | Usage                                      |
|-----------------|-------------------------|-----------|--------------------------------------------|
| Background      | `bg-stone-50`           | `#FAFAF9` | App background, page canvas, active folder tab |
| Surface         | `bg-white`              | `#FFFFFF` | Cards, modals                              |
| Surface Alt     | `bg-stone-100`          | `#F5F5F4` | Inactive folder tabs, table row alt        |
| Border          | `border-stone-200`      | `#E7E5E4` | All borders, dividers, tab edges           |
| Text Primary    | `text-stone-800`        | `#292524` | Headings, labels, primary content          |
| Text Secondary  | `text-stone-500`        | `#78716C` | Subtext, placeholders, metadata            |
| Text Disabled   | `text-stone-400`        | `#A8A29E` | Disabled inputs, empty states              |
| Accent          | `text-stone-700`        | `#44403C` | Active states, links, focus rings, CTAs    |
| Accent Subtle   | `bg-stone-300`          | `#D6D3D1` | Hover states on accent elements            |
| Success         | `text-emerald-600`      | `#059669` | Positive amounts, income transactions      |
| Danger          | `text-red-600`          | `#EF4444` | Negative amounts, expenses, delete actions |
| Danger Subtle   | `bg-red-50`             | `#FEF2F2` | Destructive action hover states            |
| Needs           | `text-indigo-400` / `bg-indigo-400` | `#818cf8` | Needs text amounts; bg for chart swatches |
| Wants           | `text-red-400` / `bg-red-400`       | `#f87171` | Wants text amounts; bg for chart swatches |
| Investing       | `text-emerald-400` / `bg-emerald-400` | `#34d399` | Investing text amounts; bg for chart swatches |

> **Rule:** Never use arbitrary Tailwind color values (e.g. `text-[#aabbcc]`). Stick to the table above.

---

## Typography

Font stack uses the system sans-serif for a clean, native feel. No external font imports unless explicitly added later.

```
font-family: font-sans (Tailwind default — system-ui, sans-serif)
```

| Role              | Tailwind Classes                          | Usage                          |
|-------------------|-------------------------------------------|--------------------------------|
| Page Title        | `text-xl font-semibold text-stone-800`    | Year/month headings            |
| Section Label     | `text-sm font-medium text-stone-500 uppercase tracking-wide` | Column headers, category labels |
| Body / Input      | `text-sm text-stone-800`                  | Transaction rows, form inputs  |
| Subtext / Meta    | `text-xs text-stone-500`                  | Dates, IDs, helper text        |
| Amount — Investing| `text-sm font-medium text-emerald-400`    | Investing, Positive values     |
| Amount — Wants    | `text-sm font-medium text-red-400`  | Wants category values              |
| Amount — Negative | `text-sm font-medium text-red-600`  | Negative totals, overspent categories |
| Amount — Needs | `text-sm font-medium text-indigo-400`        | Needs values                   |
| Amount — Neutral  | `text-sm font-medium text-stone-400`      | Running totals, net balance,   |

---

## Spacing System

Uses Tailwind's default 4px base grid. Be consistent — prefer named scale steps over arbitrary values.

| Token  | Value  | Common use                         |
|--------|--------|------------------------------------|
| `p-1`  | 4px    | Icon padding, tight badges         |
| `p-2`  | 8px    | Compact inputs, small tags         |
| `p-3`  | 12px   | Table cell padding                 |
| `p-4`  | 16px   | Card padding, form field spacing   |
| `p-6`  | 24px   | Section spacing, modal padding     |
| `p-8`  | 32px   | Page-level padding                 |
| `gap-2`| 8px    | Inline element spacing             |
| `gap-4`| 16px   | Form row spacing                   |

---

## Component Patterns

### Year Selector

A compact native `<select>` placed above the month tab strip, left-aligned. Allows navigating to a different year while preserving the active month.

- **Wrapper:** `flex items-center gap-2 mb-2`
- **Label:** `text-xs font-medium text-stone-500 uppercase tracking-wide` — text "Year"
- **Select:** `px-2 py-1 text-sm text-stone-700 bg-white border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent cursor-pointer`
- Year range: current year −4 to current year (5 options)
- On change: push `/?month=YYYY-MM` with selected year + current month number

### Folder Tabs (Month Navigation)

The month tab strip sits below the year selector. Tabs span the full ledger width and feel like file folder tabs lifting the page up.

- **Container:** `flex border-b border-stone-200 bg-stone-50`
- **Inactive tab:** `flex-1 px-1 py-2 text-sm text-center text-stone-500 bg-stone-100 border border-b-0 border-stone-200 rounded-t cursor-pointer hover:bg-stone-300 hover:text-stone-700 transition-colors duration-150 not-first:border-l-0`
- **Active tab:** `flex-1 px-1 py-2 text-sm font-medium text-center text-stone-800 bg-white border border-b-0 border-stone-200 rounded-t -mb-px not-first:border-l-0`
- Tabs divide the full container width equally (`flex-1`); no gap, no overflow scroll
- The active tab visually "connects" to the content surface below (no bottom border, `-mb-px`)

### Ledger Table

The core UI — a simple, scannable table of daily transactions.

- **Table wrapper:** `w-full border border-stone-200 rounded-lg overflow-hidden`
- **Header row:** `bg-stone-100 text-xs font-medium text-stone-500 uppercase tracking-wide`
- **Header cell:** `px-3 py-2 text-left`
- **Data row:** `border-t border-stone-200 hover:bg-stone-300 transition-colors`
- **Data cell:** `px-3 py-3 text-sm`
- **Alternate rows:** Do not use zebra striping — use hover state only
- Columns (suggested order): Date · Description · Category · Amount 

### Ledger Pie Chart

Displayed at the top of each monthly ledger, above the transaction table. Shows the spending breakdown across the three budget categories — Needs, Wants, and Investing — as a doughnut chart, alongside a summary of each category's total spent and remaining budget.

- **Chart type:** Doughnut (not pie) — use a clean center hole to display the net remaining balance
- **Chart colors:** Use the category palette exactly — `bg-indigo-400` for Needs, `bg-red-400` for Wants, `bg-emerald-400` for Investing
- **Chart library:** Use `recharts` (`PieChart` + `Pie` with `innerRadius`) — no external charting dependencies beyond what's already in the stack
- **Layout:** Chart and category summary sit side by side (`flex gap-6 items-start`), chart on the left, summary on the right
- **Monthly Budget formula:** Displayed as the first element in the right column — `Monthly Budget: $X.XX/day × Y days = $Z.XX/mo` — `text-xs text-stone-400`
- **Category summary rows** (one per category, below the formula line):
  - Label with color swatch dot (`w-2.5 h-2.5 rounded-full` in category color)
  - Label includes budget allocation %: e.g. `Needs (50%)` — `text-sm text-stone-500 w-28`
  - Total spent: `text-sm text-stone-800`
  - Spending % of total: `text-xs text-stone-400` — omit if no transactions
  - Remaining: `text-xs text-stone-500`
- **Section wrapper:** `py-6 border-b border-stone-200`
- If no transactions exist for a category, show its segment as empty/gray (`bg-stone-200`) rather than omitting it
- Do not show a legend inside the chart — the summary rows serve that role

### Transaction Input Row

A lightweight inline form between the budget summary and the transaction table (not a modal).

- **Row:** `border-t border-stone-200 bg-white`
- **Input field:** `w-full px-3 py-2 text-sm bg-transparent border-none outline-none placeholder:text-stone-400 focus:ring-0`
- Inputs are borderless inside the row — the row container provides the visual boundary
- Submit with Enter key; show a small `+` icon button as a visual affordance
- **Add button:** `text-stone-700 hover:text-stone-800 p-1 rounded hover:bg-stone-300`

### Welcome Message

Displayed below the header and above the month tabs. Greets the user by name with a time-sensitive salutation.

- **Typography:** `text-sm text-stone-500`
- **Name:** `font-medium text-stone-700` (inline `<span>`)
- **Greeting periods:** Good morning (5–11), Good afternoon (12–17), Good evening (18–20), Good night (21–4) — determined client-side via `new Date().getHours()`
- **Copy (with name):** `"Good [period], [name]. Let's add to your budget."`
- **Copy (no name):** `"Good [period]. Let's add to your budget."`
- **Spacing:** `mb-6` below the element

### Empty State

Shown when a month has no transactions yet.

- Centered in the ledger area, `text-stone-400`
- Short, calm copy: e.g. "No transactions yet. Add one above."
- No illustrations or icons unless explicitly requested

### Buttons

| Type        | Classes                                                                 |
|-------------|-------------------------------------------------------------------------|
| Primary     | `px-4 py-2 text-sm font-medium text-white bg-stone-700 rounded hover:bg-stone-800` |
| Secondary   | `px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-200 rounded hover:bg-stone-50` |
| Ghost       | `px-3 py-1.5 text-sm text-stone-500 rounded hover:bg-stone-100`        |
| Destructive | `px-4 py-2 text-sm font-medium text-red-500 bg-white border border-red-200 rounded hover:bg-red-50` |

### Form Inputs (Modals / Settings)

- **Field wrapper:** `flex flex-col gap-1`
- **Label:** `text-xs font-medium text-stone-500 uppercase tracking-wide`
- **Input:** `px-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent`

---

## Layout

- **Max content width:** `max-w-4xl mx-auto` — keep the ledger readable, not full-bleed
- **Page padding:** `px-4 py-6` on mobile, `px-8 py-8` on desktop
- **Breakpoints:** Use Tailwind defaults (`sm`, `md`, `lg`). The app is primarily a desktop layout but should not break on tablet.
- No sidebars. Navigation is entirely in the folder tab strip at the top.

---

## Interaction & Motion

- Keep transitions subtle: `transition-colors duration-150` for hover states
- No bounce, scale, or elaborate animations — they conflict with the minimalist tone
- Focus states must always be visible (accessibility): use `focus:ring-2 focus:ring-stone-500`
- Loading states: use a simple `opacity-50 pointer-events-none` on the relevant element, no spinners unless the wait exceeds ~1s

---

## Tone & Voice

- **Language:** Plain, functional. Labels say exactly what they are (e.g. "Add transaction", not "Track a spend").
- **Numbers:** Always show currency symbol. Use two decimal places. Right-align amounts in tables.
- **Dates:** Display as `Mon, Mar 7` in the ledger. Use `YYYY-MM-DD` internally.
- **Empty/error states:** Calm, non-alarming. No exclamation points.