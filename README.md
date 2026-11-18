# Smile Shopping — Next.js + Supabase

Storefront (home, shop, search, product, cart, checkout, order tracking, WhatsApp) and an admin dashboard at `/admin`
(orders, products with photo upload, categories, delivery charges, WhatsApp number).

## Setup
1. **Supabase** → SQL Editor → paste `supabase/schema.sql` → Run.
2. **Supabase** → Authentication → Users → Add user (email + password, tick *Auto confirm*).
   Then in SQL Editor: `insert into admins (email) values ('that@email.com');`
3. **Supabase** → Authentication → Sign In / Providers → turn **off** "Allow new users to sign up".
4. **Vercel** → import this repo → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase → Project Settings → API)
   - `NEXT_PUBLIC_SITE_URL` (e.g. https://smileshopping.vercel.app)
   - optional: `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GA_ID`
5. Deploy. Sign in at `/admin`.

## Local dev
`cp .env.example .env.local`, fill in keys, `npm install`, `npm run dev`.

## How ordering works (no payment gateway)
- **Product page → "Order on WhatsApp"** opens WhatsApp with that product, option, qty and price filled in.
- **Cart → checkout → "Send order on WhatsApp"** saves the order (it appears in `/admin` with its order number),
  then opens WhatsApp with the full order, delivery address and a tracking link. The customer pays cash on delivery.
- The WhatsApp number comes from **Admin → Settings** (format `94771234567`).
- Existing database: run `supabase/004_whatsapp_orders.sql` once to remove the old sandbox payment functions.
- Prices, delivery and stock are always calculated in the database (`place_order`), never trusted from the browser.
