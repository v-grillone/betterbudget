# Security Check — Next.js / Supabase App

A comprehensive security audit and fix guide for a Next.js App Router + Supabase application. Run this whenever adding major features, before deploying to production, or on a recurring schedule.

---

## 1. Security Headers

**File:** `next.config.ts`

Add a `headers()` export that applies to all routes (`/(.*)`). Required headers:

| Header | Value |
|--------|-------|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `Content-Security-Policy` | See below |

**CSP template** (adjust origins for your services):

```typescript
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
  : "";

// In headers():
{
  key: "Content-Security-Policy",
  value: [
    "default-src 'self'",
    `connect-src 'self' https://${supabaseHost} wss://${supabaseHost}`,
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    "frame-ancestors 'none'",
  ].join("; "),
}
```

**Verify:** Open browser devtools → Network → any request → Response Headers. All headers should be present.

---

## 2. Server Action Input Validation

Every server action that writes to the database must validate all inputs before any DB call.

### Transactions (`addTransaction`, `updateTransaction`)

- `category`: must be one of the valid enum values (e.g. `needs | wants | investing`). Derive from your `CATEGORIES` constant.
- `amount`: `isFinite(amount) && amount > 0`
- `description`: non-empty, max 255 chars after `.trim()`
- `date`: matches `/^\d{4}-\d{2}-\d{2}$/`

Extract a shared validator called before both insert and update:

```typescript
function validateTransactionFields(category, description, amount, date): string | undefined {
  if (!VALID_CATEGORIES.includes(category)) return 'Invalid category.'
  if (!description.trim() || description.length > 255) return 'Description must be 1–255 characters.'
  if (!isFinite(amount) || amount <= 0) return 'Amount must be a positive number.'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'Invalid date format.'
}
```

### Budget (`upsertBudget`)

- `weekly_amount`: `isFinite(weekly_amount) && weekly_amount > 0`
- Each `*_pct`: `isFinite(pct) && pct >= 0 && pct <= 100`
- Sum check: use `Math.round(needs + wants + investing) !== 100` — **never** `!== 100` directly (floating-point precision bug: `33.3 + 33.3 + 33.4` evaluates to `100.00000000000001`)

### Auth (`signUp`, `changeName`, `changePassword`)

- `name`: non-empty, max 100 chars (both signup and change-name paths)
- `email`: basic format check — `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- `password` (all paths): min 8 chars + at least one digit + at least one special char. Apply the same rules to `changePassword`, not just `signUp`.

---

## 3. Authentication & Authorization

### Server actions
Every action that reads or writes user data must:
1. Call `supabase.auth.getUser()` and check `if (!user) return 'Not authenticated'`
2. Scope all DB queries with `.eq('user_id', user.id)` — never trust a user-supplied ID for ownership

### Middleware
Ensure `middleware.ts` redirects unauthenticated users away from protected routes and authenticated users away from `/signin` and `/signup`. The `/auth/callback` route must be excluded from auth checks.

### RLS policies (Supabase Dashboard)
Verify Row Level Security is **enabled** on every table and that policies exist for SELECT, INSERT, UPDATE, DELETE — each scoped to `auth.uid() = user_id`. This is the last line of defense if a server action auth check is bypassed.

---

## 4. Secrets & Environment Variables

- `.env` / `.env.local` must be in `.gitignore` — verify with `git check-ignore -v .env`
- `SUPABASE_SERVICE_ROLE_KEY` must **never** appear in any `NEXT_PUBLIC_*` variable
- The admin Supabase client (using `SERVICE_ROLE_KEY`) must import `server-only` to prevent bundling into the browser
- If secrets were ever accidentally committed, rotate them immediately in Supabase Dashboard → Project Settings → API

---

## 5. Sensitive Account Operations

### Account deletion
`deleteAccount` is irreversible. Protect it:
- Require password re-authentication before proceeding (call `supabase.auth.signInWithPassword` with the submitted password and bail if it fails)
- Consider a soft-delete or grace period before hard-deleting auth user

### Password change
Enforce the same complexity rules as signup. Do not allow a weaker password to be set via the change-password flow than what was required at registration.

---

## 6. Out-of-Scope Items (Require External Services)

These cannot be fixed in code alone — address them at the infrastructure or Supabase config level:

| Issue | Solution |
|-------|----------|
| Brute-force on login/signup | Rate limiting via Upstash Redis + Vercel middleware, or Supabase's built-in auth rate limits |
| Bot account creation | Enable hCaptcha or Cloudflare Turnstile in Supabase Dashboard → Auth → Security |
| Email verification | Enable "Confirm email" in Supabase Dashboard → Auth → Providers → Email |
| Audit logging | Add a `audit_log` table and insert a row from each sensitive server action |
| RLS verification | Use Supabase Dashboard → Auth → Policies to confirm policies exist on all tables |

---

## 7. Dependency Audit

```bash
npm audit
```

Review any high/critical severity findings. For false positives or unfixable transitive deps, document the reason before dismissing.

---

## Checklist

- [ ] Security headers present in `next.config.ts` (CSP, HSTS, X-Frame-Options, etc.)
- [ ] All server actions validate category, amount, description, date before DB insert/update
- [ ] Budget percentage sum uses `Math.round()` comparison
- [ ] `name` and `email` validated in all auth actions
- [ ] `changePassword` enforces same complexity as `signUp`
- [ ] Every server action scopes queries with `.eq('user_id', user.id)`
- [ ] RLS enabled and policies verified in Supabase Dashboard
- [ ] `.env` is gitignored; `SERVICE_ROLE_KEY` never in `NEXT_PUBLIC_*`
- [ ] Admin client imports `server-only`
- [ ] Account deletion requires re-authentication
- [ ] `npm audit` passes with no high/critical findings
- [ ] (External) Rate limiting on auth endpoints
- [ ] (External) Email verification enabled
- [ ] (External) CAPTCHA on signup
