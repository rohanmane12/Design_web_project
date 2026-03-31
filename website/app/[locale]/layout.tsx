import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales, Locale } from '@/i18n';
import Footer from '@/components/Footer';
import LocaleChrome from '@/components/LocaleChrome';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider messages={messages} locale={locale} timeZone="Asia/Kolkata">
      <LocaleChrome footer={<Footer locale={locale as Locale} />}>
        {children}
      </LocaleChrome>
    </NextIntlClientProvider>
  );
}
