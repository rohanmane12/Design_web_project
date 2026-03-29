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
    <header className="header">
      <nav className="container header-nav">
        {/* Logo */}
        <Link href={`/${currentLocale}/home`} className="header-logo">
          <div className="header-logo-icon">D</div>
          <span>Design Concept</span>
        </Link>

        {/* Desktop Menu */}
        <div className="header-menu">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={`/${currentLocale}${item.href}`}
              className={pathname.includes(item.href) ? 'text-blue-600' : ''}
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
          <Link href={`/${currentLocale}/request-quote`} className="header-cta">
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
          <div className="container py-4">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={`/${currentLocale}${item.href}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={pathname.includes(item.href) ? 'text-blue-600 font-medium' : ''}
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href={`/${currentLocale}/request-quote`}
                onClick={() => setMobileMenuOpen(false)}
                className="header-cta text-center"
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
