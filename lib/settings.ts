import { prisma } from './prisma';

export interface BilingualText {
  fr?: string;
  en?: string;
}

export interface HomeSettings {
  subtitle?: BilingualText;
  cta?: BilingualText;
}

export interface AboutSettings {
  title?: BilingualText;
  lede?: BilingualText;
  body?: BilingualText;
}

export interface LegalPage {
  title?: BilingualText;
  body?: BilingualText;
}

export interface LegalSettings {
  cgv?: LegalPage;
  license?: LegalPage;
  mentions?: LegalPage;
}

export const SETTING_KEYS = {
  home: 'home',
  about: 'about',
  legal: 'legal',
} as const;

export async function getSetting<T>(key: string): Promise<T | null> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key } });
    return (row?.value as T) ?? null;
  } catch {
    return null;
  }
}

export async function setSetting(key: string, value: unknown) {
  return prisma.siteSetting.upsert({
    where: { key },
    create: { key, value: value as object },
    update: { value: value as object },
  });
}

export function pickText(field: BilingualText | undefined, locale: string, fallback: string): string {
  if (!field) return fallback;
  const v = locale === 'en' ? field.en : field.fr;
  return v && v.trim().length > 0 ? v : fallback;
}
