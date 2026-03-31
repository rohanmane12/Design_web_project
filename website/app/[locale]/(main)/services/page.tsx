'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Locale } from '@/i18n';

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const params = useParams();
  const currentLocale = (params.locale as Locale) || 'en';

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'personal', label: 'Personal Designs' },
    { id: 'acrylic', label: 'Acrylic Name Plates' },
    { id: 'led', label: 'LED Signages' },
    { id: 'standees', label: 'Standees' },
    { id: 'stickers', label: 'Stickers' },
    { id: 'hoardings', label: 'Hoardings' },
    { id: 'banners', label: 'Banners' },
  ];

  const services = [
    { id: 1, category: 'personal', title: 'Personal Designs', description: 'Custom designs for personal occasions' },
    { id: 2, category: 'acrylic', title: 'Acrylic Name Plates', description: 'Premium quality name plates for homes and offices' },
    { id: 3, category: 'led', title: 'LED Signages', description: 'Eye-catching LED displays for businesses' },
    { id: 4, category: 'standees', title: 'Standees', description: 'Portable display solutions for events' },
    { id: 5, category: 'stickers', title: 'Custom Stickers', description: 'High-quality stickers for branding' },
    { id: 6, category: 'hoardings', title: 'Large Hoardings', description: 'Big format outdoor advertising' },
    { id: 7, category: 'banners', title: 'Banners', description: 'Promotional banners and branchers' },
  ];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#004B87] to-[#0066CC] text-white py-16">
        <div className="max-w-7xl mx-auto px-5">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl opacity-90">Professional printing solutions for every need</p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-[70px] z-40 bg-white border-b border-[#DDDDDD] py-4">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 border border-[#DDDDDD] bg-white rounded-full text-sm font-medium whitespace-nowrap transition-colors hover:border-[#004B87] ${
                  selectedCategory === cat.id
                    ? 'bg-[#004B87] text-white border-[#004B87]'
                    : ''
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Link
                key={service.id}
                href={`/${currentLocale}/request-quote`}
                className="bg-white border border-[#DDDDDD] rounded-lg p-6 transition-all hover:shadow-lg hover:border-[#0066CC] no-underline"
              >
                <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                <span className="text-[#0066CC] font-medium inline-flex items-center gap-1 no-underline">
                  Request Quote <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
