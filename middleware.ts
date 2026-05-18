import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always',
});

export const config = {
  matcher: ['/((?!api|admin|_next|_vercel|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'],
};
