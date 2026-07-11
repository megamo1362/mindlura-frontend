import { NextRequest, NextResponse } from 'next/server';
import { getBackendBaseUrl, isValidSymbol } from '@/lib/market';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;

  if (!isValidSymbol(symbol)) {
    return NextResponse.json({ error: 'Unknown symbol' }, { status: 404 });
  }

  try {
    const res = await fetch(`${getBackendBaseUrl()}/api/market-data/${symbol.toUpperCase()}/`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'No data available' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Upstream unavailable' }, { status: 502 });
  }
}
