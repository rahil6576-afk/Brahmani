import { NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // 1. Check against Environment Variables (.env)
    const envAdminUser = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
    const envAdminPass = (process.env.ADMIN_PASSWORD || 'admin123').trim();
    const envOwnerUser = (process.env.ADMIN_OWNER_USERNAME || 'brahmani').trim().toLowerCase();
    const envOwnerPass = (process.env.ADMIN_OWNER_PASSWORD || 'admin@2025').trim();

    let authenticated = false;
    let userRole = 'Super Admin';
    let userName = 'Lead Administrator';

    if (cleanUser === envAdminUser && cleanPass === envAdminPass) {
      authenticated = true;
      userRole = 'Super Admin';
      userName = 'Chief Operations Admin';
    } else if (cleanUser === envOwnerUser && cleanPass === envOwnerPass) {
      authenticated = true;
      userRole = 'Executive Owner';
      userName = 'Brahmani Engineering Executive';
    } else {
      // Standard hardcoded emergency fallback
      const validUsers = ['admin', 'brahmani', 'owner'];
      const validPasswords = ['admin123', 'brahmani', 'brahmani@admin', 'admin@2025'];
      if (validUsers.includes(cleanUser) && validPasswords.includes(cleanPass)) {
        authenticated = true;
      }
    }

    // 2. If Supabase is configured, check admin_users table as well
    if (!authenticated && isSupabaseConfigured()) {
      const client = getSupabaseAdmin();
      if (client) {
        const { data, error } = await client
          .from('admin_users')
          .select('id, username, name, role, is_active')
          .eq('username', cleanUser)
          .eq('is_active', true)
          .maybeSingle();

        if (!error && data) {
          // In a production setup with pgcrypto, check hash or simple auth
          authenticated = true;
          userRole = data.role || 'Super Admin';
          userName = data.name || data.username;
        }
      }
    }

    if (authenticated) {
      const token = 'token_brahmani_admin_session_' + Date.now();
      const response = NextResponse.json({
        success: true,
        user: { name: userName, role: userRole },
        token,
      });

      // Set cookie for session persistence
      response.cookies.set('brahmani_admin_token', 'active_session', {
        httpOnly: false,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid administrator credentials. Check your .env file or database.' },
      { status: 401 }
    );
  } catch (err) {
    console.error('Authentication error:', err);
    return NextResponse.json(
      { success: false, error: 'Authentication service error' },
      { status: 500 }
    );
  }
}
