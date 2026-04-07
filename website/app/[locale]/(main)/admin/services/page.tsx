'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Edit, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';

interface Service {
  _id: string;
  name: { en: string; hi: string; mr: string };
  category: string;
  images: string[];
  active: boolean;
  featured: boolean;
  createdAt: string;
}

export default function AdminServices() {
  const router = useRouter();
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : 'en';
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/admin/services');
        if (res.ok) setServices(await res.json());
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchServices();
  }, []);

  const featuredCount = useMemo(() => services.filter((service) => service.featured).length, [services]);
  const visibleCount = useMemo(() => services.filter((service) => service.active).length, [services]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      if (res.ok) setServices((current) => current.filter((service) => service._id !== id));
    } catch (error) {
      console.error('Error deleting service:', error);
    } finally {
      setDeleting(null);
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      const res = await fetch(`/api/admin/services/${service._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !service.active }),
      });

      if (res.ok) {
        setServices((current) => current.map((item) => (item._id === service._id ? { ...item, active: !service.active } : item)));
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const toggleFeatured = async (service: Service) => {
    try {
      const res = await fetch(`/api/admin/services/${service._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !service.featured }),
      });

      if (res.ok) {
        setServices((current) => current.map((item) => (item._id === service._id ? { ...item, featured: !service.featured } : item)));
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#004B87]" /></div>;
  }

  return (
    <div className="space-y-8 px-4 py-6 md:px-6 lg:px-8">
      <section className="flex flex-col gap-5 rounded-[28px] border border-[#d8e2ee] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6a7b91]">Catalog</p>
          <h2 className="mt-2 text-3xl font-bold text-[#12314f]">Services</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6a7b91]">Update the public offer, keep inactive items hidden, and feature the services you want to promote first.</p>
        </div>
        <button onClick={() => router.push(`/${locale}/admin/services/new`)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6600] px-5 py-3 font-semibold text-white shadow-[0_18px_35px_rgba(255,102,0,0.2)] transition-colors hover:bg-[#E55C00]">
          <Plus className="h-5 w-5" />
          Add service
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Total services" value={services.length} />
        <SummaryCard label="Visible on site" value={visibleCount} />
        <SummaryCard label="Featured entries" value={featuredCount} />
      </section>

      {services.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-[#d8e2ee] bg-white px-6 py-16 text-center shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
          <h3 className="text-xl font-bold text-[#12314f]">No services yet</h3>
          <p className="mt-2 text-sm text-[#6a7b91]">Create the first service to start populating the catalog.</p>
          <button onClick={() => router.push(`/${locale}/admin/services/new`)} className="mt-6 rounded-2xl bg-[#004B87] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#003b6c]">Add service</button>
        </div>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {services.map((service) => (
            <article key={service._id} className="overflow-hidden rounded-[28px] border border-[#d8e2ee] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
              <div className="relative h-56 bg-[#e9eef5]">
                {service.images?.[0] ? <img src={service.images[0]} alt={service.name.en} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm font-medium text-[#6a7b91]">No image uploaded</div>}
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                  <span className="rounded-full bg-white/92 px-3 py-1 text-xs font-semibold capitalize text-[#12314f] shadow-sm">{service.category}</span>
                  {service.featured && <span className="rounded-full bg-[#12314f] px-3 py-1 text-xs font-semibold text-white">Featured</span>}
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#12314f]">{service.name.en}</h3>
                    <p className="mt-2 text-sm text-[#6a7b91]">Created {new Date(service.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => toggleActive(service)} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${service.active ? 'bg-[#eefaf1] text-[#107948]' : 'bg-[#f4f6f8] text-[#51657c]'}`}>
                      {service.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      {service.active ? 'Visible' : 'Hidden'}
                    </button>
                    <button onClick={() => toggleFeatured(service)} className={`rounded-full px-3 py-2 text-xs font-semibold ${service.featured ? 'bg-[#12314f] text-white' : 'bg-[#eef3f8] text-[#51657c]'}`}>
                      {service.featured ? 'Featured' : 'Mark featured'}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => router.push(`/${locale}/admin/services/${service._id}/edit`)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#e7f1fb] px-4 py-3 font-semibold text-[#004B87] transition-colors hover:bg-[#dbeaf8]"><Edit className="h-4 w-4" />Edit</button>
                  <button onClick={() => handleDelete(service._id)} disabled={deleting === service._id} className="flex items-center justify-center rounded-2xl bg-[#fff1ef] px-4 py-3 text-[#b42318] transition-colors hover:bg-[#ffe4df] disabled:cursor-not-allowed disabled:opacity-60"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return <div className="rounded-[24px] border border-[#d8e2ee] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"><p className="text-sm text-[#6a7b91]">{label}</p><p className="mt-3 text-3xl font-bold text-[#12314f]">{value}</p></div>;
}
