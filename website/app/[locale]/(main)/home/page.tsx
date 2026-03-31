'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowRight, Star, Truck, Palette, Headphones } from 'lucide-react';
import { Locale } from '@/i18n';

export default function HomePage() {
  const t = useTranslations();
  const params = useParams();
  const currentLocale = (params.locale as Locale) || 'en';

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#004B87] to-[#0066CC] text-white py-16">
        <div className="max-w-7xl mx-auto px-5">
          <div className="max-w-[800px] mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl opacity-90 mb-8">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/en/services"
                className="bg-[#FF6600] text-white px-8 py-3.5 rounded font-semibold hover:bg-[#E55C00] transition-colors no-underline inline-flex items-center gap-2"
              >
                {t('home.hero.cta')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href={`/${currentLocale}/request-quote`}
                className="bg-white text-[#004B87] px-8 py-3.5 rounded font-semibold hover:bg-[#F5F5F5] transition-colors no-underline"
              >
                {t('common.enquiry')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-3xl font-bold text-center mb-3">{t('home.featured.title')}</h2>
          <p className="text-center text-gray-600 text-lg mb-12">{t('home.featured.description')}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/en/services?category=personal" className="bg-white border border-[#DDDDDD] rounded-lg p-6 transition-all hover:shadow-lg hover:border-[#0066CC] no-underline">
              <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">Personal Designs</h3>
              <p className="text-gray-600 text-sm mb-4">Custom designs for personal occasions</p>
              <span className="text-[#0066CC] font-medium inline-flex items-center gap-1 no-underline">
                {t('product.viewDetails')} <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link href="/en/services?category=acrylic" className="bg-white border border-[#DDDDDD] rounded-lg p-6 transition-all hover:shadow-lg hover:border-[#0066CC] no-underline">
              <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">Acrylic Name Plates</h3>
              <p className="text-gray-600 text-sm mb-4">Premium quality name plates</p>
              <span className="text-[#0066CC] font-medium inline-flex items-center gap-1 no-underline">
                {t('product.viewDetails')} <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link href="/en/services?category=led" className="bg-white border border-[#DDDDDD] rounded-lg p-6 transition-all hover:shadow-lg hover:border-[#0066CC] no-underline">
              <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">LED Signages</h3>
              <p className="text-gray-600 text-sm mb-4">Eye-catching LED displays</p>
              <span className="text-[#0066CC] font-medium inline-flex items-center gap-1 no-underline">
                {t('product.viewDetails')} <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link href="/en/services?category=standees" className="bg-white border border-[#DDDDDD] rounded-lg p-6 transition-all hover:shadow-lg hover:border-[#0066CC] no-underline">
              <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">Standees</h3>
              <p className="text-gray-600 text-sm mb-4">Portable display solutions</p>
              <span className="text-[#0066CC] font-medium inline-flex items-center gap-1 no-underline">
                {t('product.viewDetails')} <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link href="/en/services?category=stickers" className="bg-white border border-[#DDDDDD] rounded-lg p-6 transition-all hover:shadow-lg hover:border-[#0066CC] no-underline">
              <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">Stickers</h3>
              <p className="text-gray-600 text-sm mb-4">Custom stickers of all types</p>
              <span className="text-[#0066CC] font-medium inline-flex items-center gap-1 no-underline">
                {t('product.viewDetails')} <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link href="/en/services?category=hoardings" className="bg-white border border-[#DDDDDD] rounded-lg p-6 transition-all hover:shadow-lg hover:border-[#0066CC] no-underline">
              <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">Hoardings</h3>
              <p className="text-gray-600 text-sm mb-4">Large format outdoor advertising</p>
              <span className="text-[#0066CC] font-medium inline-flex items-center gap-1 no-underline">
                {t('product.viewDetails')} <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link href="/en/services?category=banners" className="bg-white border border-[#DDDDDD] rounded-lg p-6 transition-all hover:shadow-lg hover:border-[#0066CC] no-underline">
              <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">Banners</h3>
              <p className="text-gray-600 text-sm mb-4">Promotional banners and branchers</p>
              <span className="text-[#0066CC] font-medium inline-flex items-center gap-1 no-underline">
                {t('product.viewDetails')} <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-3xl font-bold text-center mb-3">{t('home.whyUs.title')}</h2>
          <p className="text-center text-gray-600 text-lg mb-12">We provide the best service for your business</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F5] rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-[#004B87]" />
              </div>
              <h3 className="font-semibold mb-2">{t('home.whyUs.quality')}</h3>
              <p className="text-gray-600 text-sm">{t('home.whyUs.qualityDesc')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F5] rounded-full flex items-center justify-center">
                <Truck className="w-8 h-8 text-[#004B87]" />
              </div>
              <h3 className="font-semibold mb-2">{t('home.whyUs.fastDelivery')}</h3>
              <p className="text-gray-600 text-sm">{t('home.whyUs.fastDeliveryDesc')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F5] rounded-full flex items-center justify-center">
                <Palette className="w-8 h-8 text-[#004B87]" />
              </div>
              <h3 className="font-semibold mb-2">{t('home.whyUs.customDesign')}</h3>
              <p className="text-gray-600 text-sm">{t('home.whyUs.customDesignDesc')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F5] rounded-full flex items-center justify-center">
                <Headphones className="w-8 h-8 text-[#004B87]" />
              </div>
              <h3 className="font-semibold mb-2">{t('home.whyUs.support')}</h3>
              <p className="text-gray-600 text-sm">{t('home.whyUs.supportDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#004B87] to-[#0066CC] text-white py-16">
        <div className="max-w-7xl mx-auto px-5">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl opacity-90 mb-8">
              Contact us today for a custom quote on your printing and design needs.
            </p>
            <Link
              href={`/${currentLocale}/request-quote`}
              className="bg-white text-[#004B87] px-8 py-3.5 rounded font-semibold hover:bg-[#F5F5F5] transition-colors no-underline inline-flex items-center gap-2"
            >
              {t('common.enquiry')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
