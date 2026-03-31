import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Use the NextAuth credentials endpoint for login.' },
    { status: 410 }
  );
}
