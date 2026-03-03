## Development Guidelines

- In all interactions and commit messages, be extremely concise. Sacrifice grammar for the sake of concision.

- We are building a budgeting app. The main goal of this app is to have the user input daily transactions for 3 category types: needs, wants, and investing. The user sets a monthly budget amount and decides how the percentages should be divided between the 3 categories. Example: 50% needs, 30% wants, and 20% investing.

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
my-app/
├── node_modules/ 
├── public/             ← public static assets (images, fonts, icons, etc...)
├── src/
│   ├── app/                ← routes, layouts, and pages
│   │   ├── globals.css     ← global styles
│   │   ├── layout.tsx      ← root layout shared UI for all pages
│   │   ├── page.tsx        ← homepage /
│   │   ├── signin/         ← signin route /signin
│   │   │    └── page.tsx
│   │   └── signup/         ← signup route /signup
│   │       └── page.tsx
│   │ 
│   ├── components/         ← reusable UI components
│   │   
│   ├── hooks/              ← custom react hooks
│   │  
│   └── lib/                ← utility functions, helper libraries, configs, and database access
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