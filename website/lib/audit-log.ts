import AuditLog from '@/models/AuditLog';

interface AuditLogInput {
  actorEmail: string;
  actorRole: 'admin' | 'super-admin';
  action: string;
  entityType: string;
  entityId?: string;
  entityLabel?: string;
  details?: Record<string, unknown>;
}

export async function createAuditLog(input: AuditLogInput) {
  try {
    await AuditLog.create(input);
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
