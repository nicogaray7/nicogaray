import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// --- Content-Security-Policy ---------------------------------------------
// Shipped in *Report-Only* mode first so it never breaks the Stripe checkout
// or analytics; violations are reported to the browser console without being
// blocked. Once Nico confirms the report is clean, flip CSP_ENFORCE=true (or
// rename the header to `Content-Security-Policy`) to enforce it.
//
// Origins allowed:
//   - self
//   - GTM / GA4 (googletagmanager, google-analytics)
//   - Stripe (js.stripe.com scripts + frame, api.stripe.com xhr)
//   - R2 public image host (derived from R2 public URL env var)
//   - Google avatar/thumbnail hosts used by next/image remotePatterns
const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || process.env.R2_PUBLIC_URL || '';
let r2Origin = '';
try {
  if (r2PublicUrl) r2Origin = new URL(r2PublicUrl).origin;
} catch {
  r2Origin = '';
}

const imgSrc = [
  "'self'",
  'data:',
  'blob:',
  'https://*.r2.cloudflarestorage.com',
  'https://lh3.googleusercontent.com',
  'https://yt3.ggpht.com',
  'https://yt3.googleusercontent.com',
  'https://www.google-analytics.com',
  'https://www.googletagmanager.com',
  r2Origin,
]
  .filter(Boolean)
  .join(' ');

const cspDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self' https://checkout.stripe.com",
  // 'unsafe-inline' is required for the gtag bootstrap snippet and Next.js
  // inline runtime; 'unsafe-eval' is not granted.
  "script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline'",
  `img-src ${imgSrc}`,
  "font-src 'self' data:",
  "connect-src 'self' https://api.stripe.com https://www.google-analytics.com https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com",
  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
  'upgrade-insecure-requests',
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: 'photos.nicogaray.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  async redirects() {
    return [
      {
        // Permanent redirect of legacy "photographie-n-X" slugs to "photo-n-X"
        source: '/:locale/gallery/photographie-n-:n',
        destination: '/:locale/gallery/photo-n-:n',
        permanent: true,
      },
      // Branded Instagram links with UTM tags for GA4 attribution.
      // Bio link → /ig (one link per profile, the main one)
      {
        source: '/ig',
        destination: '/?utm_source=instagram&utm_medium=social&utm_campaign=bio',
        permanent: false,
      },
      // Story link sticker → /ig/story
      {
        source: '/ig/story',
        destination: '/?utm_source=instagram&utm_medium=social&utm_campaign=story',
        permanent: false,
      },
      // Generic post / feed link with optional named campaign suffix
      {
        source: '/ig/post/:campaign',
        destination:
          '/?utm_source=instagram&utm_medium=social&utm_campaign=:campaign',
        permanent: false,
      },
      // Direct deep-link to a specific photo (use full slug)
      {
        source: '/ig/photo/:slug',
        destination:
          '/fr/gallery/:slug?utm_source=instagram&utm_medium=social&utm_campaign=photo_link',
        permanent: false,
      },
      // Gallery shortcut
      {
        source: '/ig/gallery',
        destination:
          '/fr/gallery?utm_source=instagram&utm_medium=social&utm_campaign=gallery_link',
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Report-Only first so we never break checkout/analytics. Flip to
          // `Content-Security-Policy` (enforcing) once the report is clean.
          {
            key:
              process.env.CSP_ENFORCE === 'true'
                ? 'Content-Security-Policy'
                : 'Content-Security-Policy-Report-Only',
            value: cspDirectives,
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
