'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Edit, Image, Plus, Star, Trash2 } from 'lucide-react';

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
        if (res.ok) {
          setPortfolio(await res.json());
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchPortfolio();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPortfolio((current) => current.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.error('Error deleting portfolio:', error);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
          <p className="mt-1 text-gray-600">Showcase your best work.</p>
        </div>
        <button
          onClick={() => router.push(`/${locale}/admin/portfolio/new`)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          <Plus className="h-5 w-5" />
          Add Portfolio
        </button>
      </div>

      {portfolio.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center">
          <Image className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <h3 className="mb-2 text-xl font-semibold text-gray-900">No Portfolio Items Yet</h3>
          <p className="mb-6 text-gray-600">Get started by adding your first portfolio item.</p>
          <button
            onClick={() => router.push(`/${locale}/admin/portfolio/new`)}
            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
          >
            Add Portfolio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolio.map((item) => (
            <div key={item._id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-lg">
              <div className="relative h-48 bg-gray-100">
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt={item.title.en} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Image className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                {item.featured && (
                  <div className="absolute right-2 top-2 rounded-lg bg-yellow-500 p-2 text-white">
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="mb-1 text-lg font-bold text-gray-900">{item.title.en}</h3>
                <p className="mb-3 text-sm capitalize text-gray-500">{item.category}</p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/${locale}/admin/portfolio/${item._id}/edit`)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-2 font-medium text-blue-600 transition-colors hover:bg-blue-100"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deleting === item._id}
                    className="flex items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2 font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
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
