'use client';

import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations();

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-[#004B87] to-[#0066CC] text-white py-16">
        <div className="max-w-7xl mx-auto px-5">
          <h1 className="text-4xl font-bold mb-4">{t('about.title')}</h1>
          <p className="text-xl opacity-90">{t('about.subtitle')}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5">
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-8">{t('about.intro')}</p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-[#DDDDDD] rounded-lg p-6 transition-all hover:shadow-lg hover:border-[#0066CC]">
                <h2 className="text-xl font-bold mb-3 text-[#1A1A1A]">{t('about.mission')}</h2>
                <p className="text-gray-600">{t('about.missionDesc')}</p>
              </div>
              <div className="bg-white border border-[#DDDDDD] rounded-lg p-6 transition-all hover:shadow-lg hover:border-[#0066CC]">
                <h2 className="text-xl font-bold mb-3 text-[#1A1A1A]">{t('about.vision')}</h2>
                <p className="text-gray-600">{t('about.visionDesc')}</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-[#1A1A1A]">{t('about.values.title')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-[#DDDDDD] rounded-lg p-6 transition-all hover:shadow-lg hover:border-[#0066CC]">
                <h3 className="font-bold mb-2 text-[#1A1A1A]">{t('about.values.quality')}</h3>
                <p className="text-gray-600 text-sm">{t('about.values.qualityDesc')}</p>
              </div>
              <div className="bg-white border border-[#DDDDDD] rounded-lg p-6 transition-all hover:shadow-lg hover:border-[#0066CC]">
                <h3 className="font-bold mb-2 text-[#1A1A1A]">{t('about.values.innovation')}</h3>
                <p className="text-gray-600 text-sm">{t('about.values.innovationDesc')}</p>
              </div>
              <div className="bg-white border border-[#DDDDDD] rounded-lg p-6 transition-all hover:shadow-lg hover:border-[#0066CC]">
                <h3 className="font-bold mb-2 text-[#1A1A1A]">{t('about.values.customerFirst')}</h3>
                <p className="text-gray-600 text-sm">{t('about.values.customerFirstDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
