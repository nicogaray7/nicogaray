'use server';
import { revalidatePath } from 'next/cache';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
} from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logAudit } from '@/lib/audit';
import {
  rpName,
  getRelyingParty,
  setChallenge,
  readChallenge,
  clearChallenge,
  REG_CHALLENGE,
  AUTH_CHALLENGE,
} from '@/lib/webauthn';

async function requireAdmin() {
  const s = await auth();
  if (!s?.user?.id) throw new Error('Unauthorized');
  return s.user;
}

// --- Enregistrement d'une nouvelle cle d'acces (admin connecte) ---
export async function beginRegistration() {
  const user = await requireAdmin();
  const { rpID } = await getRelyingParty();
  const existing = await prisma.webAuthnCredential.findMany({ where: { adminUserId: user.id } });

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: user.id,
    userName: user.email ?? user.id,
    userDisplayName: user.name ?? user.email ?? 'Admin',
    attestationType: 'none',
    excludeCredentials: existing.map((c) => ({
      id: isoBase64URL.toBuffer(c.credentialId),
      type: 'public-key' as const,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transports: c.transports as any,
    })),
    authenticatorSelection: { residentKey: 'preferred', userVerification: 'preferred' },
  });

  await setChallenge(REG_CHALLENGE, options.challenge);
  return options;
}

export async function finishRegistration(responseJSON: string, label?: string) {
  const user = await requireAdmin();
  const { rpID, origin } = await getRelyingParty();
  const expectedChallenge = await readChallenge(REG_CHALLENGE);
  if (!expectedChallenge) throw new Error('Challenge expiré, réessaie.');

  const response = JSON.parse(responseJSON);
  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });
  if (!verification.verified || !verification.registrationInfo) {
    throw new Error('Vérification de la clé échouée.');
  }

  const info = verification.registrationInfo;
  await prisma.webAuthnCredential.create({
    data: {
      credentialId: isoBase64URL.fromBuffer(info.credentialID),
      publicKey: Buffer.from(info.credentialPublicKey),
      counter: info.counter,
      transports: (response.response?.transports ?? []) as string[],
      deviceType: info.credentialDeviceType,
      backedUp: info.credentialBackedUp,
      name: label?.trim() || "Clé d'accès",
      adminUserId: user.id,
    },
  });

  await clearChallenge(REG_CHALLENGE);
  await logAudit('auth.passkey_registered', { target: user.id });
  revalidatePath('/admin/security');
}

// --- Options de connexion (appele AVANT login, sans session) ---
export async function beginAuthentication() {
  const { rpID } = await getRelyingParty();
  const options = await generateAuthenticationOptions({ rpID, userVerification: 'preferred' });
  await setChallenge(AUTH_CHALLENGE, options.challenge);
  return options;
}

export async function deletePasskey(id: string) {
  const user = await requireAdmin();
  await prisma.webAuthnCredential.deleteMany({ where: { id, adminUserId: user.id } });
  await logAudit('auth.passkey_removed', { target: user.id, meta: { id } });
  revalidatePath('/admin/security');
}
