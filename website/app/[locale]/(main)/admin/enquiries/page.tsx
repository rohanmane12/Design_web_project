'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import { Eye, Mail, Phone, Trash2, User, X } from 'lucide-react';

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
  adminNotes?: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  createdAt: string;
}

const filters = ['all', 'pending', 'contacted', 'completed', 'cancelled'] as const;
const statusTone: Record<Enquiry['status'], string> = {
  pending: 'bg-[#fff2e8] text-[#c2410c]',
  contacted: 'bg-[#e8f2ff] text-[#1d4ed8]',
  completed: 'bg-[#e9f9ef] text-[#15803d]',
  cancelled: 'bg-[#f8ebee] text-[#b42318]',
};

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]>('all');
  const [adminNotesDraft, setAdminNotesDraft] = useState('');

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await fetch('/api/admin/enquiries');
        if (res.ok) setEnquiries(await res.json());
      } catch (error) {
        console.error('Error fetching enquiries:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchEnquiries();
  }, []);

  const filteredEnquiries = useMemo(() => enquiries.filter((enquiry) => filter === 'all' || enquiry.status === filter), [enquiries, filter]);

  const updateEnquiry = async (id: string, payload: Partial<Pick<Enquiry, 'status' | 'adminNotes'>>) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to update enquiry');
      }

      const updatedEnquiry: Enquiry = await res.json();
      setEnquiries((current) => current.map((enquiry) => (enquiry._id === id ? updatedEnquiry : enquiry)));
      setSelectedEnquiry((current) => (current?._id === id ? updatedEnquiry : current));
      setAdminNotesDraft(updatedEnquiry.adminNotes || '');
    } catch (error) {
      console.error('Error updating enquiry:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;

    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEnquiries((current) => current.filter((enquiry) => enquiry._id !== id));
        setSelectedEnquiry((current) => (current?._id === id ? null : current));
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error);
    }
  };

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#004B87]" /></div>;
  }

  return (
    <div className="space-y-8 px-4 py-6 md:px-6 lg:px-8">
      <section className="rounded-[28px] border border-[#d8e2ee] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6a7b91]">Leads</p>
        <h2 className="mt-2 text-3xl font-bold text-[#12314f]">Enquiries</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6a7b91]">Track every incoming request, update outreach status, and keep the sales pipeline visible to the team.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map((option) => (
            <button key={option} onClick={() => setFilter(option)} className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors ${filter === option ? 'bg-[#004B87] text-white' : 'bg-[#eef3f8] text-[#51657c] hover:bg-[#e1e8ef]'}`}>
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Total" value={enquiries.length} />
        <SummaryCard label="Pending" value={enquiries.filter((enquiry) => enquiry.status === 'pending').length} />
        <SummaryCard label="Contacted" value={enquiries.filter((enquiry) => enquiry.status === 'contacted').length} />
        <SummaryCard label="Completed" value={enquiries.filter((enquiry) => enquiry.status === 'completed').length} />
      </section>

      <section className="overflow-hidden rounded-[28px] border border-[#d8e2ee] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px]">
            <thead className="bg-[#f8fbfe]">
              <tr className="border-b border-[#e7edf4] text-left text-sm text-[#6a7b91]">
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-16 text-center text-[#6a7b91]">No enquiries found for this filter.</td></tr>
              ) : (
                filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry._id} className="border-b border-[#f2f5f8] last:border-b-0">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e7f1fb] text-[#004B87]"><User className="h-5 w-5" /></div>
                        <div><p className="font-semibold text-[#12314f]">{enquiry.name}</p><p className="text-sm text-[#6a7b91]">{enquiry.email}</p></div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-[#334155]">{enquiry.productName?.en || 'N/A'}</td>
                    <td className="px-6 py-5"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone[enquiry.status]}`}>{enquiry.status}</span></td>
                    <td className="px-6 py-5 text-sm text-[#6a7b91]">{new Date(enquiry.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setSelectedEnquiry(enquiry); setAdminNotesDraft(enquiry.adminNotes || ''); }} className="rounded-2xl bg-[#e7f1fb] p-3 text-[#004B87] transition-colors hover:bg-[#dbeaf8]" title="View details"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(enquiry._id)} className="rounded-2xl bg-[#fff1ef] p-3 text-[#b42318] transition-colors hover:bg-[#ffe4df]" title="Delete enquiry"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/40 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-[#d8e2ee] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.2)]">
            <div className="sticky top-0 flex items-center justify-between border-b border-[#e7edf4] bg-white px-6 py-5">
              <div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6a7b91]">Lead detail</p><h3 className="mt-2 text-2xl font-bold text-[#12314f]">{selectedEnquiry.name}</h3></div>
              <button onClick={() => setSelectedEnquiry(null)} className="rounded-2xl bg-[#eef3f8] p-3 text-[#51657c] transition-colors hover:bg-[#e1e8ef]" aria-label="Close enquiry details"><X className="h-4 w-4" /></button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <DetailCard label="Email" icon={<Mail className="h-4 w-4" />} value={selectedEnquiry.email} />
                <DetailCard label="Phone" icon={<Phone className="h-4 w-4" />} value={selectedEnquiry.phone} />
                <DetailCard label="Product" value={selectedEnquiry.productName?.en || 'N/A'} />
                <DetailCard label="Status" value={<span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone[selectedEnquiry.status]}`}>{selectedEnquiry.status}</span>} />
              </div>

              <div className="rounded-[24px] bg-[#f8fbfe] p-5">
                <p className="text-sm font-semibold text-[#12314f]">Customization</p>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <DetailInline label="Size" value={selectedEnquiry.customization?.size || 'N/A'} />
                  <DetailInline label="Material" value={selectedEnquiry.customization?.material || 'N/A'} />
                  <DetailInline label="Quantity" value={selectedEnquiry.customization?.quantity?.toString() || 'N/A'} />
                </div>
                {selectedEnquiry.customization?.notes && <div className="mt-4 rounded-2xl bg-white p-4"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7b91]">Notes</p><p className="mt-2 text-sm leading-6 text-[#334155]">{selectedEnquiry.customization.notes}</p></div>}
              </div>

              {selectedEnquiry.fileUrl && <a href={selectedEnquiry.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-2xl bg-[#e7f1fb] px-4 py-3 font-semibold text-[#004B87] no-underline transition-colors hover:bg-[#dbeaf8]">Download attached file</a>}

              <div className="rounded-[24px] border border-[#d8e2ee] p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-[#12314f]">Admin notes</p>
                  <button
                    type="button"
                    onClick={() => void updateEnquiry(selectedEnquiry._id, { adminNotes: adminNotesDraft })}
                    className="rounded-full bg-[#004B87] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#003b6c]"
                  >
                    Save notes
                  </button>
                </div>
                <textarea
                  value={adminNotesDraft}
                  onChange={(e) => setAdminNotesDraft(e.target.value)}
                  rows={4}
                  className="mt-4 w-full resize-none rounded-2xl border border-[#d8e2ee] px-4 py-3 text-sm outline-none transition-colors focus:border-[#004B87]"
                  placeholder="Internal follow-up notes for this enquiry"
                />
              </div>

              <div className="rounded-[24px] border border-[#d8e2ee] p-5">
                <p className="text-sm font-semibold text-[#12314f]">Update status</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {filters.slice(1).map((status) => (
                    <button key={status} onClick={() => void updateEnquiry(selectedEnquiry._id, { status })} className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors ${selectedEnquiry.status === status ? 'bg-[#004B87] text-white' : 'bg-[#eef3f8] text-[#51657c] hover:bg-[#e1e8ef]'}`}>
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

function SummaryCard({ label, value }: { label: string; value: number }) {
  return <div className="rounded-[24px] border border-[#d8e2ee] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"><p className="text-sm text-[#6a7b91]">{label}</p><p className="mt-3 text-3xl font-bold text-[#12314f]">{value}</p></div>;
}

function DetailCard({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return <div className="rounded-[24px] bg-[#f8fbfe] p-5"><p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7b91]">{icon}{label}</p><div className="mt-3 text-sm font-medium text-[#12314f]">{value}</div></div>;
}

function DetailInline({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-white p-4"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7b91]">{label}</p><p className="mt-2 text-sm font-medium text-[#12314f]">{value}</p></div>;
}
