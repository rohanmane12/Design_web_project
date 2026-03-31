'use client';

import Header from '@/components/Header';
import { usePathname } from 'next/navigation';

interface LocaleChromeProps {
  children: React.ReactNode;
  footer: React.ReactNode;
}

export default function LocaleChrome({ children, footer }: LocaleChromeProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.includes('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      {footer}
    </div>
  );
}
