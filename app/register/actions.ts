'use server';

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CSV_FILE = path.join(DATA_DIR, 'waitlist.csv');

export async function getWaitlistCount(): Promise<number> {
  try {
    if (!fs.existsSync(CSV_FILE)) return 0;
    const content = fs.readFileSync(CSV_FILE, 'utf-8');
    const lines = content.trim().split('\n').filter(Boolean);
    return Math.max(0, lines.length - 1); // subtract header row
  } catch {
    return 0;
  }
}

export async function submitWaitlist(
  email: string,
  lang: string
): Promise<{ success: boolean; error?: string }> {
  if (!email || !email.includes('@') || !email.includes('.')) {
    return { success: false, error: 'Invalid email' };
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(CSV_FILE)) {
      fs.writeFileSync(CSV_FILE, 'email,lang,timestamp\n', 'utf-8');
    }
    const safeEmail = email.replace(/"/g, '""');
    fs.appendFileSync(
      CSV_FILE,
      `"${safeEmail}","${lang}","${new Date().toISOString()}"\n`,
      'utf-8'
    );
    return { success: true };
  } catch (err) {
    console.error('Waitlist error:', err);
    return { success: false, error: 'Server error' };
  }
}
