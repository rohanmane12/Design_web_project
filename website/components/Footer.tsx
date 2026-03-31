import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Locale } from '@/i18n';

interface FooterProps {
  locale: Locale;
}

export default async function Footer({ locale }: FooterProps) {
  const t = await getTranslations();

  const quickLinks = [
    { href: '/home', label: t('common.home') },
    { href: '/services', label: t('common.services') },
    { href: '/about', label: t('common.about') },
    { href: '/contact', label: t('common.contact') },
  ];

  return (
    <footer className="bg-[#333333] text-white py-12">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-xl font-bold">Design Concept</span>
            </div>
            <p className="text-[#999] text-sm leading-6">
              Professional printing and design solutions for businesses and individuals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={`/${locale}${link.href}`} className="text-[#999] text-sm no-underline hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/services?category=personal`} className="text-[#999] text-sm no-underline hover:text-white transition-colors">
                  Personal Designs
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services?category=acrylic`} className="text-[#999] text-sm no-underline hover:text-white transition-colors">
                  Acrylic Name Plates
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services?category=led`} className="text-[#999] text-sm no-underline hover:text-white transition-colors">
                  LED Signages
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services?category=stickers`} className="text-[#999] text-sm no-underline hover:text-white transition-colors">
                  Stickers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="border-t border-[#444] pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
              <span className="text-sm text-[#999]">Mumbai, Maharashtra, India</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-[#999]">+91 77098 31071</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-[#999]">info@designconcept.com</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#444] pt-6 text-center">
          <p className="text-[#999] text-sm">&copy; {new Date().getFullYear()} Design Concept. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
