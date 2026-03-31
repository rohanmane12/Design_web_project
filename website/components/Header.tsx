'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { locales, localeNames, Locale } from '@/i18n';

export default function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Extract current locale from pathname
  const currentLocale = (pathname.split('/')[1] as Locale) || 'en';

  // Get the path without the locale prefix
  const pathWithoutLocale = pathname.replace(/^\/(en|hi|mr)/, '') || '/home';

  const navItems = [
    { href: '/home', label: t('common.home') },
    { href: '/services', label: t('common.services') },
    { href: '/about', label: t('common.about') },
    { href: '/contact', label: t('common.contact') },
  ];

  const changeLanguage = (newLocale: Locale) => {
    // Navigate to the same page but with new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-5 h-[70px] flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href={`/${currentLocale}/home`} className="flex items-center gap-3 text-[#004B87] text-2xl font-bold no-underline">
          <div className="w-10 h-10 bg-[#004B87] text-white rounded-lg flex items-center justify-center font-bold text-xl">
            D
          </div>
          <span>Design Concept</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={`/${currentLocale}${item.href}`}
              className={`text-[#1A1A1A] font-medium text-[0.9375rem] transition-colors hover:text-[#0066CC] no-underline ${
                pathname.includes(item.href) ? 'text-blue-600' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Language Selector - Desktop */}
          <div className="flex items-center gap-2">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => changeLanguage(locale)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  locale === currentLocale
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {localeNames[locale]}
              </button>
            ))}
          </div>

          {/* CTA */}
          <Link
            href={`/${currentLocale}/request-quote`}
            className="bg-[#FF6600] text-white px-5 py-2.5 rounded font-semibold hover:bg-[#E55C00] transition-colors no-underline"
          >
            {t('common.enquiry')}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-5 py-4">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={`/${currentLocale}${item.href}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-[#1A1A1A] no-underline ${
                    pathname.includes(item.href) ? 'text-blue-600 font-medium' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href={`/${currentLocale}/request-quote`}
                onClick={() => setMobileMenuOpen(false)}
                className="bg-[#FF6600] text-white px-5 py-2.5 rounded font-semibold hover:bg-[#E55C00] transition-colors no-underline text-center"
              >
                {t('common.enquiry')}
              </Link>

              {/* Mobile Language Selector */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-3">Select Language / भाषा चुनें / भाषा निवडा</p>
                <div className="flex gap-2 flex-wrap">
                  {locales.map((locale) => (
                    <button
                      key={locale}
                      onClick={() => {
                        changeLanguage(locale);
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        locale === currentLocale
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {localeNames[locale]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
