import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { isSupabaseConfigured, getSupabaseAdmin } from '@/lib/supabase';

const INQUIRIES_FILE = path.join(process.cwd(), 'data', 'inquiries.json');

async function getLocalInquiriesList() {
  try {
    const raw = await fs.readFile(INQUIRIES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveLocalInquiriesList(list: any[]) {
  try {
    await fs.mkdir(path.dirname(INQUIRIES_FILE), { recursive: true });
    await fs.writeFile(INQUIRIES_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save local inquiries list:', err);
  }
}

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const client = getSupabaseAdmin();
      if (client) {
        const { data, error } = await client
          .from('inquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          const formatted = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            company: d.company,
            email: d.email,
            phone: d.phone,
            location: d.location,
            projectType: d.project_type,
            projectScale: d.project_scale,
            message: d.message,
            status: d.status,
            adminNotes: d.admin_notes || '',
            createdAt: d.created_at,
          }));

          // Sync local file
          await saveLocalInquiriesList(formatted);
          return NextResponse.json({ success: true, data: formatted, source: 'supabase' });
        }
      }
    }

    const list = await getLocalInquiriesList();
    return NextResponse.json({ success: true, data: list, source: 'local' });
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = (body.email || '').trim();
    const phone = (body.phone || '').trim();
    const fieldErrors: { email?: string; phone?: string } = {};

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!email || !emailRegex.test(email)) {
      fieldErrors.email = 'Please provide a valid corporate or contact email address.';
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (!phone || digitsOnly.length < 10) {
      fieldErrors.phone = 'Please provide a valid contact phone number with at least 10 digits.';
    }

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json({ success: false, error: 'Validation failed', fieldErrors }, { status: 400 });
    }

    const newId = `inq-${Date.now()}`;
    const createdAt = new Date().toISOString();

    const newInquiry = {
      id: newId,
      name: body.name || 'Anonymous Client',
      company: body.company || 'Enterprise / Commercial',
      email: body.email || 'Not specified',
      phone: body.phone || 'Not specified',
      location: body.location || 'Gujarat, India',
      projectType: body.projectType || 'General Consultation',
      projectScale: body.projectScale || 'Not specified',
      message: body.message || '',
      status: 'New',
      adminNotes: '',
      createdAt,
    };

    // 1. Update local cache
    const list = await getLocalInquiriesList();
    list.unshift(newInquiry);
    await saveLocalInquiriesList(list);

    // 2. Insert into Supabase if configured
    if (isSupabaseConfigured()) {
      const client = getSupabaseAdmin();
      if (client) {
        await client.from('inquiries').insert({
          id: newId,
          name: newInquiry.name,
          company: newInquiry.company,
          email: newInquiry.email,
          phone: newInquiry.phone,
          location: newInquiry.location,
          project_type: newInquiry.projectType,
          project_scale: newInquiry.projectScale,
          message: newInquiry.message,
          status: 'New',
          admin_notes: '',
          created_at: createdAt,
        });
      }
    }

    return NextResponse.json({ success: true, data: newInquiry });
  } catch (err) {
    console.error('Error creating inquiry:', err);
    return NextResponse.json({ success: false, error: 'Failed to record inquiry' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, adminNotes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing inquiry ID' }, { status: 400 });
    }

    // 1. Update local list
    const list = await getLocalInquiriesList();
    const index = list.findIndex((item: any) => item.id === id);

    if (index !== -1) {
      if (status !== undefined) list[index].status = status;
      if (adminNotes !== undefined) list[index].adminNotes = adminNotes;
      await saveLocalInquiriesList(list);
    }

    // 2. Update Supabase
    if (isSupabaseConfigured()) {
      const client = getSupabaseAdmin();
      if (client) {
        const updates: any = { updated_at: new Date().toISOString() };
        if (status !== undefined) updates.status = status;
        if (adminNotes !== undefined) updates.admin_notes = adminNotes;
        await client.from('inquiries').update(updates).eq('id', id);
      }
    }

    return NextResponse.json({
      success: true,
      data: index !== -1 ? list[index] : { id, status, adminNotes },
    });
  } catch (err) {
    console.error('Error updating inquiry:', err);
    return NextResponse.json({ success: false, error: 'Failed to update inquiry' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing ID param' }, { status: 400 });
    }

    // 1. Update local list
    let list = await getLocalInquiriesList();
    list = list.filter((item: any) => item.id !== id);
    await saveLocalInquiriesList(list);

    // 2. Delete from Supabase
    if (isSupabaseConfigured()) {
      const client = getSupabaseAdmin();
      if (client) {
        await client.from('inquiries').delete().eq('id', id);
      }
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting inquiry:', err);
    return NextResponse.json({ success: false, error: 'Failed to delete inquiry' }, { status: 500 });
  }
}
