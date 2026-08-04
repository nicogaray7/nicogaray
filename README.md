# Photos Nico Garay

Self-hosted photography portfolio and print/download store, built with Next.js.

Live site: [photos.nicogaray.com](https://photos.nicogaray.com)

## Overview

A bilingual (FR/EN) photo gallery site where visitors can browse photos by
country or curated collection, and purchase high-resolution downloads via
Stripe checkout. Admin panel to manage the photo catalog, orders, and site
settings, secured with 2FA (WebAuthn + TOTP).

## Tech stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth, WebAuthn (passkeys) and TOTP for admin 2FA
- **Storage**: Cloudflare R2 (S3-compatible), public web images and a
  private bucket for the original HD files sold to customers
- **Payments**: Stripe Checkout, with webhook-based order confirmation
- **AI**: Google Gemini for automatic photo title/description generation
- **i18n**: next-intl (French / English)
- **Styling**: Tailwind CSS, Radix UI primitives
- **Analytics**: Google Analytics 4, e-commerce events (view_item,
  begin_checkout, purchase) sent both client-side and server-side (Stripe
  webhook) for reliable conversion tracking
- **Deployment**: Docker, reverse-proxied through Traefik

## Key features

- **Auto-metadata on upload**: EXIF data (camera, lens, settings, GPS) is
  extracted from each photo, reverse-geocoded to a city/country, and sent to
  Gemini to generate a title and description in both languages, best-effort
  with graceful fallback if the API is unavailable.
- **Digital photo store**: browse by country (interactive world map) or by
  themed collection, buy a photo via Stripe, and receive a time-limited,
  download-count-limited signed link to the original file.
- **Private originals**: sellable high-resolution files live in a private R2
  bucket, never exposed publicly, access is granted only through signed URLs
  issued after a completed purchase.
- **Admin dashboard**: manage photos, orders, countries, and site settings,
  with an audit log of admin actions and account security backed by WebAuthn
  passkeys and TOTP.
- **SEO / distribution**: localized guide and legal pages, an RSS feed of
  featured photos for Pinterest, and Product schema markup on photo pages.

## License

Proprietary, all rights reserved. See [LICENSE](LICENSE).
