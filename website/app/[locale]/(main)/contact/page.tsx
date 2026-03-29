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
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">{t('contact.title')}</h1>
          <p className="hero-subtitle">{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="card text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2">{t('contact.address')}</h3>
              <p className="text-gray-600">Mumbai, Maharashtra, India</p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold mb-2">{t('contact.phone')}</h3>
              <p className="text-gray-600">+91 77098 31071</p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold mb-2">{t('contact.email')}</h3>
              <p className="text-gray-600">info@designconcept.com</p>
            </div>
          </div>

          <div className="text-center">
            <Link href={`/${currentLocale}/request-quote`} className="btn btn-primary">
              {t('contact.sendEnquiry')}
              <Send className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
