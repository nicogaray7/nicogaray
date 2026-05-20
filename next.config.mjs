import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

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
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
