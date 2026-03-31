'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Image, Star } from 'lucide-react';

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
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch('/api/admin/portfolio');
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;
    
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPortfolio(portfolio.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error('Error deleting portfolio:', error);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-gray-600 mt-1">Showcase your best work</p>
        </div>
        <button
          onClick={() => router.push('/admin/portfolio/new')}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Portfolio
        </button>
      </div>

      {/* Portfolio Grid */}
      {portfolio.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Portfolio Items Yet</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first portfolio item</p>
          <button
            onClick={() => router.push('/admin/portfolio/new')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
          >
            Add Portfolio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="h-48 bg-gray-100 relative">
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt={item.title.en} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Image className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {item.featured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white p-2 rounded-lg">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{item.title.en}</h3>
                <p className="text-sm text-gray-500 mb-3 capitalize">{item.category}</p>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/admin/portfolio/${item._id}/edit`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deleting === item._id}
                    className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
