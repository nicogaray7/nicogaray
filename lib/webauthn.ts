import { headers, cookies } from 'next/headers';

export const rpName = 'Nico Garay Admin';

// Domaine (rpID) et origine derives de la requete : marche en preview
// (vg.nicogaray.com) comme en prod (photos.nicogaray.com) sans config.
export async function getRelyingParty(): Promise<{ rpID: string; origin: string }> {
  const h = await headers();
  const host = (h.get('host') ?? 'photos.nicogaray.com').split(':')[0];
  const rawHost = h.get('host') ?? 'photos.nicogaray.com';
  const proto = h.get('x-forwarded-proto') ?? 'https';
  return { rpID: host, origin: `${proto}://${rawHost}` };
}

const CHAL_OPTS = {
  httpOnly: true as const,
  secure: true as const,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 300, // 5 min
};

export async function setChallenge(key: string, value: string): Promise<void> {
  (await cookies()).set(key, value, CHAL_OPTS);
}

export async function readChallenge(key: string): Promise<string | undefined> {
  return (await cookies()).get(key)?.value;
}

export async function clearChallenge(key: string): Promise<void> {
  (await cookies()).delete(key);
}

export const REG_CHALLENGE = 'wa_reg_chal';
export const AUTH_CHALLENGE = 'wa_auth_chal';
