import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Use the NextAuth client signOut() flow for logout.' },
    { status: 410 }
  );
}
