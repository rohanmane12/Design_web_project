'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Skip auth check on login page
    if (pathname?.endsWith('/admin/login')) {
      setLoading(false);
      return;
    }

    // Check authentication
    fetch('/api/admin/verify')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not authenticated');
      })
      .then(() => {
        setAuthenticated(true);
        setLoading(false);
      })
      .catch(() => {
        router.push('/en/admin/login');
      });
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <AdminSidebar>{children}</AdminSidebar>;
}
