## Development Guidelines

- In all interactions and commit messages, be extremely concise. Sacrifice grammar for the sake of concision.

- We are building a budgeting app called betterbudget. The main goal of this app is to have the user input daily transactions for 3 category types: needs, wants, and investing. The user sets a weekly budget amount (from which daily = weekly/7 and monthly = daily × daysInMonth are derived) and decides how the percentages should be divided between the 3 categories. Example: 50% needs, 30% wants, and 20% investing.

- Ask questions during development whenever you're not 100% sure about something or need clarification.

- When in plan mode, always check CLAUDE.md and DESIGN.md for conflicts with the proposed changes. Surface any conflicts to the user and update those files as part of the plan if changes are approved.

## Tech Stack and Tools
- TypeScript
- Next.js
- Supabase
- Stripe
- App Router
- shadcn/ui
- Motion

## Database Schema

- Users: id | user_id | name | email | password
- Transactions: id | transaction_id | user_id | category | description | amount

## Shared Logic Rules

Follow these rules strictly. Inline helpers inside components/pages are only allowed if the logic is used in exactly one place and is trivial enough that extracting it would add no clarity.

| What | Where |
|------|-------|
| Date/month utilities (`currentMonth`, `daysInMonth`, `formatDate`, etc.) | `src/lib/dates.ts` |
| Shared constants (`MONTHS`, `CATEGORIES`, `AMOUNT_CLASS`, etc.) | `src/lib/constants.ts` |
| Shared TypeScript types/interfaces (`Budget`, `Transaction`, etc.) | `src/lib/types.ts` |
| Generic utilities (`cn`, etc.) | `src/lib/utils.ts` |
| Custom React hooks (`useX` pattern) | `src/hooks/` |
| Server-side Supabase client | `src/lib/supabase/server.ts` |
| Browser-side Supabase client | `src/lib/supabase/client.ts` |

## Design Principles
- This project follows the design system in `DESIGN.md`. Always reference it before creating or editing any UI components. Do not introduce colors, fonts, or spacing values not defined there.
- Always use shadcn/ui components before writing custom HTML elements. Install new components via `npx shadcn@latest add <name>` as needed.

## Directory Structure

```
betterbudget/
├── public/                 ← static assets
├── src/
│   ├── app/                ← routes, layouts, pages
│   │   ├── actions/        ← server actions
│   │   │   ├── auth.ts
│   │   │   ├── budget.ts
│   │   │   └── transactions.ts
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts  ← Supabase auth callback
│   │   ├── signin/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css     ← global styles
│   │   ├── layout.tsx      ← root layout
│   │   └── page.tsx        ← homepage /
│   │
│   ├── components/         ← reusable UI components
│   │   ├── ui/             ← shadcn/ui primitives
│   │   ├── BudgetChart.tsx
│   │   ├── BudgetForm.tsx
│   │   ├── BudgetModal.tsx
│   │   ├── LedgerTable.tsx
│   │   ├── MonthTabs.tsx
│   │   ├── TransactionForm.tsx
│   │   └── YearSelect.tsx
│   │
│   ├── hooks/              ← custom React hooks (useX pattern only)
│   │
│   └── lib/                ← utilities, configs, DB access
│       ├── supabase/
│       │   ├── client.ts   ← browser Supabase client
│       │   └── server.ts   ← server Supabase client
│       ├── constants.ts    ← shared constants (MONTHS, CATEGORIES, etc.)
│       ├── dates.ts        ← date/month utility functions
│       ├── types.ts        ← shared TypeScript types/interfaces
│       └── utils.ts        ← generic utilities (cn, etc.)
│
├── supabase/               ← DB migrations
├── .env
├── .gitignore
├── middleware.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

Remember: Write clean, maintainable code that other developers can easily understand and modify. Prioritize user experience, accessibility, and performance in all implementations.
