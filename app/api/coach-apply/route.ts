import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const JSON_FILE = path.join(DATA_DIR, 'coach-applications.json');

interface CoachApplyBody {
  lang?: string;
  fullName?: string;
  email?: string;
  telegram?: string;
  instagram?: string;
  youtube?: string;
  otherSocial?: string;
  studentsCount?: string | number;
  experience?: string;
  resume?: { fileName: string; fileType: string; base64: string } | null;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CoachApplyBody;
    const { fullName, email, telegram, studentsCount, experience } = body;

    if (!fullName || !email || !email.includes('@') || !telegram || !studentsCount || !experience) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    let applications: unknown[] = [];
    if (fs.existsSync(JSON_FILE)) {
      try {
        applications = JSON.parse(fs.readFileSync(JSON_FILE, 'utf-8'));
      } catch {
        applications = [];
      }
    }

    applications.push({
      timestamp: new Date().toISOString(),
      lang: body.lang ?? '',
      fullName,
      email,
      telegram,
      instagram: body.instagram ?? '',
      youtube: body.youtube ?? '',
      otherSocial: body.otherSocial ?? '',
      studentsCount,
      experience,
      resume: body.resume ?? null,
    });

    fs.writeFileSync(JSON_FILE, JSON.stringify(applications, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Coach apply error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
