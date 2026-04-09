'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.includes('/admin/login') || pathname?.includes('/admin/signup');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <AdminSidebar>{children}</AdminSidebar>;
}
