import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[/api/geo] incoming headers:', Object.fromEntries(request.headers.entries()));
  }

  const country =
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('x-country-code') ||
    'XX';

  return NextResponse.json({
    country,
    isIran: country === 'IR',
  });
}
