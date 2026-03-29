'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Send,
  Upload,
  FileText,
  X,
  CheckCircle,
  Clock3,
  ShieldCheck,
  BadgeDollarSign,
  Mail,
  PhoneCall,
} from 'lucide-react';
import { Locale } from '@/i18n';

export default function EnquiryPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const currentLocale = (params.locale as Locale) || 'en';
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    size: '',
    material: '',
    quantity: '1',
    notes: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t('validation.required');
    if (!formData.phone.trim()) newErrors.phone = t('validation.required');
    if (!formData.email.trim()) {
      newErrors.email = t('validation.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.invalidEmail');
    }
    if (!formData.service) newErrors.service = t('validation.required');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);

    const message = `
*New Enquiry*
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Service: ${formData.service}
Size: ${formData.size}
Material: ${formData.material}
Quantity: ${formData.quantity}
Notes: ${formData.notes}
    `.trim();

    setTimeout(() => {
      window.open(`https://wa.me/917709831071?text=${encodeURIComponent(message)}`, '_blank');
      router.push(`/${currentLocale}/home`);
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setErrors(prev => ({ ...prev, file: t('validation.invalidFileType') }));
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, file: t('validation.fileTooLarge') }));
        return;
      }
      setFile(selectedFile);
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const services = [
    { value: '', label: t('enquiry.selectProduct') },
    { value: 'personal', label: t('services.categories.personal') },
    { value: 'acrylic', label: t('services.categories.acrylic') },
    { value: 'led', label: t('services.categories.led') },
    { value: 'standees', label: t('services.categories.standees') },
    { value: 'stickers', label: t('services.categories.stickers') },
    { value: 'hoardings', label: t('services.categories.hoardings') },
    { value: 'banners', label: t('services.categories.banners') },
  ];

  if (submitted) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('enquiry.submitSuccess')}</h2>
          <p className="text-gray-600 mb-6">{t('enquiry.whatsappRedirect')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      {/* Main Container - Using Tailwind only */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Layout: 5 columns total, left gets 3, right gets 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          
          {/* Left Section - Form (col-span-3) */}
          <div className="lg:col-span-3">
            {/* Mobile Header */}
            <div className="mb-6 lg:hidden">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('enquiry.title')}</h1>
              <p className="text-gray-600">{t('enquiry.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Form Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                
                {/* Personal Information Section */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    {t('enquiry.personalInfo')}
                  </h2>

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('enquiry.name')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                          errors.name
                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                            : 'border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                        }`}
                        placeholder={t('enquiry.namePlaceholder')}
                      />
                      {errors.name && (
                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/>
                          </svg>
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Phone & Email - Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('enquiry.phone')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                            errors.phone
                              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                              : 'border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                          }`}
                          placeholder={t('enquiry.phonePlaceholder')}
                        />
                        {errors.phone && (
                          <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/>
                            </svg>
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('enquiry.email')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                            errors.email
                              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                              : 'border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                          }`}
                          placeholder={t('enquiry.emailPlaceholder')}
                        />
                        {errors.email && (
                          <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/>
                            </svg>
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customization Details Section */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    {t('enquiry.customization')}
                  </h2>

                  <div className="space-y-4">
                    {/* Service Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('enquiry.selectProduct')} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all appearance-none bg-white ${
                          errors.service
                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                            : 'border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                        }`}
                      >
                        {services.map((service) => (
                          <option key={service.value} value={service.value}>
                            {service.label}
                          </option>
                        ))}
                      </select>
                      {errors.service && (
                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/>
                          </svg>
                          {errors.service}
                        </p>
                      )}
                    </div>

                    {/* Size & Material - Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('enquiry.size')}
                        </label>
                        <input
                          type="text"
                          value={formData.size}
                          onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                          placeholder="A4, A3, Custom"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('enquiry.material')}
                        </label>
                        <input
                          type="text"
                          value={formData.material}
                          onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                          placeholder="Matte, Glossy"
                        />
                      </div>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('enquiry.quantity')}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('enquiry.notes')}
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                        placeholder={t('enquiry.notesPlaceholder')}
                      />
                    </div>
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </span>
                    {t('enquiry.uploadDesign')}
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-3">
                      {t('enquiry.uploadDesignDesc')}
                    </label>

                    {!file ? (
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                            <Upload className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">
                            Drag & drop your file here, or click to browse
                          </p>
                          <p className="text-xs text-gray-500">PDF only, max 10MB</p>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between p-4 border-2 border-blue-200 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                            <FileText className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="p-2.5 hover:bg-red-100 rounded-xl transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-500 hover:text-red-600" />
                        </button>
                      </div>
                    )}

                    {errors.file && (
                      <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/>
                        </svg>
                        {errors.file}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {t('common.loading')}
                    </>
                  ) : (
                    <>
                      {t('common.submit')}
                      <Send className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Section - Info Card (col-span-2) */}
          <div className="lg:col-span-2">
            {/* Desktop Header - Hidden on mobile */}
            <div className="hidden lg:block mb-6">
              <div className="bg-white p-7 rounded-2xl shadow-md border border-gray-100">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('enquiry.title')}</h1>
                <p className="text-gray-600 text-lg">{t('enquiry.subtitle')}</p>
              </div>
            </div>

            {/* Info Cards - Sticky on desktop */}
            <div className="lg:sticky lg:top-6 space-y-4">
              {/* Quick Response */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 flex gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Clock3 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Quick Response</h3>
                  <p className="text-gray-600 leading-relaxed">We'll get back to you within 24 hours with a custom quote</p>
                </div>
              </div>

              {/* Secure & Private */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-green-100 flex gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Secure & Private</h3>
                  <p className="text-gray-600 leading-relaxed">Your information is kept confidential and secure</p>
                </div>
              </div>

              {/* Best Pricing */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-purple-100 flex gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <BadgeDollarSign className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Best Pricing</h3>
                  <p className="text-gray-600 leading-relaxed">Competitive rates with no hidden charges</p>
                </div>
              </div>

              {/* Contact Info Card */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg text-white">
                <h3 className="font-bold text-xl mb-4">Need Help?</h3>
                <div className="space-y-3 text-gray-300">
                  <p className="flex items-center gap-3">
                    <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <PhoneCall className="w-5 h-5" />
                    </span>
                    +91 77098 31071
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </span>
                    info@designconcept.com
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
