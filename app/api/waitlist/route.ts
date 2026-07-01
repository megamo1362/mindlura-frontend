import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CSV_FILE = path.join(DATA_DIR, 'waitlist.csv');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, lang, timestamp } = body as { email?: string; lang?: string; timestamp?: string };

    if (!email || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400 });
    }

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(CSV_FILE)) {
      fs.writeFileSync(CSV_FILE, 'email,lang,timestamp\n', 'utf-8');
    }

    const safeEmail = email.replace(/"/g, '""');
    const row = `"${safeEmail}","${lang ?? ''}","${timestamp ?? new Date().toISOString()}"\n`;
    fs.appendFileSync(CSV_FILE, row, 'utf-8');

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Waitlist error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
