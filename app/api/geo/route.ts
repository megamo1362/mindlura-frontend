import { NextRequest, NextResponse } from 'next/server';
import { resolveCountry } from '@/lib/geo';

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[/api/geo] incoming headers:', Object.fromEntries(request.headers.entries()));
  }

  const country = resolveCountry((name) => request.headers.get(name));

  return NextResponse.json({
    country,
    isIran: country === 'IR',
  });
}
