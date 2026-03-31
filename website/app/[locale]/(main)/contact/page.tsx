'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { Locale } from '@/i18n';

export default function ContactPage() {
  const t = useTranslations();
  const params = useParams();
  const currentLocale = (params.locale as Locale) || 'en';

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-[#004B87] to-[#0066CC] text-white py-16">
        <div className="max-w-7xl mx-auto px-5">
          <h1 className="text-4xl font-bold mb-4">{t('contact.title')}</h1>
          <p className="text-xl opacity-90">{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white border border-[#DDDDDD] rounded-lg p-6 text-center transition-all hover:shadow-lg hover:border-[#0066CC]">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2 text-[#1A1A1A]">{t('contact.address')}</h3>
              <p className="text-gray-600">Mumbai, Maharashtra, India</p>
            </div>

            <div className="bg-white border border-[#DDDDDD] rounded-lg p-6 text-center transition-all hover:shadow-lg hover:border-[#0066CC]">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold mb-2 text-[#1A1A1A]">{t('contact.phone')}</h3>
              <p className="text-gray-600">+91 77098 31071</p>
            </div>

            <div className="bg-white border border-[#DDDDDD] rounded-lg p-6 text-center transition-all hover:shadow-lg hover:border-[#0066CC]">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold mb-2 text-[#1A1A1A]">{t('contact.email')}</h3>
              <p className="text-gray-600">info@designconcept.com</p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href={`/${currentLocale}/request-quote`}
              className="bg-[#FF6600] text-white px-8 py-3.5 rounded font-semibold hover:bg-[#E55C00] transition-colors no-underline inline-flex items-center gap-2"
            >
              {t('contact.sendEnquiry')}
              <Send className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
