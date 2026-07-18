'use server';

import { revalidatePath } from 'next/cache';
import QRCode from 'qrcode';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logAudit } from '@/lib/audit';
import { generateTotpSecret, totpKeyUri, verifyTotp } from '@/lib/totp';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email) throw new Error('Unauthorized');
  return session;
}

export async function startTotpSetup(): Promise<{ secret: string; otpauth: string; qr: string }> {
  const session = await requireAdmin();
  const secret = generateTotpSecret();
  const otpauth = totpKeyUri(session.user.email!, secret);
  const qr = await QRCode.toDataURL(otpauth);
  return { secret, otpauth, qr };
}

export async function enableTotp(secret: string, code: string): Promise<void> {
  const session = await requireAdmin();
  if (!verifyTotp(code, secret)) {
    throw new Error('Code 2FA invalide');
  }
  await prisma.adminUser.update({
    where: { email: session.user.email! },
    data: { totpSecret: secret, totpEnabled: true },
  });
  await logAudit('auth.totp_enabled');
  revalidatePath('/admin/security');
}

export async function disableTotp(code: string): Promise<void> {
  const session = await requireAdmin();
  const user = await prisma.adminUser.findUnique({ where: { email: session.user.email! } });
  if (!user) throw new Error('Utilisateur introuvable');
  if (user.totpEnabled && !verifyTotp(code, user.totpSecret!)) {
    throw new Error('Code 2FA invalide');
  }
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { totpEnabled: false, totpSecret: null },
  });
  await logAudit('auth.totp_disabled');
  revalidatePath('/admin/security');
}
