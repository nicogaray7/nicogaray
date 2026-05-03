import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// next-intl v4 compatible (exported as middleware for App Router i18n)
const intlMiddleware = createMiddleware(routing)
export default intlMiddleware

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|admin|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
