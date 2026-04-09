'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { History } from 'lucide-react';

interface AuditLogEntry {
  _id: string;
  actorEmail: string;
  actorRole: 'admin' | 'super-admin';
  action: string;
  entityType: string;
  entityId?: string;
  entityLabel?: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/admin/audit-logs');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch audit logs');
        }

        setLogs(data.logs || []);
      } catch (fetchError) {
        console.error(fetchError);
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to fetch audit logs');
      } finally {
        setLoading(false);
      }
    };

    void fetchLogs();
  }, []);

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#004B87]" /></div>;
  }

  return (
    <div className="space-y-8 px-4 py-6 md:px-6 lg:px-8">
      <section className="rounded-[28px] border border-[#d8e2ee] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[#eef3f8] p-3 text-[#12314f]">
            <History className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6a7b91]">Monitoring</p>
            <h2 className="mt-1 text-3xl font-bold text-[#12314f]">Audit logs</h2>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6a7b91]">Review sensitive admin actions and trace who made changes to users and enquiries.</p>
      </section>

      {error && (
        <div className="rounded-[24px] border border-[#f7c6c1] bg-[#fff3f1] p-4 text-sm text-[#912018]">
          {error}
        </div>
      )}

      <section className="space-y-4">
        {logs.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-[#d8e2ee] bg-white px-6 py-16 text-center shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <h3 className="text-xl font-bold text-[#12314f]">No audit logs yet</h3>
            <p className="mt-2 text-sm text-[#6a7b91]">Sensitive admin actions will start appearing here.</p>
          </div>
        ) : (
          logs.map((log) => (
            <article key={log._id} className="rounded-[24px] border border-[#d8e2ee] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#e7f1fb] px-3 py-1 text-xs font-semibold text-[#004B87]">{log.action}</span>
                    <span className="rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-semibold text-[#51657c]">{log.entityType}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${log.actorRole === 'super-admin' ? 'bg-[#12314f] text-white' : 'bg-[#eefaf1] text-[#107948]'}`}>{log.actorRole}</span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-[#12314f]">{log.entityLabel || log.entityId || 'Tracked action'}</p>
                  <p className="mt-1 text-sm text-[#6a7b91]">By {log.actorEmail}</p>
                  {log.details && (
                    <div className="mt-4 rounded-2xl bg-[#f8fbfe] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7b91]">Details</p>
                      <pre className="mt-3 whitespace-pre-wrap break-words text-sm text-[#334155]">{JSON.stringify(log.details, null, 2)}</pre>
                    </div>
                  )}
                </div>
                <div className="text-sm text-[#6a7b91]">
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
