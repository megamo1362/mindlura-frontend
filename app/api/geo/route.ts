import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const country = request.headers.get('cf-ipcountry') || 'XX';
  return NextResponse.json({
    country,
    isIran: country === 'IR',
  });
}
