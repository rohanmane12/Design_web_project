'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Edit, Plus, Star, Trash2 } from 'lucide-react';

interface Portfolio {
  _id: string;
  title: { en: string; hi: string; mr: string };
  category: string;
  images: string[];
  featured: boolean;
  active: boolean;
  createdAt: string;
}

export default function AdminPortfolio() {
  const router = useRouter();
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : 'en';
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch('/api/admin/portfolio');
        if (res.ok) setPortfolio(await res.json());
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchPortfolio();
  }, []);

  const featuredCount = useMemo(() => portfolio.filter((item) => item.featured).length, [portfolio]);
  const visibleCount = useMemo(() => portfolio.filter((item) => item.active).length, [portfolio]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' });
      if (res.ok) setPortfolio((current) => current.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error deleting portfolio:', error);
    } finally {
      setDeleting(null);
    }
  };

  const updatePortfolioField = async (item: Portfolio, payload: Partial<Pick<Portfolio, 'active' | 'featured'>>) => {
    try {
      const res = await fetch(`/api/admin/portfolio/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setPortfolio((current) =>
          current.map((entry) => (entry._id === item._id ? { ...entry, ...payload } : entry))
        );
      }
    } catch (error) {
      console.error('Error updating portfolio:', error);
    }
  };

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#004B87]" /></div>;
  }

  return (
    <div className="space-y-8 px-4 py-6 md:px-6 lg:px-8">
      <section className="flex flex-col gap-5 rounded-[28px] border border-[#d8e2ee] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6a7b91]">Showcase</p>
          <h2 className="mt-2 text-3xl font-bold text-[#12314f]">Portfolio</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6a7b91]">Curate published work so recent projects and featured visuals stay visible on the marketing side of the site.</p>
        </div>
        <button onClick={() => router.push(`/${locale}/admin/portfolio/new`)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6600] px-5 py-3 font-semibold text-white shadow-[0_18px_35px_rgba(255,102,0,0.2)] transition-colors hover:bg-[#E55C00]">
          <Plus className="h-5 w-5" />
          Add portfolio item
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Total projects" value={portfolio.length} />
        <SummaryCard label="Visible on site" value={visibleCount} />
        <SummaryCard label="Featured projects" value={featuredCount} />
      </section>

      {portfolio.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-[#d8e2ee] bg-white px-6 py-16 text-center shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
          <h3 className="text-xl font-bold text-[#12314f]">No portfolio items yet</h3>
          <p className="mt-2 text-sm text-[#6a7b91]">Add completed work to give the site proof of output.</p>
          <button onClick={() => router.push(`/${locale}/admin/portfolio/new`)} className="mt-6 rounded-2xl bg-[#004B87] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#003b6c]">Add portfolio item</button>
        </div>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {portfolio.map((item) => (
            <article key={item._id} className="overflow-hidden rounded-[28px] border border-[#d8e2ee] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
              <div className="relative h-56 bg-[#e9eef5]">
                {item.images?.[0] ? <Image src={item.images[0]} alt={item.title.en} fill className="object-cover" sizes="(min-width: 1536px) 33vw, (min-width: 768px) 50vw, 100vw" /> : <div className="flex h-full items-center justify-center text-sm font-medium text-[#6a7b91]">No image uploaded</div>}
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                  <span className="rounded-full bg-white/92 px-3 py-1 text-xs font-semibold capitalize text-[#12314f] shadow-sm">{item.category}</span>
                  {item.featured && <span className="inline-flex items-center gap-1 rounded-full bg-[#12314f] px-3 py-1 text-xs font-semibold text-white"><Star className="h-3.5 w-3.5 fill-current" />Featured</span>}
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#12314f]">{item.title.en}</h3>
                    <p className="mt-2 text-sm text-[#6a7b91]">Created {new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => void updatePortfolioField(item, { active: !item.active })}
                      className={`rounded-full px-3 py-2 text-xs font-semibold ${item.active ? 'bg-[#eefaf1] text-[#107948]' : 'bg-[#f4f6f8] text-[#51657c]'}`}
                    >
                      {item.active ? 'Visible' : 'Hidden'}
                    </button>
                    <button
                      onClick={() => void updatePortfolioField(item, { featured: !item.featured })}
                      className={`rounded-full px-3 py-2 text-xs font-semibold ${item.featured ? 'bg-[#12314f] text-white' : 'bg-[#eef3f8] text-[#51657c]'}`}
                    >
                      {item.featured ? 'Featured' : 'Mark featured'}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => router.push(`/${locale}/admin/portfolio/${item._id}/edit`)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#e7f1fb] px-4 py-3 font-semibold text-[#004B87] transition-colors hover:bg-[#dbeaf8]"><Edit className="h-4 w-4" />Edit</button>
                  <button onClick={() => handleDelete(item._id)} disabled={deleting === item._id} className="flex items-center justify-center rounded-2xl bg-[#fff1ef] px-4 py-3 text-[#b42318] transition-colors hover:bg-[#ffe4df] disabled:cursor-not-allowed disabled:opacity-60"><Trash2 className="h-4 w-4" /></button>
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
