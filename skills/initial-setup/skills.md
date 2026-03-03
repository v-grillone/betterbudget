# Setup a Next.js / Supabase App

A step-by-step guide to bootstrap a production-ready Next.js + Supabase application with authentication, server-side rendering, real-time data, and optional file uploads.

---

## Prerequisites

- Node.js 18+
- npm, pnpm, or bun
- A [Supabase](https://supabase.com) account (free tier is fine)

---

## 1. Scaffold the Next.js App

```bash
npx create-next-app@latest my-app
```

Select the following options when prompted:

| Option | Choice |
|---|---|
| TypeScript | Yes |
| ESLint | Yes |
| Tailwind CSS | Yes |
| `src/` directory | Yes |
| App Router | Yes |
| Import alias (`@/*`) | Yes (default `@/*`) |

```bash
cd my-app
```

---

## 2. Install Supabase Packages

```bash
npm install @supabase/supabase-js @supabase/ssr
```

- `@supabase/supabase-js` — core Supabase client
- `@supabase/ssr` — SSR/cookie helpers for Next.js App Router

---

## 3. Create a Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a new project
2. Once created, go to **Project Settings → API**
3. Copy your **Project URL** and **anon public** key

---

## 4. Set Up Environment Variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

> The `NEXT_PUBLIC_` prefix exposes these values to the browser — safe because they are the public anon key (not the service role key).

Make sure `.env.local` is in `.gitignore` (it is by default with `create-next-app`).

---

## 5. Create Supabase Client Helpers

### Browser Client — `src/lib/supabase/client.ts`

Used in Client Components, hooks, and real-time subscriptions.

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### Server Client — `src/lib/supabase/server.ts`

Used in Server Components, Server Actions, and API routes.

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll is called from a Server Component — cookies are read-only here
          }
        },
      },
    }
  );
}
```

---

## 6. Set Up Middleware

Create `middleware.ts` at the **project root** (next to `package.json`).

This runs on every request and automatically refreshes Supabase auth tokens stored in cookies.

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Triggers token refresh — do not remove
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

---

## 7. Configure `next.config.ts`

If you will use Supabase Storage for images, allow the domain in the Next.js Image config:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
```

---

## 8. Enable Email Auth in Supabase

1. Go to your Supabase Dashboard → **Authentication → Providers**
2. Make sure **Email** is enabled
3. (Optional) Disable "Confirm email" for local development so sign-ups work immediately

---

## 9. Build the Auth Component

Create `src/components/auth/Auth.tsx` — a Client Component with sign in / sign up:

```typescript
"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

const supabase = createClient();

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError("Could not create account. Please try again.");
        setIsLoading(false);
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("Invalid email or password.");
        setIsLoading(false);
        return;
      }
    }

    setEmail("");
    setPassword("");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:underline font-medium"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};
```

Create `src/components/auth/SignOutButton.tsx`:

```typescript
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export const SignOutButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleSignOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
    >
      {isLoading ? "Signing out..." : "Sign out"}
    </button>
  );
};
```

---

## 10. Auth Hook (Optional)

If you need to react to auth state changes on the client side, create `src/hooks/useAuth.ts`:

```typescript
import { createClient } from "@/lib/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setIsLoadingAuth(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { session, isLoadingAuth };
}
```

---

## 11. Protect Pages Server-Side

In your Server Component (`src/app/page.tsx`), check the user and conditionally render:

```typescript
import { createClient } from "@/lib/supabase/server";
import { Auth } from "@/components/auth/Auth";
import Dashboard from "@/components/Dashboard"; // your authenticated content

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main>
      {user ? <Dashboard user={user} /> : <Auth />}
    </main>
  );
}
```

---

## 12. Set Up a Database Table

In the Supabase Dashboard → **Table Editor**:

1. Click **New Table**
2. Name your table (e.g., `items`)
3. Add columns: `title` (text), `description` (text), `user_id` (uuid), `created_at` (timestamptz, default `now()`)
4. Enable **Row Level Security (RLS)**

### Add RLS Policies

In **Authentication → Policies**, add policies on your table:

