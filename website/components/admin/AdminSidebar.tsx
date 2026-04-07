'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import {
  ChevronRight,
  ExternalLink,
  Image,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Package,
  PanelLeftClose,
  Settings,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/services', label: 'Services', icon: Package },
  { href: '/admin/portfolio', label: 'Portfolio', icon: Image },
  { href: '/admin/enquiries', label: 'Enquiries', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : 'en';
  const [mobileOpen, setMobileOpen] = useState(false);

  const withLocale = (href: string) => `/${locale}${href}`;
  const currentSection = navItems.find((item) => {
    const localizedHref = withLocale(item.href);
    return pathname === localizedHref || pathname.startsWith(`${localizedHref}/`);
  });

  const handleLogout = async () => {
    await signOut({ callbackUrl: withLocale('/admin/login') });
  };

  return (
    <div className="min-h-screen bg-[#f3f6fb] text-[#1A1A1A]">
      <div className="sticky top-0 z-40 border-b border-[#d8e2ee] bg-white/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6a7b91]">Admin Workspace</p>
            <h1 className="text-lg font-bold text-[#004B87]">{currentSection?.label || 'Admin'}</h1>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-xl border border-[#d8e2ee] p-2 text-[#004B87]"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <PanelLeftClose className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-30 bg-[#0f172a]/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-[290px] flex-col border-r border-[#d8e2ee] bg-[#fbfdff] transition-transform duration-200 lg:sticky lg:top-0 lg:translate-x-0 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="border-b border-[#d8e2ee] px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#004B87] text-lg font-bold text-white shadow-[0_12px_30px_rgba(0,75,135,0.22)]">
                D
              </div>
              <div>
                <h2 className="font-bold text-[#12314f]">Design Concept</h2>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#6a7b91]">Control Room</p>
              </div>
            </div>
          </div>

          <div className="px-4 pt-5">
            <div className="rounded-3xl border border-[#d8e2ee] bg-[linear-gradient(145deg,#004B87,#0b65b4)] p-5 text-white shadow-[0_16px_40px_rgba(0,75,135,0.18)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Workspace</p>
              <h3 className="mt-2 text-xl font-bold">Site operations</h3>
              <p className="mt-2 text-sm text-white/80">Manage services, portfolio entries, and incoming enquiries from one place.</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const localizedHref = withLocale(item.href);
              const isActive = pathname === localizedHref || pathname.startsWith(`${localizedHref}/`);

              return (
                <Link
                  key={item.href}
                  href={localizedHref}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 no-underline transition-all ${
                    isActive
                      ? 'bg-[#e7f1fb] text-[#004B87] shadow-[inset_0_0_0_1px_rgba(0,75,135,0.08)]'
                      : 'text-[#51657c] hover:bg-white hover:text-[#12314f]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl p-2 ${isActive ? 'bg-white text-[#004B87]' : 'bg-[#eef3f8] text-[#6a7b91]'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-3 border-t border-[#d8e2ee] px-4 py-4">
            <Link
              href={withLocale('/home')}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-[#51657c] no-underline transition-colors hover:bg-white hover:text-[#12314f]"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="font-medium">Back to website</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[#b42318] transition-colors hover:bg-[#fff1ef]"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="hidden border-b border-[#d8e2ee] bg-white/90 px-8 py-5 backdrop-blur lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6a7b91]">Admin Workspace</p>
            <div className="mt-1 flex items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#12314f]">{currentSection?.label || 'Admin'}</h1>
                <p className="text-sm text-[#6a7b91]">Operations dashboard for the Design Concept website.</p>
              </div>
              <Link
                href={withLocale('/home')}
                className="inline-flex items-center gap-2 rounded-full border border-[#d8e2ee] px-4 py-2 text-sm font-medium text-[#12314f] no-underline transition-colors hover:bg-[#f6f9fc]"
              >
                Open website
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="pb-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
