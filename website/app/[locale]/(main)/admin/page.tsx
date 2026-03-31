'use client';

import { useEffect, useState } from 'react';
import { Package, Image, Mail, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

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
  productName: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentEnquiries, setRecentEnquiries] = useState<RecentEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, enquiriesRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/enquiries/recent'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (enquiriesRes.ok) {
        const enquiriesData = await enquiriesRes.json();
        setRecentEnquiries(enquiriesData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Services', value: stats?.totalServices || 0, icon: Package, color: 'from-blue-500 to-blue-600' },
    { title: 'Portfolio Items', value: stats?.totalPortfolio || 0, icon: Image, color: 'from-purple-500 to-purple-600' },
    { title: 'Total Enquiries', value: stats?.totalEnquiries || 0, icon: Mail, color: 'from-green-500 to-green-600' },
    { title: 'Pending', value: stats?.pendingEnquiries || 0, icon: Clock, color: 'from-orange-500 to-orange-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to the admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Enquiries */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Enquiries</h2>
          <a href="/admin/enquiries" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View All →
          </a>
        </div>

        {recentEnquiries.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No enquiries yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentEnquiries.map((enquiry) => (
                  <tr key={enquiry._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{enquiry.name}</p>
                        <p className="text-sm text-gray-500">{enquiry.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{enquiry.productName}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        enquiry.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        enquiry.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                        enquiry.status === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-sm">
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
