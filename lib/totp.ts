import { generateSecret, generateURI, verifySync } from 'otplib';

export function generateTotpSecret(): string {
  return generateSecret();
}

export function totpKeyUri(email: string, secret: string): string {
  return generateURI({ issuer: 'Nico Garay Admin', label: email, secret });
}

export function verifyTotp(token: string, secret: string): boolean {
  try {
    const result = verifySync({ token, secret });
    return result.valid;
  } catch {
    return false;
  }
}
