'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Clock3, FolderKanban, LayoutGrid, Mail, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface DashboardStats {
  totalServices: number;
  totalPortfolio: number;
  totalEnquiries: number;
  pendingEnquiries: number;
  completedEnquiries: number;
}

interface RecentEnquiry {
  _id: string;
  name: string;
  email: string;
  productName: { en?: string; hi?: string; mr?: string } | string;
  status: string;
  createdAt: string;
}

const statusTone: Record<string, string> = {
  pending: 'bg-[#fff2e8] text-[#c2410c]',
  contacted: 'bg-[#e8f2ff] text-[#1d4ed8]',
  completed: 'bg-[#e9f9ef] text-[#15803d]',
  cancelled: 'bg-[#f8ebee] text-[#b42318]',
};

export default function AdminDashboard() {
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : 'en';
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentEnquiries, setRecentEnquiries] = useState<RecentEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, enquiriesRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/enquiries/recent'),
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (enquiriesRes.ok) setRecentEnquiries(await enquiriesRes.json());
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchDashboardData();
  }, []);

  const completionRate = useMemo(() => {
    if (!stats?.totalEnquiries) return 0;
    return Math.round((stats.completedEnquiries / stats.totalEnquiries) * 100);
  }, [stats]);

  const statCards = [
    { title: 'Services', subtitle: 'Live catalog entries', value: stats?.totalServices || 0, icon: Package, accent: 'bg-[#e7f1fb] text-[#004B87]' },
    { title: 'Portfolio', subtitle: 'Published case studies', value: stats?.totalPortfolio || 0, icon: FolderKanban, accent: 'bg-[#eef9f0] text-[#157347]' },
    { title: 'Enquiries', subtitle: 'Total customer requests', value: stats?.totalEnquiries || 0, icon: Mail, accent: 'bg-[#fff2e8] text-[#c2410c]' },
    { title: 'Pending', subtitle: 'Needs follow-up', value: stats?.pendingEnquiries || 0, icon: Clock3, accent: 'bg-[#f7ecff] text-[#7c3aed]' },
  ];

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#004B87]" /></div>;
  }

  return (
    <div className="space-y-8 px-4 py-6 md:px-6 lg:px-8">
      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[28px] bg-[linear-gradient(135deg,#004B87_0%,#0a67b9_65%,#4c9ae5_100%)] p-8 text-white shadow-[0_24px_60px_rgba(0,75,135,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/72">Overview</p>
          <h2 className="mt-3 max-w-xl text-3xl font-bold leading-tight md:text-4xl">Keep content, leads, and publishing moving from one admin workspace.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 md:text-base">The dashboard gives a live picture of what is published, what is waiting on follow-up, and where the next admin action should happen.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/${locale}/admin/services/new`} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#004B87] no-underline">Add service<ArrowRight className="h-4 w-4" /></Link>
            <Link href={`/${locale}/admin/portfolio/new`} className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/8 px-5 py-3 text-sm font-semibold text-white no-underline">Add portfolio item</Link>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#d8e2ee] bg-white p-7 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6a7b91]">Conversion</p>
              <h3 className="mt-2 text-2xl font-bold text-[#12314f]">{completionRate}% completed</h3>
            </div>
            <div className="rounded-2xl bg-[#eef3f8] p-3 text-[#004B87]"><LayoutGrid className="h-6 w-6" /></div>
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#edf2f7]"><div className="h-full rounded-full bg-[linear-gradient(90deg,#FF6600,#ff8a3d)]" style={{ width: `${completionRate}%` }} /></div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Metric label="Completed enquiries" value={stats?.completedEnquiries || 0} />
            <Metric label="Pending follow-ups" value={stats?.pendingEnquiries || 0} />
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="rounded-[24px] border border-[#d8e2ee] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#12314f]">{stat.title}</p>
                  <p className="mt-1 text-sm text-[#6a7b91]">{stat.subtitle}</p>
                </div>
                <div className={`rounded-2xl p-3 ${stat.accent}`}><Icon className="h-5 w-5" /></div>
              </div>
              <p className="mt-6 text-4xl font-bold text-[#12314f]">{stat.value}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-[#d8e2ee] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6a7b91]">Inbound queue</p>
              <h3 className="mt-2 text-2xl font-bold text-[#12314f]">Recent enquiries</h3>
            </div>
            <Link href={`/${locale}/admin/enquiries`} className="text-sm font-semibold text-[#004B87] no-underline hover:text-[#0066CC]">View all</Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#d8e2ee] bg-[#f8fbfe] px-6 py-14 text-center text-[#6a7b91]">No enquiries yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px]">
                <thead>
                  <tr className="border-b border-[#edf2f7] text-left text-sm text-[#6a7b91]">
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Product</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEnquiries.map((enquiry) => (
                    <tr key={enquiry._id} className="border-b border-[#f2f5f8] last:border-b-0">
                      <td className="px-4 py-4"><p className="font-semibold text-[#12314f]">{enquiry.name}</p><p className="text-sm text-[#6a7b91]">{enquiry.email}</p></td>
                      <td className="px-4 py-4 text-sm text-[#334155]">{typeof enquiry.productName === 'string' ? enquiry.productName : enquiry.productName?.en || enquiry.productName?.hi || enquiry.productName?.mr || 'N/A'}</td>
                      <td className="px-4 py-4"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone[enquiry.status] || 'bg-[#eef3f8] text-[#51657c]'}`}>{enquiry.status}</span></td>
                      <td className="px-4 py-4 text-sm text-[#6a7b91]">{new Date(enquiry.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <QuickAction title="Catalog upkeep" description="Review live services and keep pricing, media, and visibility current." href={`/${locale}/admin/services`} cta="Manage services" />
          <QuickAction title="Portfolio publishing" description="Add finished work so the public site reflects recent output." href={`/${locale}/admin/portfolio`} cta="Open portfolio" />
          <QuickAction title="Lead follow-up" description="Move pending enquiries to contacted or completed after outreach." href={`/${locale}/admin/enquiries`} cta="Review enquiries" />
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl bg-[#f8fbfe] p-4"><p className="text-sm text-[#6a7b91]">{label}</p><p className="mt-2 text-2xl font-bold text-[#12314f]">{value}</p></div>;
}

function QuickAction({ title, description, href, cta }: { title: string; description: string; href: string; cta: string }) {
  return (
    <div className="rounded-[28px] border border-[#d8e2ee] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
      <h3 className="text-xl font-bold text-[#12314f]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#6a7b91]">{description}</p>
      <Link href={href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#004B87] no-underline hover:text-[#0066CC]">{cta}<ArrowRight className="h-4 w-4" /></Link>
    </div>
  );
}
