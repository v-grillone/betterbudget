## Development Guidelines

- In all interactions and commit messages, be extremely concise. Sacrifice grammar for the sake of concision.

- We are building a budgeting app called betterbudget. The main goal of this app is to have the user input daily transactions for 3 category types: needs, wants, and investing. The user sets a weekly budget amount (from which daily = weekly/7 and monthly = daily × daysInMonth are derived) and decides how the percentages should be divided between the 3 categories. Example: 50% needs, 30% wants, and 20% investing.

- Ask questions during development whenever you're not 100% sure about something or need clarification.

- When in plan mode, always check CLAUDE.md and `apps/web/DESIGN.md` for conflicts with the proposed changes. Surface any conflicts to the user and update those files as part of the plan if changes are approved.

## Tech Stack and Tools

### Web (`apps/web/`)
- TypeScript
- Next.js + App Router
- Supabase
- Stripe
- shadcn/ui
- Motion
- Tailwind CSS v4

### Mobile (`apps/mobile/`)
- TypeScript
- React Native + Expo (SDK 54)
- Expo Router v4
- NativeWind v4 (Tailwind v3)
- Supabase (`@supabase/supabase-js` direct — no SSR)

### Shared (`packages/shared/`)
- Pure TypeScript — no framework dependencies
- Consumed by both web and mobile

## Database Schema

- Users: id | user_id | name | email | password
- Transactions: id | transaction_id | user_id | category | description | amount
- Budgets: id | user_id | weekly_amount | needs_pct | wants_pct | investing_pct

## Shared Logic Rules

Follow these rules strictly. Inline helpers inside components/pages are only allowed if the logic is used in exactly one place and is trivial enough that extracting it would add no clarity.

**Hook rule**: extract to `src/hooks/` only when stateful logic (state + effects/transitions) appears in 2+ components and is non-trivial enough that the hook reduces real complexity. A single `useState` line or plain `useRouter()` call does not qualify.

| What | Where |
|------|-------|
| Date/month utilities (`currentMonth`, `daysInMonth`, `formatDate`, etc.) | `packages/shared/src/dates.ts` |
| Shared constants (`MONTHS`, `CATEGORIES`, `AMOUNT_CLASS`, etc.) | `packages/shared/src/constants.ts` |
| Shared TypeScript types/interfaces (`Budget`, `Transaction`, etc.) | `packages/shared/src/types.ts` |
| Shared validation logic (`validateTransaction`, `validateBudget`) | `packages/shared/src/validation.ts` |
| Generic web utilities (`cn`, etc.) | `apps/web/src/lib/utils.ts` |
| Stateful logic reused across 2+ components (state + effects/transitions) | `src/hooks/` (per app) |
| Server-side Supabase client (web only) | `apps/web/src/lib/supabase/server.ts` |
| Browser-side Supabase client (web only) | `apps/web/src/lib/supabase/client.ts` |
| Mobile Supabase client | `apps/mobile/src/lib/supabase/client.ts` |
| Mobile API calls (all Supabase interactions) | `apps/mobile/src/lib/api.ts` |

> Note: `apps/web/src/lib/constants.ts`, `types.ts`, and `dates.ts` are re-export shims (`export * from '@betterbudget/shared'`). Always edit the source in `packages/shared/src/`.

## Design Principles
- This project follows the design system in `apps/web/DESIGN.md`. Always reference it before creating or editing any UI components. Colors and typography in DESIGN.md also apply to the mobile app via `apps/mobile/tailwind.config.js`.
- Web: always use shadcn/ui components before writing custom HTML elements. Install new components via `npx shadcn@latest add <name>` as needed.
- Mobile: use NativeWind utility classes. No shadcn/ui — build components from RN primitives.
- Logo assets live in `apps/web/public/images/logos/`. Use `bb-logo.svg` (icon) paired with a heading text span for headers/auth pages. The wordmark SVG is reserved and not used in UI. Never use raster PNGs in UI components.

## Directory Structure

```
betterbudget/
├── package.json            ← workspace root: ["apps/*", "packages/*"]
├── tsconfig.base.json      ← shared TS base config
├── supabase/               ← DB migrations
├── .env                    ← root env (not committed)
├── .gitignore
├── Claude.md
│
├── packages/
│   └── shared/             ← framework-agnostic shared logic
│       ├── package.json    ← name: @betterbudget/shared
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts    ← barrel export
│           ├── types.ts    ← Budget, Transaction interfaces
│           ├── constants.ts← MONTHS, CATEGORIES, AMOUNT_CLASS
│           ├── dates.ts    ← date/month utility functions
│           └── validation.ts← validateTransaction, validateBudget
│
├── apps/
│   ├── web/                ← Next.js web app
│   │   ├── package.json    ← name: @betterbudget/web
│   │   ├── tsconfig.json
│   │   ├── next.config.ts
│   │   ├── middleware.ts
│   │   ├── components.json
│   │   ├── DESIGN.md       ← design system (web + mobile color/type reference)
│   │   └── src/
│   │       ├── app/        ← routes, layouts, pages
│   │       │   ├── actions/← server actions (auth, budget, transactions)
│   │       │   └── ...     ← page routes
│   │       ├── components/ ← UI components (shadcn/ui + custom)
│   │       ├── hooks/      ← custom React hooks
│   │       └── lib/
│   │           ├── supabase/← server.ts, client.ts, admin.ts
│   │           ├── constants.ts ← shim → @betterbudget/shared
│   │           ├── dates.ts     ← shim → @betterbudget/shared
│   │           ├── types.ts     ← shim → @betterbudget/shared
│   │           └── utils.ts     ← cn() helper (web only)
│   │
│   └── mobile/             ← React Native + Expo app
│       ├── package.json    ← name: @betterbudget/mobile
│       ├── tsconfig.json
│       ├── app.json
│       ├── metro.config.js ← monorepo-aware Metro config
│       ├── babel.config.js
│       ├── tailwind.config.js
│       ├── global.css
│       └── src/
│           ├── app/        ← Expo Router file-based routes
│           │   ├── _layout.tsx      ← auth guard
│           │   ├── (auth)/          ← sign-in, sign-up
│           │   └── (app)/           ← dashboard, settings
│           ├── components/ ← RN UI components
│           └── lib/
│               ├── api.ts           ← all Supabase calls
│               └── supabase/
│                   └── client.ts    ← Supabase client (SecureStore)
```

Remember: Write clean, maintainable code that other developers can easily understand and modify. Prioritize user experience, accessibility, and performance in all implementations.
