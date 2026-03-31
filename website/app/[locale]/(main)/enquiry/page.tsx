'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  BadgeDollarSign,
  CheckCircle,
  Clock3,
  FileText,
  Mail,
  PhoneCall,
  Send,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react';
import { Locale } from '@/i18n';

const servicesKeys = [
  'personal',
  'acrylic',
  'led',
  'standees',
  'stickers',
  'hoardings',
  'banners',
] as const;

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

  const services = [
    { value: '', label: t('enquiry.selectProduct') },
    ...servicesKeys.map((key) => ({
      value: key,
      label: t(`services.categories.${key}`),
    })),
  ];

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.name.trim()) nextErrors.name = t('validation.required');
    if (!formData.phone.trim()) nextErrors.phone = t('validation.required');

    if (!formData.email.trim()) {
      nextErrors.email = t('validation.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = t('validation.invalidEmail');
    }

    if (!formData.service) nextErrors.service = t('validation.required');

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
    }, 1800);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setErrors((prev) => ({ ...prev, file: t('validation.invalidFileType') }));
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: t('validation.fileTooLarge') }));
      return;
    }

    setFile(selectedFile);
    setErrors((prev) => ({ ...prev, file: '' }));
  };

  const inputClass = (field?: string) =>
    [
      'w-full rounded-2xl border px-4 py-3.5 text-sm text-slate-900 transition',
      'placeholder:text-slate-400 focus:outline-none focus:ring-4',
      field && errors[field]
        ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100'
        : 'border-slate-200 bg-white hover:border-slate-300 focus:border-sky-500 focus:ring-sky-100',
    ].join(' ');

  if (submitted) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-sky-100 bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="mb-3 text-3xl font-semibold tracking-tight text-slate-950">
            {t('enquiry.submitSuccess')}
          </h1>
          <p className="text-base text-slate-600">{t('enquiry.whatsappRedirect')}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#f3f6fb_45%,#ffffff_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
            <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.35),_transparent_35%),linear-gradient(135deg,#0f172a_0%,#111827_58%,#1d4ed8_100%)] px-6 py-10 sm:px-8 sm:py-12">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">
                {t('common.enquiry')}
              </span>
              <h1 className="mt-5 max-w-md text-4xl font-semibold tracking-tight sm:text-5xl">
                {t('enquiry.title')}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
                {t('enquiry.subtitle')}
              </p>
            </div>

            <div className="space-y-6 px-6 py-8 sm:px-8">
              <div className="grid gap-4 sm:grid-cols-3">
                <InfoTile
                  icon={<Clock3 className="h-5 w-5 text-sky-300" />}
                  title={t('enquiry.responseTitle')}
                  description={t('enquiry.responseDesc')}
                />
                <InfoTile
                  icon={<ShieldCheck className="h-5 w-5 text-emerald-300" />}
                  title={t('enquiry.privacyTitle')}
                  description={t('enquiry.privacyDesc')}
                />
                <InfoTile
                  icon={<BadgeDollarSign className="h-5 w-5 text-amber-300" />}
                  title={t('enquiry.pricingTitle')}
                  description={t('enquiry.pricingDesc')}
                />
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                  {t('enquiry.includeTitle')}
                </h2>
                <ul className="mt-4 space-y-3 text-sm text-slate-200">
                  <li>{t('enquiry.includePoint1')}</li>
                  <li>{t('enquiry.includePoint2')}</li>
                  <li>{t('enquiry.includePoint3')}</li>
                </ul>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                  {t('enquiry.supportTitle')}
                </h2>
                <div className="mt-4 space-y-3 text-sm text-slate-100">
                  <p className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                      <PhoneCall className="h-4 w-4" />
                    </span>
                    <span>+91 77098 31071</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                      <Mail className="h-4 w-4" />
                    </span>
                    <span>info@designconcept.com</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-8">
                <FormSection
                  title={t('enquiry.personalInfo')}
                  description={t('enquiry.personalInfoDesc')}
                >
                  <div className="grid gap-4">
                    <Field label={t('enquiry.name')} required error={errors.name}>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(event) => updateField('name', event.target.value)}
                        placeholder={t('enquiry.namePlaceholder')}
                        className={inputClass('name')}
                      />
                    </Field>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label={t('enquiry.phone')} required error={errors.phone}>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(event) => updateField('phone', event.target.value)}
                          placeholder={t('enquiry.phonePlaceholder')}
                          className={inputClass('phone')}
                        />
                      </Field>

                      <Field label={t('enquiry.email')} required error={errors.email}>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(event) => updateField('email', event.target.value)}
                          placeholder={t('enquiry.emailPlaceholder')}
                          className={inputClass('email')}
                        />
                      </Field>
                    </div>
                  </div>
                </FormSection>

                <FormSection
                  title={t('enquiry.customization')}
                  description={t('enquiry.customizationDesc')}
                >
                  <div className="grid gap-4">
                    <Field label={t('enquiry.selectProduct')} required error={errors.service}>
                      <select
                        value={formData.service}
                        onChange={(event) => updateField('service', event.target.value)}
                        className={inputClass('service')}
                      >
                        {services.map((service) => (
                          <option key={service.value} value={service.value}>
                            {service.label}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label={t('enquiry.size')}>
                        <input
                          type="text"
                          value={formData.size}
                          onChange={(event) => updateField('size', event.target.value)}
                          placeholder={t('enquiry.sizePlaceholder')}
                          className={inputClass()}
                        />
                      </Field>

                      <Field label={t('enquiry.material')}>
                        <input
                          type="text"
                          value={formData.material}
                          onChange={(event) => updateField('material', event.target.value)}
                          placeholder={t('enquiry.materialPlaceholder')}
                          className={inputClass()}
                        />
                      </Field>
                    </div>

                    <Field label={t('enquiry.quantity')}>
                      <input
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(event) => updateField('quantity', event.target.value)}
                        className={inputClass()}
                      />
                    </Field>

                    <Field label={t('enquiry.notes')}>
                      <textarea
                        value={formData.notes}
                        onChange={(event) => updateField('notes', event.target.value)}
                        rows={5}
                        placeholder={t('enquiry.notesPlaceholder')}
                        className={`${inputClass()} resize-y`}
                      />
                    </Field>
                  </div>
                </FormSection>

                <FormSection
                  title={t('enquiry.uploadDesign')}
                  description={t('enquiry.uploadDesignDesc')}
                >
                  <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-4">
                    {!file ? (
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.25rem] border border-white bg-white px-6 py-10 text-center transition hover:border-sky-200 hover:bg-sky-50">
                        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                          <Upload className="h-8 w-8" />
                        </span>
                        <span className="text-base font-medium text-slate-900">{t('enquiry.dragDrop')}</span>
                        <span className="mt-2 text-sm text-slate-500">{t('enquiry.pdfLimit')}</span>
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="flex flex-col gap-4 rounded-[1.25rem] border border-sky-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                            <FileText className="h-7 w-7" />
                          </span>
                          <div>
                            <p className="font-medium text-slate-900">{file.name}</p>
                            <p className="text-sm text-slate-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                        >
                          <X className="mr-2 h-4 w-4" />
                          {t('enquiry.removeFile')}
                        </button>
                      </div>
                    )}

                    {errors.file && <ErrorText message={errors.file} />}
                  </div>
                </FormSection>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xl text-sm leading-6 text-slate-600">
                    {t('enquiry.whatsappNote')}
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        {t('common.loading')}
                      </>
                    ) : (
                      <>
                        {t('common.submit')}
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </span>
      {children}
      {error ? <ErrorText message={error} /> : null}
    </label>
  );
}

function ErrorText({ message }: { message: string }) {
  return <p className="mt-2 text-sm text-red-600">{message}</p>;
}

function InfoTile({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
      <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
        {icon}
      </span>
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
    </div>
  );
}
