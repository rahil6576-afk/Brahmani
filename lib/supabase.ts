import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getCleanSupabaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  return raw.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
}

const supabaseUrl = getCleanSupabaseUrl();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey).trim();

/**
 * Checks if Supabase has been configured with real credentials (not placeholders).
 */
export function isSupabaseConfigured(): boolean {
  const url = getCleanSupabaseUrl();
  const key = supabaseAnonKey;
  return Boolean(
    url &&
    key &&
    !url.includes('your-project-id') &&
    !key.includes('your-supabase-anon-key')
  );
}

/**
 * Client-side / Public Supabase client instance
 */
let supabaseClientInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!supabaseClientInstance) {
    supabaseClientInstance = createClient(getCleanSupabaseUrl(), supabaseAnonKey);
  }
  return supabaseClientInstance;
}

/**
 * Server-side Admin Supabase client with elevated privileges
 */
let supabaseAdminInstance: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(getCleanSupabaseUrl(), supabaseServiceKey || supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseAdminInstance;
}

/**
 * Read all site content directly from Supabase
 */
export async function getSiteContentFromSupabase() {
  const client = getSupabaseAdmin() || getSupabase();
  if (!client) return null;

  try {
    const [brandRes, statsRes, servicesRes, productsRes, projectsRes, settingsRes] = await Promise.all([
      client.from('brand_settings').select('*').eq('id', 'default').maybeSingle(),
      client.from('statistics').select('*').order('sort_order', { ascending: true }),
      client.from('services').select('*').order('sort_order', { ascending: true }),
      client.from('products').select('*').order('sort_order', { ascending: true }),
      client.from('projects').select('*').order('sort_order', { ascending: true }),
      client.from('site_settings').select('*').eq('id', 'default').maybeSingle(),
    ]);

    if (brandRes.error && brandRes.error.code !== 'PGRST116') {
      console.warn('Supabase brand fetch failed:', brandRes.error.message);
      return null;
    }

    const brand = brandRes.data
      ? {
          name: brandRes.data.name,
          tagline: brandRes.data.tagline,
          subtitle: brandRes.data.subtitle,
          heroPrefix: brandRes.data.hero_prefix,
          heroHighlight: brandRes.data.hero_highlight,
          heroDescription: brandRes.data.hero_description,
          logoHorizontal: brandRes.data.logo_horizontal,
          logoDark: brandRes.data.logo_dark,
          logoOriginal: brandRes.data.logo_original,
          logoMark: brandRes.data.logo_mark,
          contact: {
            phone: brandRes.data.contact_phone,
            phoneMobile: brandRes.data.contact_phone_mobile,
            email: brandRes.data.contact_email,
            address: brandRes.data.contact_address,
            city: brandRes.data.contact_city,
            hours: brandRes.data.contact_hours,
            whatsapp: brandRes.data.contact_whatsapp || brandRes.data.contact_phone_mobile || '+91 98250 14892',
            facebook: brandRes.data.facebook_url || brandRes.data.contact_facebook || 'https://facebook.com',
            instagram: brandRes.data.instagram_url || brandRes.data.contact_instagram || 'https://instagram.com',
          },
        }
      : undefined;

    const statistics = (statsRes.data || []).map((s: any) => ({
      id: s.id,
      value: Number(s.value),
      suffix: s.suffix,
      label: s.label,
      description: s.description || '',
    }));

    const services = (servicesRes.data || []).map((s: any) => ({
      id: s.id,
      number: s.number,
      title: s.title,
      tagline: s.tagline || '',
      description: s.description,
      features: Array.isArray(s.features) ? s.features : [],
      specs: Array.isArray(s.specs) ? s.specs : [],
      image: s.image,
      isHome: Boolean(s.is_home),
    }));

    const products = (productsRes.data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      subtitle: p.subtitle || '',
      category: p.category,
      description: p.description,
      specs: Array.isArray(p.specs) ? p.specs : [],
      image: p.image,
      datasheetUrl: p.datasheet_url || undefined,
      warranty: p.warranty || '10-25 Years Standard',
      inStock: Boolean(p.in_stock),
      isFeatured: Boolean(p.is_featured),
    }));

    const projects = (projectsRes.data || []).map((pr: any) => ({
      id: pr.id,
      title: pr.title,
      category: pr.category,
      location: pr.location,
      scope: pr.scope || pr.description || '',
      status: pr.status || 'OPERATIONAL',
      image: pr.image,
      specs: Array.isArray(pr.specs) && pr.specs.length > 0
        ? pr.specs
        : Array.isArray(pr.highlights) && pr.highlights.length > 0 && typeof pr.highlights[0] === 'object'
        ? pr.highlights
        : (pr.highlights || []).map((h: string) => ({ label: 'Highlight', value: h })),
    }));

    const settings = settingsRes.data
      ? {
          announcementActive: Boolean(settingsRes.data.notifications_enabled ?? true),
          announcementText: 'ISO 9001:2015 Certified EPC Contractor | Approved by GEDA & Chief Electrical Inspector',
          maintenanceMode: Boolean(settingsRes.data.maintenance_mode),
        }
      : undefined;

    return {
      brand,
      statistics,
      services,
      products,
      projects,
      settings,
    };
  } catch (err) {
    console.warn('Error reading from Supabase:', err);
    return null;
  }
}

