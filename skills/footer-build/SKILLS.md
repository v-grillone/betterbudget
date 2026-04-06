# Footer Build Skill

Build a global site footer with optional legal pages (Privacy Policy, Terms of Service) and an optional signup agreement checkbox.

---

## What this skill does

1. Creates a `Footer` component with nav links and a copyright notice
2. Wires it into the root layout so it appears on every page
3. Fixes page wrappers so the footer stays pinned to the bottom
4. Optionally generates a Privacy Policy page and a Terms of Service page
5. Optionally adds an agreement checkbox to a signup form

---

## Step 1 — Gather context

Before writing any code, ask the user for the following. Use `AskUserQuestion` for ambiguous values; infer obvious ones from the codebase (e.g. read `package.json` for app name, current year for copyright).

| Question | Default / fallback |
|----------|--------------------|
| App name (for copyright) | Read from `package.json` → `name` |
| Copyright year | Current year |
| Footer links (label → route) | "Policy → /policy" and "Terms → /terms" |
| Support email | Ask — no safe default |
| Governing jurisdiction (for Terms) | Ask — no safe default |
| Include Privacy Policy page? | Yes |
| Include Terms of Service page? | Yes |
| Include signup agreement checkbox? | Ask — depends on whether a signup form exists |
| Framework | Detect from `package.json` |
| CSS approach | Detect from project (Tailwind, CSS modules, etc.) |
| Design tokens / color palette | Read existing components to match conventions |

Read at least these files before writing anything:
- Root layout (e.g. `src/app/layout.tsx`)
- One existing page to understand wrapper patterns
- One existing component to understand styling conventions

---

## Step 2 — Footer component

Create a Server Component (no `'use client'`). Location: `src/components/Footer.tsx` (or equivalent for the project structure).

**Pattern (Next.js + Tailwind):**
```tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-{border-color} py-6">
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-4">
          {/* One <Link> per footer link */}
          <Link href="/policy" className="text-xs text-{secondary} hover:text-{primary} transition-colors duration-150">
            Policy
          </Link>
          <Link href="/terms" className="text-xs text-{secondary} hover:text-{primary} transition-colors duration-150">
            Terms
          </Link>
        </div>
        <p className="text-xs text-{secondary}">© {year} {appName}</p>
      </div>
    </footer>
  )
}
```

Replace `{border-color}`, `{secondary}`, `{primary}`, `{year}`, `{appName}` with values from the project's design system.

---

## Step 3 — Root layout

**Goal:** footer appears on every page, pinned to the bottom of the viewport even on short-content pages.

1. Add `flex flex-col min-h-screen` to `<body>` (or the equivalent root wrapper)
2. Import and render `<Footer />` as the last child of `<body>`

```tsx
<body className="... flex flex-col min-h-screen">
  {children}
  <Footer />
</body>
```

---

## Step 4 — Fix page wrappers

Once the body is `flex flex-col min-h-screen`, any page whose outer div uses `min-h-screen` will double-stack and push the footer off-screen.

**Search for the pattern:**
```
grep -r "min-h-screen" src/
```

**Replace each occurrence** with `flex-1` so the page fills remaining space instead of the full viewport:

```diff
- <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
+ <div className="flex-1 bg-stone-50 flex items-center justify-center px-4">
```

**Special case — centering wrapper inside a layout wrapper:**
If a component has an outer layout div AND an inner centering div that uses `min-h-[calc(100vh-Xpx)]`, convert both:
```diff
- <div className="min-h-screen bg-stone-50">
-   <div className="flex flex-col items-center justify-center min-h-[calc(100vh-88px)]">
+ <div className="flex-1 flex flex-col bg-stone-50">
+   <div className="flex flex-col items-center justify-center flex-1">
```

---

## Step 5 — Privacy Policy page (optional)

Create `src/app/policy/page.tsx` (or equivalent). Static Server Component.

**Layout:** `max-w-2xl mx-auto px-4 py-8 sm:px-8 sm:py-12` inside a `flex-1 bg-{background}` outer div.

**Sections to include** (tailor content to what the app actually collects):

