## Development Guidelines

- In all interactions and commit messages, be extremely concise. Sacrifice grammar for the sake of concision.

- We are building a budgeting app called betterbudget. The main goal of this app is to have the user input daily transactions for 3 category types: needs, wants, and investing. The user sets a monthly budget amount and decides how the percentages should be divided between the 3 categories. Example: 50% needs, 30% wants, and 20% investing.

- Ask questions during development whenever you're not 100% sure about something or need clarification.

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
- Transactions : id | transaction_id | user_id | category | desccription | amount

## Design Principles
- Minimalist / clean

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
│   │   ├── BudgetForm.tsx
│   │   └── TransactionForm.tsx
│   │
│   ├── hooks/              ← custom React hooks
│   │
│   └── lib/                ← utilities, configs, DB access
│       ├── supabase/
│       │   ├── client.ts   ← browser Supabase client
│       │   └── server.ts   ← server Supabase client
│       └── utils.ts
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