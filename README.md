# Astro Guneesha — Complete Guide

Astrology + e-commerce website for **Pooja M Kaushik** (Astro Guneesha): consultations, pujas,
courses, e-books, sacred treasures, a shop with cart/checkout, insights/blog, a daily Panchanga
widget, sign-in, and a private dashboard (My Charts / Consultations / Orders).

This single file explains how the app works, how to edit it, how to publish it, how the backend is
connected, and how to plug in Razorpay and your own links.

---

## 1. Tech stack (what actually runs)

| Layer | Technology |
| --- | --- |
| Framework | **TanStack Start** (React 19 + Vite 7, file-based routing, server functions). Same App-Router style as Next.js — routes are files, server code runs on the server. |
| Styling | Tailwind CSS v4 via `src/styles.css` (design tokens, no `tailwind.config.js`) |
| Language | TypeScript |
| Backend | **Lovable Cloud** = managed PostgreSQL + Auth + Storage (Supabase under the hood) |
| Payments | Razorpay (server-side order creation + HMAC-verified webhook) |
| Bookings | Topmate (external booking links) |

---

## 2. Folder map

```text
src/
  routes/                     every file = one URL
    __root.tsx                app shell: fonts, <Nav/>, <Footer/>, providers
    index.tsx                 /            home (hero, Panchanga, offerings, insights)
    about.tsx                 /about       Pooja's bio
    consultations.tsx         /consultations
    pujas.tsx                 /pujas
    courses.tsx               /courses
    ebooks.tsx                /ebooks
    sacred-treasures.tsx      /sacred-treasures
    shop.tsx                  /shop        product catalogue + cart
    checkout.tsx              /checkout    order placement
    articles.tsx              /articles    insights/blog
    schedule.tsx              /schedule    landing page for Instagram/YouTube/FB traffic
    auth.tsx                  /auth        sign in / sign up (email + Google)
    _authenticated/
      route.tsx               guard: redirects signed-out users to /auth
      dashboard.tsx           /dashboard   My Charts / Consultations / Orders
    api/public/payments/
      webhook.ts              POST /api/public/payments/webhook (Razorpay)
  components/site/            Nav, Footer, PageHeader, ProductGrid
  components/ui/              shadcn/ui primitives (button, card, tabs, ...)
  lib/
    site.ts                   ALL your links + brand text (edit here first)
    cart.tsx                  cart state, saved in the browser
    payments.functions.ts     server function that creates Razorpay orders
  integrations/supabase/      auto-generated backend client — do not edit
  styles.css                  colors, fonts, sizes (the whole design system)
  assets/                     images
```

---

## 3. How it works, end to end

1. **Visitor lands** on `/` or `/schedule` (the link you put in your Instagram/YouTube bio).
2. **Browsing**: products, courses, e-books, pujas and articles are read from the database with
   public read-only access, so no login is needed to browse.
3. **Booking a session**: every "Book a Session" / "Book a Consultation" button opens your Topmate
   page in a new tab.
4. **Buying a product**: "Add to cart" → `/checkout`. Checkout requires sign-in, saves an `orders`
   row tied to the signed-in user, and (once Razorpay keys exist) creates a Razorpay order
   server-side.
5. **Payment confirmation**: Razorpay calls `POST /api/public/payments/webhook`. The handler
   verifies the HMAC-SHA256 signature with your webhook secret, then marks the order `paid` and
   shipping `processing`. Without a valid signature nothing is updated.
6. **Dashboard**: `/dashboard` is guarded. Signed-in users see only their own charts, bookings and
   orders — enforced in the database itself, not just in the UI.

---

## 4. Backend: where your data lives and how it's secured

The backend is already connected. Nothing to configure — the app reads
`VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` from `.env` (managed automatically).

**Tables**

| Table | Contents | Who can read |
| --- | --- | --- |
| `profiles` | name, phone, birth date/time/place | only the owner |
| `charts` | natal chart data + AI summary | only the owner |
| `bookings` | consultation appointments | only the owner |
| `orders`, `order_items` | purchases, shipping status | only the owner |
| `products` | catalogue | everyone |
| `articles` | blog posts | everyone |
| `panchanga` | daily astrological values | everyone |

**Security already in place**

- Row Level Security on every private table with the rule `auth.uid() = user_id`, so user A can
  never read user B's data even by crafting a request.
- **Encryption in transit**: all traffic is HTTPS/TLS 1.2+. **Encryption at rest**: database,
  backups and storage are AES-256 encrypted by the managed platform.
- Sessions are JWTs handled by the auth client; secrets never reach the browser.
- Razorpay secret keys live only in server environment variables and are read inside server
  handlers.
- Webhook requests are rejected unless the HMAC-SHA256 signature matches.
- Input is validated with Zod on the server before use.

**Viewing / editing data**: open the **Backend** (Cloud) tab in Lovable to browse tables, run
queries, see auth users, and manage secrets.

---

## 5. Editing the site (step by step)

### 5.1 Change your links, name, or brand text
Everything social/booking-related is centralised in `src/lib/site.ts`:

```ts
export const SITE = {
  astrologer: "Pooja M Kaushik",
  topmate: "https://topmate.io/guneesha_kaushik/",
  instagram: "...",
  youtube: "...",
  facebook: "...",
};
```
Change a value there and it updates the nav, footer, hero, schedule page and every booking button.

### 5.2 Change colors, fonts and text size
All of it is in `src/styles.css`:

