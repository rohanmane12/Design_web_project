'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Eye, Trash2, Mail, Phone, User } from 'lucide-react';

interface Enquiry {
  _id: string;
  name: string;
  phone: string;
  email: string;
  productName: { en: string; hi: string; mr: string };
  customization: {
    size?: string;
    material?: string;
    quantity?: number;
    notes?: string;
  };
  fileUrl?: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/admin/enquiries');
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data);
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Enquiry['status']) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setEnquiries(enquiries.map(e => e._id === id ? { ...e, status } : e));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEnquiries(enquiries.filter(e => e._id !== id));
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error);
    }
  };

  const filteredEnquiries = enquiries.filter(e => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'contacted': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
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
          <h1 className="text-3xl font-bold text-gray-900">Enquiries</h1>
          <p className="text-gray-600 mt-1">Manage customer enquiries</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{enquiries.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-orange-600">{enquiries.filter(e => e.status === 'pending').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Contacted</p>
          <p className="text-2xl font-bold text-blue-600">{enquiries.filter(e => e.status === 'contacted').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-600">{enquiries.filter(e => e.status === 'completed').length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Customer</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Product</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    No enquiries found
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{enquiry.name}</p>
                          <p className="text-sm text-gray-500">{enquiry.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {enquiry.productName?.en || 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(enquiry.status)}`}>
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-sm">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(enquiry._id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Enquiry Details</h2>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Eye className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Name</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {selectedEnquiry.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {selectedEnquiry.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {selectedEnquiry.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEnquiry.status)}`}>
                    {selectedEnquiry.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 mb-1">Product/Service</p>
                <p className="font-medium text-gray-900">{selectedEnquiry.productName?.en}</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 mb-2">Customization</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="text-gray-900">{selectedEnquiry.customization?.size || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Material</p>
                    <p className="text-gray-900">{selectedEnquiry.customization?.material || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="text-gray-900">{selectedEnquiry.customization?.quantity || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {selectedEnquiry.customization?.notes && (
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600 mb-1">Notes</p>
                  <p className="text-gray-900">{selectedEnquiry.customization.notes}</p>
                </div>
              )}

              {selectedEnquiry.fileUrl && (
                <div className="border-t border-gray-200 pt-4">
                  <a
                    href={selectedEnquiry.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Download Design File (PDF)
                  </a>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 mb-2">Update Status</p>
                <div className="flex gap-2 flex-wrap">
                  {(['pending', 'contacted', 'completed', 'cancelled'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        updateStatus(selectedEnquiry._id, status);
                        setSelectedEnquiry({ ...selectedEnquiry, status });
                      }}
                      className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                        selectedEnquiry.status === status
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
