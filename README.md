# White & Wick

A premium, boutique e-commerce site for a hand-poured candle brand — with a full storefront **and** a working admin panel, wired to the same data store.

Built with **Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS**. Data is persisted to JSON files under `/data` for the demo; swap the module in `src/lib/db.ts` for Postgres / Supabase when you're ready.

---

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

The admin panel lives at http://localhost:3000/admin.

- **Username:** `admin`
- **Password:** `whiteandwick`

Anything you change in the admin panel (products, prices, stock, orders, coupons, banners, FAQs, the hero) is written to `/data/*.json` and shows up on the storefront instantly.

---

## What's inside

### Storefront

- Home with hero, featured collections, best sellers, brand story, gifting banner, reviews, Instagram gallery, newsletter
- Shop listing with sidebar filters (collection, category, fragrance, price, availability) and sorting
- Product detail with image gallery, quantity, add to cart, buy now, wishlist, WhatsApp enquiry, information tabs, reviews, related & also-loved
- Collections index + individual collection pages with hero
- Cart page + slide-in cart drawer, coupon codes, gift message, order notes, live discount + free-shipping logic
- Full checkout with contact + shipping address + payment method placeholder, server action creates a real order
- Order confirmation page with tracking info
- Search overlay + `/search?q=` results page
- Wishlist (localStorage), account page, saved orders
- Gifting page with custom-hamper enquiry form (writes to admin)
- About, Contact, FAQs, Shipping, Returns, Privacy, Terms

### Admin panel

- Login (`/admin/login`) → cookie-based auth → middleware guards `/admin/*`
- Dashboard with sales stats, revenue chart, recent orders, best sellers, low-stock, gift enquiries
- Products — table, create, edit, duplicate, delete, MRP/price/discount live preview, image URL manager, SEO fields, best-seller/new-arrival flags, status
- Inventory — inline stock editor, low-stock / OOS flagging
- Orders — table, filters by status, order detail with status transitions (order + payment)
- Customers — table with orders count, total spend, last order
- Coupons — full CRUD (percent + fixed, min order, max discount, usage limits, per-customer limits, active toggle)
- Collections — grid view with cover + count
- Banners — homepage promotional banners
- Homepage CMS — hero heading/subheading/image, CTAs, announcement bar
- FAQs — full CRUD
- Reviews — approve/hide/delete
- Gift enquiries — inbound custom-hamper requests with status
- Analytics — revenue, AOV, repeat customers, sales by product & collection
- Settings — free-shipping threshold, socials, contact, integrations notes

---

## Architecture

- `src/app/(site)` — storefront (public)
- `src/app/admin` — admin panel (auth-gated by `src/middleware.ts`)
- `src/lib/db.ts` — reads/writes JSON store under `/data`
- `src/lib/seed.ts` — demo products, collections, customers, orders, coupons, banners, reviews, FAQs, gift enquiries, settings
- `src/lib/store.ts` — Zustand stores for cart / wishlist / UI
- `src/components/site/*` — storefront components
- `src/components/admin/*` — admin components

Server actions live next to the pages that use them (`checkout/actions.ts`, `admin/products/actions.ts`, etc.) and call `revalidatePath` so storefront updates instantly after edits.

---

## Wiring real integrations

- **Razorpay** — plug your key into an env, generate an order in `checkout/actions.ts::placeOrder` before returning; use the Razorpay Checkout on the client to complete.
- **WhatsApp Cloud API / SMS / Email** — hook into a `lib/notifications.ts` module and call from `placeOrder` and `updateOrderAction`.
- **Cloud storage for images** — replace the URL-based image field in `ProductForm` with S3 / Supabase Storage upload.
- **Database** — swap `src/lib/db.ts` for your Postgres or Supabase client. The public API (`getProducts`, `saveOrders`, etc.) is stable, so pages/admin don't need to change.

---

## SEO

- Per-product & per-collection metadata (title, description, OG image) generated in `generateMetadata`
- Clean URLs — `/product/rose-bloom-candle`, `/collections/best-sellers`
- Breadcrumbs on every relevant page
- Ready for `sitemap.ts` / `robots.ts` — add them under `src/app/`

---

## Notes on the demo store

- Data lives in `/data/*.json`. Deleting these files re-seeds from `src/lib/seed.ts` on next request.
- Placeholder photography is loaded from Unsplash (whitelisted in `next.config.ts`). Replace with your own product photography when ready.
- Cart & wishlist live in `localStorage`.

