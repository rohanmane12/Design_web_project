'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Edit, Eye, EyeOff, Image, Plus, Trash2 } from 'lucide-react';

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
        if (res.ok) {
          setServices(await res.json());
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setServices((current) => current.filter((service) => service._id !== id));
      }
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
        setServices((current) =>
          current.map((item) => (item._id === service._id ? { ...item, active: !service.active } : item)),
        );
      }
    } catch (error) {
      console.error('Error toggling status:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="mt-1 text-gray-600">Manage your services and offerings.</p>
        </div>
        <button
          onClick={() => router.push(`/${locale}/admin/services/new`)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          <Plus className="h-5 w-5" />
          Add Service
        </button>
      </div>

      {services.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center">
          <Package className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <h3 className="mb-2 text-xl font-semibold text-gray-900">No Services Yet</h3>
          <p className="mb-6 text-gray-600">Get started by adding your first service.</p>
          <button
            onClick={() => router.push(`/${locale}/admin/services/new`)}
            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
          >
            Add Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service._id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-lg">
              <div className="relative h-48 bg-gray-100">
                {service.images?.[0] ? (
                  <img src={service.images[0]} alt={service.name.en} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Image className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute right-2 top-2 flex gap-2">
                  <button
                    onClick={() => toggleActive(service)}
                    className={`rounded-lg p-2 text-white backdrop-blur-sm ${
                      service.active ? 'bg-green-500/90' : 'bg-gray-500/90'
                    }`}
                  >
                    {service.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="mb-1 text-lg font-bold text-gray-900">{service.name.en}</h3>
                <p className="mb-3 text-sm capitalize text-gray-500">{service.category}</p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/${locale}/admin/services/${service._id}/edit`)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-2 font-medium text-blue-600 transition-colors hover:bg-blue-100"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    disabled={deleting === service._id}
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

function Package({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}
