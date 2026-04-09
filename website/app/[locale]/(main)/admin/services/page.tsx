'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Edit, Eye, EyeOff, Plus, Search, Trash2 } from 'lucide-react';

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
  const [search, setSearch] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'standard'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return services.filter((service) => {
      const matchesSearch =
        !query ||
        [service.name.en, service.category]
          .join(' ')
          .toLowerCase()
          .includes(query);
      const matchesVisibility =
        visibilityFilter === 'all' ||
        (visibilityFilter === 'visible' ? service.active : !service.active);
      const matchesFeatured =
        featuredFilter === 'all' ||
        (featuredFilter === 'featured' ? service.featured : !service.featured);

      return matchesSearch && matchesVisibility && matchesFeatured;
    });
  }, [featuredFilter, search, services, visibilityFilter]);

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

  const toggleSelect = (id: string) => {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const handleBulkUpdate = async (payload: Partial<Pick<Service, 'active' | 'featured'>>) => {
    const targetServices = services.filter((service) => selectedIds.includes(service._id));
    await Promise.all(
      targetServices.map((service) =>
        fetch(`/api/admin/services/${service._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      )
    );

    setServices((current) =>
      current.map((service) =>
        selectedIds.includes(service._id) ? { ...service, ...payload } : service
      )
    );
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length || !confirm(`Delete ${selectedIds.length} selected services?`)) return;

    await Promise.all(selectedIds.map((id) => fetch(`/api/admin/services/${id}`, { method: 'DELETE' })));
    setServices((current) => current.filter((service) => !selectedIds.includes(service._id)));
    setSelectedIds([]);
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

      <section className="grid gap-3 rounded-[28px] border border-[#d8e2ee] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] lg:grid-cols-[1.15fr_0.4fr_0.4fr]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6a7b91]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-[#d8e2ee] bg-white px-11 py-3 text-sm outline-none transition-colors focus:border-[#004B87]"
            placeholder="Search by service name or category"
          />
        </div>
        <select value={visibilityFilter} onChange={(e) => setVisibilityFilter(e.target.value as typeof visibilityFilter)} className="rounded-2xl border border-[#d8e2ee] bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#004B87]">
          <option value="all">All visibility</option>
          <option value="visible">Visible only</option>
          <option value="hidden">Hidden only</option>
        </select>
        <select value={featuredFilter} onChange={(e) => setFeaturedFilter(e.target.value as typeof featuredFilter)} className="rounded-2xl border border-[#d8e2ee] bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#004B87]">
          <option value="all">All featured states</option>
          <option value="featured">Featured only</option>
          <option value="standard">Standard only</option>
        </select>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Total services" value={services.length} />
        <SummaryCard label="Visible on site" value={visibleCount} />
        <SummaryCard label="Featured entries" value={featuredCount} />
      </section>

      {selectedIds.length > 0 && (
        <section className="flex flex-wrap items-center gap-3 rounded-[24px] border border-[#d8e2ee] bg-white px-6 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
          <p className="text-sm font-semibold text-[#12314f]">{selectedIds.length} selected</p>
          <button onClick={() => void handleBulkUpdate({ active: true })} className="rounded-full bg-[#eefaf1] px-4 py-2 text-sm font-semibold text-[#107948]">Mark visible</button>
          <button onClick={() => void handleBulkUpdate({ active: false })} className="rounded-full bg-[#f4f6f8] px-4 py-2 text-sm font-semibold text-[#51657c]">Mark hidden</button>
          <button onClick={() => void handleBulkUpdate({ featured: true })} className="rounded-full bg-[#12314f] px-4 py-2 text-sm font-semibold text-white">Mark featured</button>
          <button onClick={() => void handleBulkUpdate({ featured: false })} className="rounded-full bg-[#eef3f8] px-4 py-2 text-sm font-semibold text-[#51657c]">Remove featured</button>
          <button onClick={() => void handleBulkDelete()} className="rounded-full bg-[#fff1ef] px-4 py-2 text-sm font-semibold text-[#b42318]">Delete selected</button>
        </section>
      )}

      {services.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-[#d8e2ee] bg-white px-6 py-16 text-center shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
          <h3 className="text-xl font-bold text-[#12314f]">No services yet</h3>
          <p className="mt-2 text-sm text-[#6a7b91]">Create the first service to start populating the catalog.</p>
          <button onClick={() => router.push(`/${locale}/admin/services/new`)} className="mt-6 rounded-2xl bg-[#004B87] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#003b6c]">Add service</button>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-[#d8e2ee] bg-white px-6 py-16 text-center shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
          <h3 className="text-xl font-bold text-[#12314f]">No services match these filters</h3>
          <p className="mt-2 text-sm text-[#6a7b91]">Try clearing the search or filter settings to see more catalog items.</p>
          <button onClick={() => { setSearch(''); setVisibilityFilter('all'); setFeaturedFilter('all'); }} className="mt-6 rounded-2xl bg-[#004B87] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#003b6c]">Reset filters</button>
        </div>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {filteredServices.map((service) => (
            <article key={service._id} className="overflow-hidden rounded-[28px] border border-[#d8e2ee] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
              <div className="relative h-56 bg-[#e9eef5]">
                {service.images?.[0] ? <Image src={service.images[0]} alt={service.name.en} fill className="object-cover" sizes="(min-width: 1536px) 33vw, (min-width: 768px) 50vw, 100vw" /> : <div className="flex h-full items-center justify-center text-sm font-medium text-[#6a7b91]">No image uploaded</div>}
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    <label className="flex h-8 w-8 items-center justify-center rounded-full bg-white/92 shadow-sm">
                      <input type="checkbox" checked={selectedIds.includes(service._id)} onChange={() => toggleSelect(service._id)} className="h-4 w-4" />
                    </label>
                    <span className="rounded-full bg-white/92 px-3 py-1 text-xs font-semibold capitalize text-[#12314f] shadow-sm">{service.category}</span>
                  </div>
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
