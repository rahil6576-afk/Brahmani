import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { isSupabaseConfigured, getSupabaseAdmin, saveSiteContentToSupabase } from '@/lib/supabase';

const DATA_FILE = path.join(process.cwd(), 'data', 'site-content.json');

export async function GET() {
  const configured = isSupabaseConfigured();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const maskedUrl = url.includes('supabase.co') ? url : 'Not configured';

  let connected = false;
  let tableCount = 0;

  if (configured) {
    try {
      const client = getSupabaseAdmin();
      if (client) {
        const { error, count } = await client.from('brand_settings').select('*', { count: 'exact', head: true });
        if (!error) {
          connected = true;
          tableCount = 10;
        }
      }
    } catch {}
  }

  return NextResponse.json({
    configured,
    connected,
    url: maskedUrl,
    bucket: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'brahmani-media',
    schemaFile: 'supabase/schema.sql',
    tableCount,
  });
}

export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: false, error: 'Supabase credentials not configured in .env yet' },
      { status: 400 }
    );
  }

  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const content = JSON.parse(raw);
    const success = await saveSiteContentToSupabase(content);

    if (success) {
      return NextResponse.json({ success: true, message: 'All local site content successfully synced to Supabase!' });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to write content to Supabase tables. Check permissions or run supabase/schema.sql first.' },
        { status: 500 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Sync failed' },
      { status: 500 }
    );
  }
}
