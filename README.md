# Smile Shopping — Next.js storefront

Sarees, half sarees, lehengas, suit & palazzo sets, gowns & kurtis and kidswear. Every order is sent to the shop on **WhatsApp** and paid
**cash on delivery**. There is no database, no admin panel and no online payment: everything the site shows comes from
the files in `data/` and the photos in `public/`.

## Change things

| What | Where |
|---|---|
| WhatsApp number, email, opening hours, free-delivery amount | `data/site.js` |
| Products, collections, prices, sold-out items | `data/products.mjs` (instructions at the top of the file) |
| Delivery charge (one flat rate for all districts) | `ZONES` at the bottom of `data/products.mjs` |
| Product photos | `public/products/<collection>/<slug>/` → `cover.jpg` (main image) + `1.jpeg`, `2.jpeg`, … |
| Collections | `CATEGORIES` in `data/products.mjs` (the Shop menu, footer and homepage update automatically) |
| Logo | `public/images/brand/bird.webp`, `word.webp` |
| Full-size originals (not deployed) | `_originals/` |
| Cover slideshow | `public/images/hero/hero-1.jpg` … `hero-4.jpg` |
| Page banners, collection cards, lookbook, section photos | `public/images/banners`, `collections`, `lookbook`, `sections` |

After editing, commit and push; Vercel rebuilds the site automatically.

### Add a product
**Sarees, lehengas, suit sets, gowns, kids wear:** add an entry to `COLLECTION` in `data/products.mjs`
(slug, collection, price, number of photos, name, description, optional sizes/colours) and a folder
`public/products/<collection>/<slug>/` with `cover.jpg` + `1.jpeg`, `2.jpeg`, …

**Half saree / Kanchi cotton colours:**
1. Make a folder `public/products/kanchi-cotton/my-colour/` (or `kanjivaram-silk/…`) with `cover.jpg` plus `1.jpeg`, `2.jpeg`, …
2. Add a line to `ITEMS` in `data/products.mjs`:
   `['my-colour', 'My Colour Name', 'kanjivaram-silk', 2, false],`
   (slug = folder name, colour name, collection, number of numbered photos, show in favourites; optional 6th value = its own price).

### Mark something sold out
Add its slug to `SOLD_OUT` in `data/products.mjs`, e.g. `export const SOLD_OUT = ['red-navy'];`

## How ordering works
- **Product page → "Order on WhatsApp"** opens WhatsApp with that product, option, quantity and price filled in.
- **Cart → checkout → "Send order on WhatsApp"** opens WhatsApp with the full order, an order reference
  (e.g. `SS-1118-4K7Q`), the delivery charge and their address.
- The shop confirms in the chat; the customer pays the rider in cash.

## Run it
- Local: `npm install`, then `npm run dev`.
- Vercel: import the repo; optionally set `NEXT_PUBLIC_SITE_URL` (see `.env.example`).
