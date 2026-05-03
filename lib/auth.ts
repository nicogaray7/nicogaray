import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import crypto from 'crypto'

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + process.env.AUTH_SECRET).digest('hex')
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null

        const adminEmail = process.env.AUTH_ADMIN_EMAIL
        const adminPassword = process.env.AUTH_ADMIN_PASSWORD

        if (
          credentials.email === adminEmail &&
          hashPassword(credentials.password) === hashPassword(adminPassword ?? '')
        ) {
          return { id: '1', email: adminEmail, name: 'Admin' }
        }

        return null
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.AUTH_SECRET,
}