```sql
-- Allow users to read only their own rows
CREATE POLICY "Users can view own rows"
ON items FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to insert their own rows
CREATE POLICY "Users can insert own rows"
ON items FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own rows
CREATE POLICY "Users can update own rows"
ON items FOR UPDATE
USING (auth.uid() = user_id);

-- Allow users to delete their own rows
CREATE POLICY "Users can delete own rows"
ON items FOR DELETE
USING (auth.uid() = user_id);
```

---

## 13. Fetch Data Server-Side

Pass initial data from the server to client components to avoid loading flickers:

```typescript
// src/app/page.tsx
export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let initialItems = [];
  if (user) {
    const { data } = await supabase
      .from("items")
      .select("*")
      .order("created_at", { ascending: true });
    initialItems = data ?? [];
  }

  return (
    <main>
      {user
        ? <Dashboard initialItems={initialItems} user={user} />
        : <Auth />
      }
    </main>
  );
}
```

---

## 14. Real-Time Subscriptions (Optional)

Subscribe to database changes in a hook using the browser client:

```typescript
import { createClient } from "@/lib/supabase/client";
import { useEffect, useMemo, useState } from "react";

interface Item { id: number; title: string; /* ... */ }

export function useItems(initialItems: Item[] = []) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const channel = supabase
      .channel("items-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "items" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setItems((prev) => [...prev, payload.new as Item]);
          } else if (payload.eventType === "UPDATE") {
            setItems((prev) =>
              prev.map((item) =>
                item.id === (payload.new as Item).id ? (payload.new as Item) : item
              )
            );
          } else if (payload.eventType === "DELETE") {
            setItems((prev) =>
              prev.filter((item) => item.id !== (payload.old as Item).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return { items };
}
```

> **Note:** Enable Realtime on your table in Supabase Dashboard → **Database → Replication → Supabase Realtime → Tables**.

---

## 15. File Uploads to Supabase Storage (Optional)

### Create a Storage Bucket

1. Supabase Dashboard → **Storage → New Bucket**
2. Name it (e.g., `images`), set to **Public** if URLs need to be publicly accessible

### Upload a File

```typescript
const uploadFile = async (file: File): Promise<string | null> => {
  const supabase = createClient();
  const fileName = `uploads/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(fileName, file);

  if (error) {
    console.error(error.message);
    return null;
  }

  const { data } = supabase.storage
    .from("images")
    .getPublicUrl(fileName);

  return data.publicUrl;
};
```

---

## 16. Tailwind CSS v4 Notes

With Tailwind v4 (installed by `create-next-app`), the setup is slightly different from v3:

**`src/app/globals.css`** — use the import syntax, not `@tailwind` directives:

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

**`postcss.config.mjs`** — use `@tailwindcss/postcss`:

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

> There is no `tailwind.config.js` file needed for basic setups in v4.

---

## 17. Final Folder Structure

```
my-app/
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── auth/
│   │       ├── Auth.tsx
│   │       └── SignOutButton.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   └── lib/
│       └── supabase/
│           ├── client.ts
│           └── server.ts
├── .env.local               ← gitignored, holds secrets
├── middleware.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## 18. Key Dependencies Reference

```json
{
  "dependencies": {
    "@supabase/ssr": "^0.8.0",
    "@supabase/supabase-js": "^2.97.0",
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

---

## Quick-Start Checklist

- [ ] `npx create-next-app@latest` with TypeScript, Tailwind, src/, App Router, `@/*` alias
- [ ] `npm install @supabase/supabase-js @supabase/ssr`
- [ ] Create Supabase project, copy URL + anon key
- [ ] Add keys to `.env.local`
- [ ] Create `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts`
- [ ] Create `middleware.ts` at project root
- [ ] Add `images.remotePatterns` to `next.config.ts` (if using Storage)
- [ ] Enable Email auth in Supabase Dashboard
- [ ] Build `Auth.tsx` and `SignOutButton.tsx` components
- [ ] Protect `page.tsx` with server-side auth check
- [ ] Create database table with RLS + policies
- [ ] (Optional) Enable Realtime and add subscription hook
- [ ] (Optional) Create Storage bucket and upload helper