import { NextResponse, type NextRequest } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'sfl_admin';
const MAX_AGE_SECONDS = 60 * 60 * 8;

function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error('ADMIN_PASSWORD is not set');
  return secret;
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export function verifyAdminPassword(submitted: string): boolean {
  return safeEqual(submitted, getSecret());
}

export function makeSessionToken(): string {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${sign(issuedAt)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [issuedAt, sig] = token.split('.');
  if (!issuedAt || !sig) return false;
  const age = Date.now() - parseInt(issuedAt, 10);
  if (!Number.isFinite(age) || age < 0 || age > MAX_AGE_SECONDS * 1000) return false;
  return safeEqual(sig, sign(issuedAt));
}

export function isAdminRequest(request: NextRequest): boolean {
  return verifySessionToken(request.cookies.get(COOKIE_NAME)?.value);
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function setAdminCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: COOKIE_NAME,
    value: makeSessionToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
  return response;
}

export function clearAdminCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return response;
}
