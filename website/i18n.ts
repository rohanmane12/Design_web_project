import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'hi', 'mr'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  hi: 'हिन्दी',
  mr: 'मराठी',
};

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is valid
  const validLocale = (locale && locales.includes(locale as Locale))
    ? (locale as Locale)
    : 'en';

  const messages = await import(`./messages/${validLocale}.json`).then(mod => mod.default);

  return {
    locale: validLocale,
    messages,
  };
});