1. **What we collect** — List every data point: name, email, password (hashed), app-specific data (transactions, budgets, etc.), optional inputs (feedback, etc.). State clearly what is NOT collected (e.g. payment info, if true).
2. **How we use your data** — State the sole purpose (powering the app). Explicitly say no advertising or profiling.
3. **Data storage and processors** — Name the third-party services (e.g. Supabase, Firebase, Stripe). Mention security measures (e.g. RLS, encryption at rest).
4. **Data we do not sell** — One clear sentence.
5. **Your rights** — Account deletion removes all data. How to contact for data questions.
6. **Contact** — Support email.

**Effective date:** use the current date.

---

## Step 6 — Terms of Service page (optional)

Create `src/app/terms/page.tsx` (or equivalent). Static Server Component. Same layout as Policy page.

**Sections to include:**

1. **What [App] is** — Describe the service. Add "not financial/legal/medical advice" disclaimer if relevant.
2. **Your account** — User responsible for credentials. Accurate info required.
3. **Acceptable use** — No unlawful use, no reverse engineering, no malicious content.
4. **Service availability** — "As is / as available." Features may change.
5. **Limitation of liability** — No indirect/consequential damages, especially for decisions made using app data.
6. **Account termination** — User may delete anytime; provider may terminate for violations.
7. **Changes to these terms** — Continued use = acceptance.
8. **Governing law** — Use the jurisdiction provided by the user.
9. **Contact** — Support email.

**Effective date:** use the current date.

---

## Step 7 — Signup agreement checkbox (optional)

Only implement if the project has a signup form and the user confirms they want it.

**Locate the signup form** — find the file and identify:
- Existing state variables
- The `canSubmit` (or equivalent) condition
- The submit button

**Add:**

```tsx
// State
const [agreed, setAgreed] = useState(false)

// Gate — add && agreed to the existing condition
const canSubmit = {existingCondition} && agreed

// UI — insert between error message and submit button
<div className="flex items-start gap-2">
  <input
    id="agree"
    name="agreed"
    type="checkbox"
    checked={agreed}
    onChange={e => setAgreed(e.target.checked)}
    className="mt-0.5 accent-{primary-color} cursor-pointer"
  />
  <label htmlFor="agree" className="text-xs text-{secondary} leading-relaxed cursor-pointer">
    I agree to the{' '}
    <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-{primary} hover:underline">
      Terms of Service
    </Link>
    {' '}and{' '}
    <Link href="/policy" target="_blank" rel="noopener noreferrer" className="text-{primary} hover:underline">
      Privacy Policy
    </Link>
  </label>
</div>
```

Links open in a **new tab** so the user doesn't lose their partially filled signup form.

**The `name="agreed"` attribute is required.** Without it the checkbox value is never included in `FormData` and the server receives nothing. Client-side `canSubmit` is a UX convenience only — it can be bypassed by submitting the form directly.

**Also add server-side validation** in the signup server action, after other field checks and before calling the auth provider:

```ts
if (!formData.get('agreed')) return 'You must agree to the Terms of Service and Privacy Policy.'
```

---

## Step 8 — Allow public access to legal pages (if auth-gated middleware exists)

If the project uses middleware to redirect unauthenticated users to a login page, `/policy` and `/terms` must be explicitly exempted — otherwise users who click those links from the signup form will be redirected before they can read them.

**Find the middleware file** (e.g. `middleware.ts`) and locate the route check that determines which paths are publicly accessible (often called `isAuthRoute` or a similar pattern).

**Add `/terms` and `/policy` to the public routes list:**

```diff
  const isAuthRoute = pathname.startsWith('/signin') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/auth/callback') ||
+   pathname.startsWith('/terms') ||
+   pathname.startsWith('/policy')
```

The exact shape will differ by framework and auth library — the key is that unauthenticated requests to `/terms` and `/policy` must pass through without redirect.

---

## Verification checklist

- [ ] Footer visible on every page
- [ ] Footer links navigate to `/policy` and `/terms`
- [ ] Footer stays at the bottom of the viewport on short-content pages (auth pages, legal pages)
- [ ] No double-scroll on pages that previously used `min-h-screen`
- [ ] `/policy` renders with correct content and footer below it
- [ ] `/terms` renders with correct content and footer below it
- [ ] On signup: submit blocked until checkbox is checked
- [ ] Checkbox links open in a new tab; back-button returns to signup
- [ ] Submitting the form without the checkbox checked (e.g. via curl/devtools) returns the server-side error
- [ ] `/policy` and `/terms` load without redirect when logged out
- [ ] No TypeScript errors (`npm run build` or `tsc --noEmit`)