- `--background` (deep cosmic charcoal), `--foreground` / `--starlight` (light readable text),
  `--gold` and `--primary` (warm amber-orange accent used on buttons, links and headings) — colors
  are written in `oklch()`; replace a token value to re-theme the whole site.
- `--font-display` / `--font-sans` — currently Cinzel headings + Inter body.
- `html { font-size: 15px }` and `body { font-size: 0.933rem }` — Instagram-style compact sizing;
  raise/lower these two numbers to scale the entire site.

Never hardcode `text-white` / `bg-[#fff]` in components — use the tokens (`bg-background`,
`text-foreground`, `text-primary`) so the theme stays consistent.

### 5.3 Edit page text
Open the matching file in `src/routes/` (e.g. `about.tsx` for the About page) and edit the text
between the tags. The preview reloads instantly.

### 5.4 Add / edit products, articles, Panchanga
These come from the database, not code. Open the **Backend** tab → table (`products`,
`articles`, `panchanga`) → add or edit rows. Useful `products` columns: `name`, `slug`,
`description`, `price_inr`, `category` (`gemstone`, `rudraksha`, `yantra`, `ebook`, `course`,
`puja`, `consultation`), `image_url`, `topmate_url`, `is_active`.

### 5.5 Add a new page
Create `src/routes/my-page.tsx`, export a route with `createFileRoute("/my-page")`, then add a
link to it in `src/components/site/Nav.tsx`. Routing is automatic from the file name.

---

## 6. Adding Razorpay (IDs, secrets, webhook)

1. Create a Razorpay account → **Dashboard → Settings → API Keys → Generate Key**. You get a
   **Key ID** (`rzp_test_...` / `rzp_live_...`) and a **Key Secret** (shown once — copy it).
2. In Lovable chat, say: *"Add secrets RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET,
   RAZORPAY_WEBHOOK_SECRET"* — you'll get a secure form. Never paste secrets into code or commit
   them to GitHub.
3. Create the webhook: Razorpay **Dashboard → Settings → Webhooks → Add New Webhook**
   - URL: `https://<your-domain>/api/public/payments/webhook`
   - Secret: the same string you saved as `RAZORPAY_WEBHOOK_SECRET`
   - Events: `payment.captured` and `payment.failed`
4. Test with test-mode keys and Razorpay's test cards, then swap to live keys.

Until keys are present, checkout still records orders and booking falls back to Topmate.

---

## 7. Publishing (fastest path)

1. Click **Publish** (top-right in Lovable). You get a free live URL like
   `astro-guneesha.lovable.app`.
2. The backend is already live and linked — **backend changes deploy instantly**, frontend changes
   go live when you click Publish/Update again.
3. Rename the URL slug or connect a custom domain in **Project Settings → Domains**.

**Frontend vs backend**: database, auth and API routes are always live; only UI changes need a
re-publish.

---

## 8. GitHub + Vercel (optional alternative hosting)

1. **GitHub**: in Lovable, use **GitHub → Connect** to create a repo. Every change is committed
   automatically; pushes from your machine sync back into Lovable.
2. **Run locally**:
   ```sh
   git clone <your-repo-url>
   cd <repo>
   npm i
   npm run dev
   ```
3. **Vercel free tier**: Import the GitHub repo on vercel.com → framework preset auto-detected
   (Vite/TanStack Start) → add the environment variables from `.env`
   (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`) plus your
   Razorpay secrets → Deploy. Note: the app targets an edge runtime; Lovable hosting is the
   zero-config option, Vercel needs the env vars set correctly and the webhook URL updated to the
   Vercel domain.

---

## 9. Domain names — the honest answer

- Free `.com` / `.in` domains do not exist. Registrars charge roughly ₹800–1,200/year
  (`.in` is usually cheapest) at GoDaddy, Namecheap, Cloudflare Registrar or BigRock.
- Free options that do work: the `*.lovable.app` subdomain, or `*.vercel.app`.
- Once you buy a domain, connect it in **Project Settings → Domains** and add the DNS records the
  UI shows you. Propagation takes minutes to a few hours.

---

## 10. Security checklist (already done ✅ / your job ⬜)

- ✅ RLS on all private tables, `auth.uid() = user_id`
- ✅ HTTPS everywhere, AES-256 encryption at rest
- ✅ Server-only payment secrets, HMAC-verified webhook
- ✅ Zod validation on server inputs, guarded `/dashboard` routes
- ✅ External links use `rel="noreferrer"` and open in new tabs
- ⬜ Turn on email confirmation for sign-ups before going live
- ⬜ Use Razorpay **test** keys until you've completed a full test purchase
- ⬜ Keep secrets out of GitHub (they live in the secrets manager, not `.env` in the repo)

---

## 11. What you should do next

1. **Review the look** in the preview (dark cosmic theme with warm orange accents, compact
   Instagram-style text) and tell me anything you'd like adjusted.
2. **Send real content**: your bio for About, and the real names/prices for consultations, pujas,
   courses, e-books and sacred treasures — or edit them directly in the Backend tab.
3. **Add product photos** (upload to storage or give me image links).
4. **Enable email confirmation** for sign-ups.
5. **Get Razorpay test keys** and add the three secrets, then run one test order.
6. **Publish**, then buy a `.in` or `.com` domain and connect it.
7. Optional: connect GitHub for a code backup.

Tell me which of these you want next and I'll build it.
