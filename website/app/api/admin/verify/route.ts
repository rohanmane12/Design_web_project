import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';

export async function GET() {
  const session = await requireAdminSession();
  
  if (!session) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.user?.id,
      email: session.user?.email,
      role: session.user?.role,
    },
  });
}
