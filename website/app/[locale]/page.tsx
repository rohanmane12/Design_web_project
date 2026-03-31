import { redirect } from 'next/navigation';
import type { Locale } from '@/i18n';

export default async function LocaleIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale as Locale}/home`);
}
