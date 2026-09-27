import { NextRequest, NextResponse } from 'next/server';
import { clearAdminCookie, setAdminCookie, verifyAdminPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  let password: string | undefined;
  try {
    const body = await request.json();
    password = typeof body?.password === 'string' ? body.password : undefined;
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  if (!password || !verifyAdminPassword(password)) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  return setAdminCookie(NextResponse.json({ success: true }));
}

export async function DELETE() {
  return clearAdminCookie(NextResponse.json({ success: true }));
}
