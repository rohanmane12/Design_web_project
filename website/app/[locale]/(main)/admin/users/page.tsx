'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Shield, Trash2, UserPlus } from 'lucide-react';

type AdminRole = 'admin' | 'super-admin';

interface AdminUser {
  _id: string;
  name?: string;
  email: string;
  role: AdminRole;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState<AdminRole | ''>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin' as AdminRole,
  });

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch admins');
        }

        setAdmins(data.admins || []);
        setCurrentUserEmail(data.currentUserEmail || '');
        setCurrentUserRole(data.currentUserRole || '');
      } catch (error) {
        console.error('Error fetching admins:', error);
        setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to load admin users.' });
      } finally {
        setLoading(false);
      }
    };

    void fetchAdmins();
  }, []);

  const adminCount = useMemo(() => admins.length, [admins]);
  const superAdminCount = useMemo(() => admins.filter((admin) => admin.role === 'super-admin').length, [admins]);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create admin');
      }

      setAdmins((current) => [
        {
          _id: data.admin.id,
          name: data.admin.name,
          email: data.admin.email,
          role: data.admin.role,
          createdAt: data.admin.createdAt,
        },
        ...current,
      ]);
      setFormData({ name: '', email: '', password: '', role: 'admin' });
      setMessage({ type: 'success', text: 'Admin account created successfully.' });
    } catch (error) {
      console.error('Error creating admin:', error);
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to create admin.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAdmin = async (admin: AdminUser) => {
    if (!confirm(`Delete admin ${admin.email}?`)) return;

    setMessage(null);

    try {
      const res = await fetch(`/api/admin/users/${admin._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete admin');
      }

      setAdmins((current) => current.filter((item) => item._id !== admin._id));
      setMessage({ type: 'success', text: 'Admin account deleted successfully.' });
    } catch (error) {
      console.error('Error deleting admin:', error);
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to delete admin.' });
    }
  };

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#004B87]" /></div>;
  }

  if (currentUserRole !== 'super-admin') {
    return (
      <div className="space-y-6 px-4 py-6 md:px-6 lg:px-8">
        <section className="rounded-[28px] border border-[#f7c6c1] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-[#b42318]" />
            <div>
              <h2 className="text-2xl font-bold text-[#12314f]">Restricted area</h2>
              <p className="mt-2 text-sm leading-6 text-[#6a7b91]">Only super-admin accounts can manage admin users.</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 py-6 md:px-6 lg:px-8">
      <section className="flex flex-col gap-5 rounded-[28px] border border-[#d8e2ee] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6a7b91]">Access control</p>
          <h2 className="mt-2 text-3xl font-bold text-[#12314f]">Admin users</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6a7b91]">Create additional admins, control elevated access, and keep at least one trusted operator in the workspace.</p>
        </div>
      </section>

      {message && (
        <div className={`rounded-[24px] border p-4 text-sm ${message.type === 'success' ? 'border-[#b7e4c7] bg-[#eefaf1] text-[#107948]' : 'border-[#f7c6c1] bg-[#fff3f1] text-[#912018]'}`}>
          {message.text}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Total admins" value={adminCount} />
        <SummaryCard label="Super admins" value={superAdminCount} />
        <SummaryCard label="Standard admins" value={adminCount - superAdminCount} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] border border-[#d8e2ee] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-[#e7f1fb] p-3 text-[#004B87]">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#12314f]">Create admin</h3>
              <p className="text-sm text-[#6a7b91]">Only super-admins can create other admin accounts.</p>
            </div>
          </div>

          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-2xl border border-[#d8e2ee] px-4 py-3 outline-none transition-colors focus:border-[#004B87]"
              placeholder="Full name"
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-2xl border border-[#d8e2ee] px-4 py-3 outline-none transition-colors focus:border-[#004B87]"
              placeholder="Email address"
              required
            />
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-2xl border border-[#d8e2ee] px-4 py-3 outline-none transition-colors focus:border-[#004B87]"
              placeholder="Temporary password"
              required
              minLength={6}
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRole })}
              className="w-full rounded-2xl border border-[#d8e2ee] px-4 py-3 outline-none transition-colors focus:border-[#004B87]"
            >
              <option value="admin">Admin</option>
              <option value="super-admin">Super Admin</option>
            </select>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#FF6600] px-5 py-3 font-semibold text-white shadow-[0_18px_35px_rgba(255,102,0,0.2)] transition-colors hover:bg-[#E55C00] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UserPlus className="h-4 w-4" />
              {saving ? 'Creating...' : 'Create admin'}
            </button>
          </form>
        </div>

        <div className="rounded-[28px] border border-[#d8e2ee] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-[#eef3f8] p-3 text-[#12314f]">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#12314f]">Current admins</h3>
              <p className="text-sm text-[#6a7b91]">Review access and remove accounts that no longer need admin privileges.</p>
            </div>
          </div>

          <div className="space-y-4">
            {admins.map((admin) => {
              const isCurrentUser = admin.email === currentUserEmail;

              return (
                <article key={admin._id} className="flex flex-col gap-4 rounded-[24px] border border-[#d8e2ee] p-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-[#12314f]">{admin.name || admin.email}</p>
                    <p className="mt-1 text-sm text-[#6a7b91]">{admin.email}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${admin.role === 'super-admin' ? 'bg-[#12314f] text-white' : 'bg-[#eef3f8] text-[#51657c]'}`}>
                        {admin.role}
                      </span>
                      {isCurrentUser && <span className="rounded-full bg-[#eefaf1] px-3 py-1 text-xs font-semibold text-[#107948]">You</span>}
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#6a7b91]">Created {new Date(admin.createdAt).toLocaleDateString()}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteAdmin(admin)}
                    disabled={isCurrentUser}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#fff1ef] px-4 py-3 font-semibold text-[#b42318] transition-colors hover:bg-[#ffe4df] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return <div className="rounded-[24px] border border-[#d8e2ee] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"><p className="text-sm text-[#6a7b91]">{label}</p><p className="mt-3 text-3xl font-bold text-[#12314f]">{value}</p></div>;
}
