'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Clock, Image, Mail, Package } from 'lucide-react';

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
  phone: string;
  productName: { en?: string; hi?: string; mr?: string } | string;
  status: string;
  createdAt: string;
}

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

        if (statsRes.ok) {
          setStats(await statsRes.json());
        }

        if (enquiriesRes.ok) {
          setRecentEnquiries(await enquiriesRes.json());
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  const statCards = [
    { title: 'Total Services', value: stats?.totalServices || 0, icon: Package, color: 'from-blue-500 to-blue-600' },
    { title: 'Portfolio Items', value: stats?.totalPortfolio || 0, icon: Image, color: 'from-purple-500 to-purple-600' },
    { title: 'Total Enquiries', value: stats?.totalEnquiries || 0, icon: Mail, color: 'from-green-500 to-green-600' },
    { title: 'Pending', value: stats?.pendingEnquiries || 0, icon: Clock, color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">Welcome to the admin panel.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recent Enquiries</h2>
          <Link href={`/${locale}/admin/enquiries`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View all
          </Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <p className="py-8 text-center text-gray-500">No enquiries yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentEnquiries.map((enquiry) => (
                  <tr key={enquiry._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{enquiry.name}</p>
                        <p className="text-sm text-gray-500">{enquiry.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {typeof enquiry.productName === 'string'
                        ? enquiry.productName
                        : enquiry.productName?.en || enquiry.productName?.hi || enquiry.productName?.mr || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          enquiry.status === 'pending'
                            ? 'bg-orange-100 text-orange-700'
                            : enquiry.status === 'contacted'
                              ? 'bg-blue-100 text-blue-700'
                              : enquiry.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
