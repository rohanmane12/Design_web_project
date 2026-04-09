import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !['admin', 'super-admin'].includes(session.user.role)) {
    return null;
  }

  return session;
}

export async function requireSuperAdminSession() {
  const session = await requireAdminSession();

  if (!session?.user?.email || session.user.role !== 'super-admin') {
    return null;
  }

  return session;
}
