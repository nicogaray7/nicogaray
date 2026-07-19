import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from './prisma';
import { checkRate, resetRate } from './rate-limit';
import { verifyTotp } from './totp';
import { logAudit } from './audit';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import { getRelyingParty, readChallenge, clearChallenge, AUTH_CHALLENGE } from './webauthn';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'admin';
    } & DefaultSession['user'];
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  totp: z.string().optional(),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 7 },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
        totp: { label: 'Code 2FA', type: 'text' },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password, totp } = parsed.data;

        const rl = checkRate('login:' + email);
        if (!rl.allowed) {
          await logAudit('auth.rate_limited', { meta: { email } });
          return null;
        }

        const user = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });
        if (!user) {
          await logAudit('auth.login_failed', { meta: { email } });
          return null;
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
          await logAudit('auth.login_failed', { meta: { email } });
          return null;
        }

        if (user.totpEnabled) {
          if (!totp || !verifyTotp(totp, user.totpSecret!)) {
            await logAudit('auth.totp_failed', { target: user.id });
            return null;
          }
        }

        await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
        resetRate('login:' + email);
        await logAudit('auth.login', { target: user.id });

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
        };
      },
    }),
    // Connexion par cle d'acces (passkey / WebAuthn : Touch ID, Face ID...).
    Credentials({
      id: 'passkey',
      name: 'Passkey',
      credentials: { assertion: { label: 'assertion', type: 'text' } },
      async authorize(raw) {
        const assertion = typeof raw?.assertion === 'string' ? raw.assertion : null;
        if (!assertion) return null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let response: any;
        try {
          response = JSON.parse(assertion);
        } catch {
          return null;
        }

        const expectedChallenge = await readChallenge(AUTH_CHALLENGE);
        if (!expectedChallenge) return null;
        const { rpID, origin } = await getRelyingParty();

        const cred = await prisma.webAuthnCredential.findUnique({
          where: { credentialId: response.id },
          include: { adminUser: true },
        });
        if (!cred) {
          await logAudit('auth.passkey_failed', { meta: { reason: 'unknown_credential' } });
          return null;
        }

        try {
          const verification = await verifyAuthenticationResponse({
            response,
            expectedChallenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
            authenticator: {
              credentialID: isoBase64URL.toBuffer(cred.credentialId),
              credentialPublicKey: new Uint8Array(cred.publicKey),
              counter: cred.counter,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              transports: cred.transports as any,
            },
          });
          if (!verification.verified) {
            await logAudit('auth.passkey_failed', { target: cred.adminUserId });
            return null;
          }
          await prisma.webAuthnCredential.update({
            where: { id: cred.id },
            data: { counter: verification.authenticationInfo.newCounter, lastUsedAt: new Date() },
          });
          await prisma.adminUser.update({ where: { id: cred.adminUserId }, data: { lastLoginAt: new Date() } });
          await clearChallenge(AUTH_CHALLENGE);
          await logAudit('auth.passkey_login', { target: cred.adminUserId });
          return {
            id: cred.adminUser.id,
            email: cred.adminUser.email,
            name: cred.adminUser.name ?? undefined,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = 'admin';
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = 'admin';
      }
      return session;
    },
    authorized({ auth, request }) {
      const isAdmin = request.nextUrl.pathname.startsWith('/admin');
      const isLogin = request.nextUrl.pathname === '/admin/login';
      if (isAdmin && !isLogin) return !!auth?.user;
      return true;
    },
  },
});
