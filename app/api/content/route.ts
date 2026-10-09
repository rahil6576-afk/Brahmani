import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { isSupabaseConfigured, getSiteContentFromSupabase, saveSiteContentToSupabase } from '@/lib/supabase';

const DATA_FILE = path.join(process.cwd(), 'data', 'site-content.json');

export async function GET() {
  try {
    // 1. Try fetching from Supabase if configured
    if (isSupabaseConfigured()) {
      const supabaseData = await getSiteContentFromSupabase();
      if (supabaseData && supabaseData.brand) {
        // Also sync local cache
        try {
          await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
          await fs.writeFile(DATA_FILE, JSON.stringify(supabaseData, null, 2), 'utf-8');
        } catch {}
        return NextResponse.json({ success: true, data: supabaseData, source: 'supabase' });
      }
    }

    // 2. Fallback to local JSON file
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return NextResponse.json({ success: true, data, source: 'local' });
  } catch (err) {
    console.error('Failed to read site content:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to read content data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid content payload' },
        { status: 400 }
      );
    }

    // 1. Always update local JSON file as backup/cache
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(body, null, 2), 'utf-8');

    // 2. If Supabase is configured, write changes to Supabase database
    let supabaseSaved = false;
    if (isSupabaseConfigured()) {
      supabaseSaved = await saveSiteContentToSupabase(body);
    }

    return NextResponse.json({
      success: true,
      message: 'Content saved successfully',
      supabaseSynced: supabaseSaved,
    });
  } catch (err) {
    console.error('Failed to write site content:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to write content data' },
      { status: 500 }
    );
  }
}
