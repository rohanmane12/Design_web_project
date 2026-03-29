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
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Our Services</h1>
          <p className="hero-subtitle">Professional printing solutions for every need</p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="container">
          <div className="filter-list">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {filteredServices.map((service) => (
              <Link
                key={service.id}
                href={`/${currentLocale}/request-quote`}
                className="card"
              >
                <h3 className="card-title">{service.title}</h3>
                <p className="card-description">{service.description}</p>
                <span className="card-link">
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
