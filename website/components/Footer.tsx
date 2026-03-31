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
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">D</span>
                </div>
                <span className="text-xl font-bold">Design Concept</span>
              </div>
            </div>
            <p className="footer-text">
              Professional printing and design solutions for businesses and individuals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">{t('footer.quickLinks')}</h4>
            <ul className="footer-links">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={`/${locale}${link.href}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              <li><Link href={`/${locale}/services?category=personal`}>Personal Designs</Link></li>
              <li><Link href={`/${locale}/services?category=acrylic`}>Acrylic Name Plates</Link></li>
              <li><Link href={`/${locale}/services?category=led`}>LED Signages</Link></li>
              <li><Link href={`/${locale}/services?category=stickers`}>Stickers</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-heading">{t('footer.contact')}</h4>
            <ul className="footer-links space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
                <span className="text-sm">Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-500" />
                <span className="text-sm">+91 77098 31071</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                <span className="text-sm">info@designconcept.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Design Concept. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
