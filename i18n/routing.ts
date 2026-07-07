import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './config';

// Configuration de routing i18n partagee (next-intl v4).
// Utilisee par le middleware ; les helpers de navigation ne sont pas
// necessaires ici car l'app utilise des href string classiques.
export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always',
});