/**
 * Save all site content directly to Supabase
 */
export async function saveSiteContentToSupabase(content: any): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) return false;

  try {
    // 1. Update Brand
    if (content.brand) {
      const b = content.brand;
      const { error: bErr } = await client.from('brand_settings').upsert({
        id: 'default',
        name: b.name,
        tagline: b.tagline,
        subtitle: b.subtitle,
        hero_prefix: b.heroPrefix,
        hero_highlight: b.heroHighlight,
        hero_description: b.heroDescription,
        logo_horizontal: b.logoHorizontal,
        logo_dark: b.logoDark,
        logo_original: b.logoOriginal,
        logo_mark: b.logoMark,
        contact_phone: b.contact?.phone,
        contact_phone_mobile: b.contact?.phoneMobile,
        contact_email: b.contact?.email,
        contact_address: b.contact?.address,
        contact_city: b.contact?.city,
        contact_hours: b.contact?.hours,
        updated_at: new Date().toISOString(),
      });
      if (bErr) throw bErr;
    }

    // 2. Update Statistics
    if (Array.isArray(content.statistics)) {
      const rows = content.statistics.map((s: any, idx: number) => ({
        id: s.id,
        value: s.value,
        suffix: s.suffix,
        label: s.label,
        description: s.description,
        sort_order: idx + 1,
        updated_at: new Date().toISOString(),
      }));
      const { error: sErr } = await client.from('statistics').upsert(rows);
      if (sErr) throw sErr;

      // Clean up deleted statistics
      const currentIds = rows.map((r: any) => r.id);
      const { data: existing } = await client.from('statistics').select('id');
      if (existing) {
        const toDelete = existing.map((e: any) => e.id).filter((id: string) => !currentIds.includes(id));
        if (toDelete.length > 0) {
          await client.from('statistics').delete().in('id', toDelete);
        }
      }
    }

    // 3. Update Services
    if (Array.isArray(content.services)) {
      const rows = content.services.map((s: any, idx: number) => ({
        id: s.id,
        number: s.number,
        title: s.title,
        tagline: s.tagline,
        description: s.description,
        features: s.features,
        specs: s.specs,
        image: s.image,
        is_home: Boolean(s.isHome),
        sort_order: idx + 1,
        updated_at: new Date().toISOString(),
      }));
      const { error: srvErr } = await client.from('services').upsert(rows);
      if (srvErr) throw srvErr;

      // Clean up deleted services
      const currentIds = rows.map((r: any) => r.id);
      const { data: existing } = await client.from('services').select('id');
      if (existing) {
        const toDelete = existing.map((e: any) => e.id).filter((id: string) => !currentIds.includes(id));
        if (toDelete.length > 0) {
          await client.from('services').delete().in('id', toDelete);
        }
      }
    }

    // 4. Update Products
    if (Array.isArray(content.products)) {
      const rows = content.products.map((p: any, idx: number) => ({
        id: p.id,
        name: p.name,
        subtitle: p.subtitle,
        category: p.category,
        description: p.description,
        specs: p.specs,
        image: p.image,
        datasheet_url: p.datasheetUrl,
        warranty: p.warranty,
        in_stock: Boolean(p.inStock),
        is_featured: Boolean(p.isFeatured),
        sort_order: idx + 1,
        updated_at: new Date().toISOString(),
      }));
      const { error: pErr } = await client.from('products').upsert(rows);
      if (pErr) throw pErr;

      // Clean up deleted products
      const currentIds = rows.map((r: any) => r.id);
      const { data: existing } = await client.from('products').select('id');
      if (existing) {
        const toDelete = existing.map((e: any) => e.id).filter((id: string) => !currentIds.includes(id));
        if (toDelete.length > 0) {
          await client.from('products').delete().in('id', toDelete);
        }
      }
    }

    // 5. Update Projects
    if (Array.isArray(content.projects)) {
      const rows = content.projects.map((pr: any, idx: number) => ({
        id: pr.id,
        title: pr.title,
        category: pr.category,
        location: pr.location,
        description: pr.scope || pr.description || '',
        highlights: Array.isArray(pr.specs) ? pr.specs : pr.highlights || [],
        image: pr.image,
        sort_order: idx + 1,
        updated_at: new Date().toISOString(),
      }));
      const { error: prErr } = await client.from('projects').upsert(rows);
      if (prErr) throw prErr;

      // Clean up deleted projects
      const currentIds = rows.map((r: any) => r.id);
      const { data: existing } = await client.from('projects').select('id');
      if (existing) {
        const toDelete = existing.map((e: any) => e.id).filter((id: string) => !currentIds.includes(id));
        if (toDelete.length > 0) {
          await client.from('projects').delete().in('id', toDelete);
        }
      }
    }

    // 6. Update Settings
    if (content.settings) {
      const st = content.settings;
      const { error: setErr } = await client.from('site_settings').upsert({
        id: 'default',
        notifications_enabled: st.announcementActive ?? true,
        lead_capture_active: true,
        telemetry_mode: 'Standard Production',
        maintenance_mode: Boolean(st.maintenanceMode),
        emergency_sla_hours: 2,
        updated_at: new Date().toISOString(),
      });
      if (setErr) throw setErr;
    }

    return true;
  } catch (err: any) {
    console.error('Failed to save to Supabase:', err?.message || err);
    return false;
  }
}
