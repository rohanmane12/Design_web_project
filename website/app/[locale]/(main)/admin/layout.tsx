'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : 'en';
  const [status, setStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  const isAuthPage = pathname?.includes('/admin/login') || pathname?.includes('/admin/signup');

  useEffect(() => {
    if (isAuthPage) {
      return;
    }

    let active = true;

    fetch('/api/admin/verify')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not authenticated');
      })
      .then(() => {
        if (active) {
          setStatus('authenticated');
        }
      })
      .catch(() => {
        if (active) {
          setStatus('unauthenticated');
        }
        router.replace(`/${locale}/admin/login`);
      });

    return () => {
      active = false;
    };
  }, [isAuthPage, locale, router]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (status === 'checking') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return null;
  }

  return <AdminSidebar>{children}</AdminSidebar>;
}
