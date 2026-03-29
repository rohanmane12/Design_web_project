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
      <section className="hero">
        <div className="container hero-content">
          <h1 className="hero-title">
            {t('home.hero.title')}
          </h1>
          <p className="hero-subtitle">
            {t('home.hero.subtitle')}
          </p>
          <div className="hero-buttons">
            <Link href="/en/services" className="btn btn-primary">
              {t('home.hero.cta')}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href={`/${currentLocale}/request-quote`} className="btn btn-secondary">
              {t('common.enquiry')}
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">{t('home.featured.title')}</h2>
          <p className="section-subtitle">{t('home.featured.description')}</p>

          <div className="grid grid-3">
            <Link href="/en/services?category=personal" className="card">
              <h3 className="card-title">Personal Designs</h3>
              <p className="card-description">Custom designs for personal occasions</p>
              <span className="card-link">{t('product.viewDetails')} <ArrowRight className="w-4 h-4" /></span>
            </Link>

            <Link href="/en/services?category=acrylic" className="card">
              <h3 className="card-title">Acrylic Name Plates</h3>
              <p className="card-description">Premium quality name plates</p>
              <span className="card-link">{t('product.viewDetails')} <ArrowRight className="w-4 h-4" /></span>
            </Link>

            <Link href="/en/services?category=led" className="card">
              <h3 className="card-title">LED Signages</h3>
              <p className="card-description">Eye-catching LED displays</p>
              <span className="card-link">{t('product.viewDetails')} <ArrowRight className="w-4 h-4" /></span>
            </Link>

            <Link href="/en/services?category=standees" className="card">
              <h3 className="card-title">Standees</h3>
              <p className="card-description">Portable display solutions</p>
              <span className="card-link">{t('product.viewDetails')} <ArrowRight className="w-4 h-4" /></span>
            </Link>

            <Link href="/en/services?category=stickers" className="card">
              <h3 className="card-title">Stickers</h3>
              <p className="card-description">Custom stickers of all types</p>
              <span className="card-link">{t('product.viewDetails')} <ArrowRight className="w-4 h-4" /></span>
            </Link>

            <Link href="/en/services?category=hoardings" className="card">
              <h3 className="card-title">Hoardings</h3>
              <p className="card-description">Large format outdoor advertising</p>
              <span className="card-link">{t('product.viewDetails')} <ArrowRight className="w-4 h-4" /></span>
            </Link>

            <Link href="/en/services?category=banners" className="card">
              <h3 className="card-title">Banners</h3>
              <p className="card-description">Promotional banners and branchers</p>
              <span className="card-link">{t('product.viewDetails')} <ArrowRight className="w-4 h-4" /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section section-gray">
        <div className="container">
          <h2 className="section-title">{t('home.whyUs.title')}</h2>
          <p className="section-subtitle">We provide the best service for your business</p>

          <div className="features">
            <div className="feature">
              <div className="feature-icon">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="feature-title">{t('home.whyUs.quality')}</h3>
              <p className="feature-description">{t('home.whyUs.qualityDesc')}</p>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="feature-title">{t('home.whyUs.fastDelivery')}</h3>
              <p className="feature-description">{t('home.whyUs.fastDeliveryDesc')}</p>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <Palette className="w-8 h-8" />
              </div>
              <h3 className="feature-title">{t('home.whyUs.customDesign')}</h3>
              <p className="feature-description">{t('home.whyUs.customDesignDesc')}</p>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <Headphones className="w-8 h-8" />
              </div>
              <h3 className="feature-title">{t('home.whyUs.support')}</h3>
              <p className="feature-description">{t('home.whyUs.supportDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero">
        <div className="container hero-content">
          <h2 className="hero-title">Ready to Get Started?</h2>
          <p className="hero-subtitle">
            Contact us today for a custom quote on your printing and design needs.
          </p>
          <Link href={`/${currentLocale}/request-quote`} className="btn btn-secondary">
            {t('common.enquiry')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
