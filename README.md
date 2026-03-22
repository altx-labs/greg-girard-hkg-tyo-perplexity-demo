# Greg Girard: HKG-TYO 1974–2023 — Exhibition Store

A minimal gallery mini store for the **Greg Girard: HKG-TYO 1974–2023** exhibition merchandise at WKM Gallery.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS v4**
- **Stripe Checkout** for payment processing
- **Zustand** for cart state management
- **Vercel** for deployment

## Products

| SKU | Item | Price (HKD) | Status |
|-----|------|-------------|--------|
| GG_P0001 | Exhibition Poster (Limited Edition) | 450.00 | Available |
| GG_B0001 | HK:PM — Hong Kong Night Life 1974–1989 | 490.00 | Pre-order (June 2026) |
| GG_B0002 | City of Darkness Revisited | 725.00 | Pre-order (May 2026) |
| GG_B0003 | JAL 76–88 | 690.00 | Pre-order (June 2026) |
| GG_B0004 | SNACK SAKURA | 730.00 | Pre-order (June 2026) |
| GG_B0005 | AMERICAN STOPOVER | 690.00 | Available |
| GG_B0006 | Under Vancouver 1972–1982 | 420.00 | Pre-order (June 2026) |

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your Stripe keys
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret key (server-side) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (client-side) |

## Deployment

Deployed via Vercel GitHub integration. Push to `main` to trigger a deploy.

---

Created with [Perplexity Computer](https://www.perplexity.ai/computer)
