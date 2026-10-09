-- ==============================================================================
-- BRAHMANI ELECTRICAL & SOLAR — PRODUCTION SUPABASE SCHEMA
-- ==============================================================================
-- Description: Complete schema for site CMS, engineering catalog, leads,
--              hardware inventory, settings, and administrator control center.
-- Run this script in the Supabase Dashboard -> SQL Editor -> New Query.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLE DEFINITIONS
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- A. BRAND IDENTITY & HERO SECTION
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.brand_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  name TEXT NOT NULL DEFAULT 'BRAHMANI',
  tagline TEXT NOT NULL DEFAULT 'POWERING TOMORROW',
  subtitle TEXT NOT NULL DEFAULT 'Electrical & Solar Solutions',
  hero_prefix TEXT NOT NULL DEFAULT 'POWERING',
  hero_highlight TEXT NOT NULL DEFAULT 'TOMORROW.',
  hero_description TEXT NOT NULL DEFAULT 'Precision electrical infrastructure, utility-scale commercial solar arrays, and certified industrial switchgear engineered for long-term operational resilience.',
  logo_horizontal TEXT NOT NULL DEFAULT '/images/brahmani-logo-horizontal.png',
  logo_dark TEXT NOT NULL DEFAULT '/images/brahmani-logo-dark.png',
  logo_original TEXT NOT NULL DEFAULT '/images/brahmani-logo-original.png',
  logo_mark TEXT NOT NULL DEFAULT '/images/brahmani-mark-dark.png',
  contact_phone TEXT NOT NULL DEFAULT '+91 79 4890 2811',
  contact_phone_mobile TEXT NOT NULL DEFAULT '+91 98250 14892',
  contact_email TEXT NOT NULL DEFAULT 'info@brahmani.com',
  contact_address TEXT NOT NULL DEFAULT 'Brahmani Corporate Park, S.G. Highway, Ahmedabad, Gujarat 380054, India',
  contact_city TEXT NOT NULL DEFAULT 'Ahmedabad, Gujarat, India',
  contact_hours TEXT NOT NULL DEFAULT 'Mon to Sat, 9:00 to 18:00',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- B. STATISTICS STRIP
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.statistics (
  id TEXT PRIMARY KEY,
  value NUMERIC NOT NULL DEFAULT 0,
  suffix TEXT NOT NULL DEFAULT '+',
  label TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- C. SERVICES (ENGINEERING DISCIPLINES)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  image TEXT NOT NULL DEFAULT '/images/service-electrical-systems.jpg',
  is_home BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- D. PRODUCTS (HARDWARE CATALOG)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  image TEXT NOT NULL DEFAULT '/images/product-solar-panel.jpg',
  datasheet_url TEXT,
  warranty TEXT DEFAULT '10-25 Years Standard',
  in_stock BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- E. SHOWCASE PROJECTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  capacity TEXT,
  location TEXT NOT NULL,
  client TEXT,
  completion_year TEXT,
  description TEXT NOT NULL,
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  image TEXT NOT NULL DEFAULT '/images/hero-solar-sunrise.jpg',
  is_featured BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- F. CLIENT CONSULTATION INQUIRIES & LEADS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT 'Enterprise / Commercial',
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Gujarat, India',
  project_type TEXT NOT NULL DEFAULT 'General Consultation',
  project_scale TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'New', -- 'New', 'In Review', 'Quote Sent', 'Closed'
  admin_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- G. SYSTEM SETTINGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  lead_capture_active BOOLEAN NOT NULL DEFAULT true,
  telemetry_mode TEXT NOT NULL DEFAULT 'Standard Production',
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  emergency_sla_hours INT NOT NULL DEFAULT 2,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- H. ADMIN USERS & SESSIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Super Admin',
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- I. MEDIA ASSETS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  category TEXT DEFAULT 'general',
  alt_text TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- J. ADMIN AUDIT TRAIL
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_username TEXT NOT NULL,
  action TEXT NOT NULL, -- e.g. 'UPDATE_SERVICE', 'DELETE_PRODUCT', 'CHANGE_BRAND'
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_services_sort ON public.services(sort_order);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_sort ON public.products(sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON public.inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.admin_audit_logs(created_at DESC);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Public can READ published content
CREATE POLICY "Public can view brand settings" ON public.brand_settings FOR SELECT USING (true);
CREATE POLICY "Public can view statistics" ON public.statistics FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can view media assets" ON public.media_assets FOR SELECT USING (true);

-- Public can SUBMIT inquiries from contact forms
CREATE POLICY "Public can submit inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

-- Authenticated admins / Service role have FULL access to all tables
CREATE POLICY "Full access for service role on brand_settings" ON public.brand_settings FOR ALL USING (true);
CREATE POLICY "Full access for service role on statistics" ON public.statistics FOR ALL USING (true);
CREATE POLICY "Full access for service role on services" ON public.services FOR ALL USING (true);
CREATE POLICY "Full access for service role on products" ON public.products FOR ALL USING (true);
CREATE POLICY "Full access for service role on projects" ON public.projects FOR ALL USING (true);
CREATE POLICY "Full access for service role on site_settings" ON public.site_settings FOR ALL USING (true);
CREATE POLICY "Full access for service role on inquiries" ON public.inquiries FOR ALL USING (true);
CREATE POLICY "Full access for service role on admin_users" ON public.admin_users FOR ALL USING (true);
CREATE POLICY "Full access for service role on media_assets" ON public.media_assets FOR ALL USING (true);
CREATE POLICY "Full access for service role on admin_audit_logs" ON public.admin_audit_logs FOR ALL USING (true);

-- Enable Realtime for Inquiries (Live Dashboard Notifications)
ALTER PUBLICATION supabase_realtime ADD TABLE public.inquiries;

-- ==============================================================================
-- 5. STORAGE BUCKET CONFIGURATION
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('brahmani-media', 'brahmani-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access for Media Bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'brahmani-media');

CREATE POLICY "Admin Upload for Media Bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'brahmani-media');

CREATE POLICY "Admin Delete for Media Bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'brahmani-media');

-- ==============================================================================
-- 6. INITIAL SEED DATA (Matching current Brahmani site)
-- ==============================================================================

-- Brand Settings
INSERT INTO public.brand_settings (
  id, name, tagline, subtitle, hero_prefix, hero_highlight, hero_description,
  logo_horizontal, logo_dark, logo_original, logo_mark,
  contact_phone, contact_phone_mobile, contact_email, contact_address, contact_city, contact_hours
) VALUES (
  'default',
  'BRAHMANI',
  'POWERING TOMORROW',
  'Electrical & Solar Solutions',
  'POWERING',
  'TOMORROW.',
  'Precision electrical infrastructure, utility-scale commercial solar arrays, and certified industrial switchgear engineered for long-term operational resilience.',
  '/images/brahmani-logo-horizontal.png',
  '/images/brahmani-logo-dark.png',
  '/images/brahmani-logo-original.png',
  '/images/brahmani-mark-dark.png',
  '+91 79 4890 2811',
  '+91 98250 14892',
  'info@brahmani.com',
  'Brahmani Corporate Park, S.G. Highway, Ahmedabad, Gujarat 380054, India',
  'Ahmedabad, Gujarat, India',
  'Mon to Sat, 9:00 to 18:00'
) ON CONFLICT (id) DO UPDATE SET updated_at = now();

-- Statistics
INSERT INTO public.statistics (id, value, suffix, label, description, sort_order) VALUES
  ('stat-1', 500, '+', 'PROJECTS COMPLETED', 'Executed across industrial, commercial & residential sectors', 1),
  ('stat-2', 12, ' MW+', 'SOLAR CAPACITY INSTALLED', 'Rooftop and ground-mounted utility arrays', 2),
  ('stat-3', 100, '+', 'SKILLED PROFESSIONALS', 'Certified electrical engineers & licensed technicians', 3),
  ('stat-4', 99, '%', 'CLIENT SATISFACTION', 'Guaranteed uptime and dedicated SLA support', 4)
ON CONFLICT (id) DO NOTHING;

-- Services
INSERT INTO public.services (id, number, title, tagline, description, features, specs, image, is_home, sort_order) VALUES
(
  'electrical-systems',
  '01',
  'ELECTRICAL SYSTEMS',
  'End-to-end electrical infrastructure',
  'Design, installation and maintenance of safe, efficient and reliable electrical systems for industrial and commercial facilities.',
  '["HT / LT Power Distribution", "Substation Automation", "Transformer Substations", "Busbar Trunking Systems"]'::jsonb,
  '[{"label": "Voltage Ratings", "value": "415V to 66kV"}, {"label": "Compliance", "value": "IS / IEC Standards"}, {"label": "Turnkey Warranty", "value": "5 Years Lifecycle"}]'::jsonb,
  '/images/service-electrical-systems.jpg',
  true,
  1
),
(
  'solar-solutions',
  '02',
  'SOLAR SOLUTIONS',
  'High-efficiency solar energy systems',
  'Turnkey solar EPC for industrial rooftops, ground-mounted utility installations, and captive power plants.',
  '["Rooftop Solar EPC", "Ground Mounted Plants", "Bifacial Tech Integration", "Zero-Capex RESCO Models"]'::jsonb,
  '[{"label": "Performance Ratio", "value": "> 82% Guaranteed"}, {"label": "Module Lifecycle", "value": "25-Year Linear Warranty"}, {"label": "ROI Average", "value": "2.8 - 3.4 Years"}]'::jsonb,
  '/images/service-solar-solutions.jpg',
  true,
  2
),
(
  'industrial-power',
  '03',
  'INDUSTRIAL POWER',
  'Heavy industrial electrical engineering',
  'Robust power distribution networks, HT/LT substations, motor control centers, and mission-critical power backup.',
  '["Motor Control Centers (MCC)", "PCC & Synchronization Panels", "Harmonic Mitigation Filters", "Busduct Systems"]'::jsonb,
  '[{"label": "Fault Level", "value": "Up to 65kA for 1 sec"}, {"label": "Enclosure Rating", "value": "IP54 / IP55 Tested"}, {"label": "Busbar", "value": "Electrolytic Grade E91E"}]'::jsonb,
  '/images/service-industrial-power.jpg',
  true,
  3
),
(
  'maintenance',
  '04',
  'MAINTENANCE & TESTING',
  'Predictive diagnostics and SLA response',
  'Comprehensive electrical audits, preventive thermography scans, transformer oil tests, and 24/7 breakdown recovery.',
  '["Infrared Thermography", "Transformer Dissolved Gas Test", "Relay Testing & Calibration", "Earth Pit Resistance Testing"]'::jsonb,
  '[{"label": "SLA Response", "value": "< 2 Hours Guaranteed"}, {"label": "Audit Protocol", "value": "NFPA 70B & IEEE 3007"}, {"label": "Report Turnaround", "value": "24 Hours Digital"}]'::jsonb,
  '/images/service-maintenance.jpg',
  true,
  4
),
(
  'installation',
  '05',
  'INSTALLATION & CONTAINMENT',
  'Precision cable containment & tray systems',
  'Certified raceway installations, perforated and ladder cable trays, seismic bracing, and precision earthing grid loops.',
  '["GI / Aluminium Cable Trays", "Seismic Structural Supports", "Chemical Earthing Systems", "Firestop Barrier Seals"]'::jsonb,
  '[{"label": "Coating Spec", "value": "Hot-Dip Galvanized 86µm"}, {"label": "Loading Capacity", "value": "Heavy Duty Class 3"}, {"label": "Earthing Ingot", "value": "Copper-Bonded Steel"}]'::jsonb,
  '/images/service-installation.jpg',
  false,
  5
),
(
  'energy-efficiency',
  '06',
  'ENERGY EFFICIENCY & APFC',
  'Power factor correction & tariff optimization',
  'Automated power factor panels, active harmonic filters, and power quality logging to eliminate discom penalties.',
  '["Microprocessor APFC Relays", "Detuned Harmonic Reactors", "Thyristor Switched Capacitors", "Real-Time Telemetry Cloud"]'::jsonb,
  '[{"label": "Target PF", "value": "0.99 Lag Consistent"}, {"label": "Harmonic Reduction", "value": "THD(I) < 5%"}, {"label": "Payback Period", "value": "< 8 Months"}]'::jsonb,
  '/images/service-energy-efficiency.jpg',
  false,
  6
)
ON CONFLICT (id) DO NOTHING;

-- Hardware Products
INSERT INTO public.products (id, name, subtitle, category, description, specs, image, warranty, in_stock, is_featured, sort_order) VALUES
(
  'prod-1',
  'Bifacial Mono PERC Solar Module',
  'TopCon 580W-600W Dual Glass',
  'SOLAR',
  'Tier-1 dual-glass bifacial monocrystalline module delivering up to 22.8% module efficiency and 30-year linear power warranty.',
  '[{"label": "Peak Output", "value": "580W - 600W"}, {"label": "Efficiency", "value": "22.8%"}, {"label": "Bifaciality", "value": "Up to 80%"}, {"label": "Glass", "value": "2.0mm Dual Heat-Strengthened"}]'::jsonb,
  '/images/product-solar-panel.jpg',
  '30 Years Linear Power',
  true,
  true,
  1
),
(
  'prod-2',
  'Utility String Solar Inverter',
  '100kW - 250kW Three-Phase Grid-Tied',
  'SOLAR',
  'High-yield multi-MPPT solar string inverter with IP66 protection, smart I-V curve diagnosis, and integrated AFCI arc detection.',
  '[{"label": "Max Efficiency", "value": "99.0%"}, {"label": "MPPT Trackers", "value": "12 MPPTs / 24 Inputs"}, {"label": "Protection", "value": "IP66 / Type II SPD"}, {"label": "Telemetry", "value": "RS485 / 4G / Wi-Fi"}]'::jsonb,
  '/images/product-inverter.jpg',
  '10 Years Extendable',
  true,
  true,
  2
),
(
  'prod-3',
  'Power & Control Copper Cables',
  '1.1kV to 33kV XLPE Insulated Armoured',
  'CABLES',
  'Heavy-duty electrolytic grade copper cables with cross-linked polyethylene insulation, galvanized steel armor, and zero halogen.',
  '[{"label": "Conductor", "value": "Electrolytic Copper Class 2"}, {"label": "Insulation", "value": "XLPE 90°C Rated"}, {"label": "Sheath", "value": "FRLS / LSZH Heavy Grade"}, {"label": "Standards", "value": "IS:7098 / IEC 60502"}]'::jsonb,
  '/images/product-cables.jpg',
  '5 Years Manufacturer',
  true,
  true,
  3
),
(
  'prod-4',
  'Modular HT / LT Switchgear Panels',
  'Type-Tested Form-4b Switchboards',
  'SWITCHGEAR',
  'Custom-engineered Power Control Centers (PCC) and Motor Control Centers (MCC) built with air circuit breakers and smart relays.',
  '[{"label": "Rated Current", "value": "Up to 6300A"}, {"label": "Short-Circuit", "value": "65kA for 1 sec"}, {"label": "Partitioning", "value": "Form 4b Separation"}, {"label": "Protection", "value": "Microprocessor Relays"}]'::jsonb,
  '/images/product-switchgear.jpg',
  '5 Years Commissioning',
  true,
  true,
  4
),
(
  'prod-5',
  'Industrial High-Bay LED Luminaire',
  '150W - 240W Die-Cast IP66 Fixture',
  'LIGHTING',
  'Precision engineered industrial LED luminaire with 160 lm/W luminous efficacy, surge protection, and cast aluminium cooling fins.',
  '[{"label": "Efficacy", "value": "160 lm/W"}, {"label": "CCT Options", "value": "4000K / 5700K / 6500K"}, {"label": "Surge Protection", "value": "10kV Built-In"}, {"label": "Lifespan", "value": "L70 > 60,000 Hours"}]'::jsonb,
  '/images/product-led-lighting.jpg',
  '5 Years Full Replacement',
  true,
  false,
  5
),
(
  'prod-6',
  'PLC Automation & SCADA Panel',
  'Closed-Loop Industrial Control Rack',
  'AUTOMATION',
  'Intelligent automation enclosure with programmable logic controller (PLC), HMI touchscreen, redundant power supplies, and fieldbus.',
  '[{"label": "Processor", "value": "Dual Core Industrial PLC"}, {"label": "Display", "value": "10.1 Inch Color Touch HMI"}, {"label": "Protocols", "value": "Modbus TCP / Profinet / BACnet"}, {"label": "I/O Capacity", "value": "Modular up to 512 I/O"}]'::jsonb,
  '/images/product-control-panels.jpg',
  '3 Years System Warranty',
  true,
  false,
  6
)
ON CONFLICT (id) DO NOTHING;

-- Showcase Projects
INSERT INTO public.projects (id, title, category, capacity, location, client, completion_year, description, highlights, image, is_featured, sort_order) VALUES
(
  'proj-1',
  'Cadila Pharmaceuticals Rooftop Solar',
  'SOLAR EPC',
  '2.4 MWp',
  'Dholka, Gujarat',
  'Cadila Healthcare Ltd.',
  '2024',
  'Turnkey engineering, procurement, and grid synchronization of a 2.4 MWp bifacial rooftop solar system spanning 3 production blocks.',
  '["Bifacial Mono PERC Modules", "High-Voltage Central Inverter Architecture", "Zero Production Downtime Installation"]'::jsonb,
  '/images/hero-solar-sunrise.jpg',
  true,
  1
),
(
  'proj-2',
  'Arvind Mills 66kV Substation Overhaul',
  'SUBSTATIONS',
  '66kV / 11kV',
  'Naroda, Ahmedabad',
  'Arvind Limited',
  '2023',
  'Comprehensive retrofitting and SCADA modernization of a primary 66kV intake substation with SF6 gas-insulated breakers.',
  '["SF6 Gas-Insulated Breakers", "Fiber-Optic SCADA Integration", "Harmonic Distortion Reduction to 2.1%"]'::jsonb,
  '/images/hero-engineer-panels.jpg',
  true,
  2
),
(
  'proj-3',
  'Adani Logistics Heavy Busway Distribution',
  'INDUSTRIAL',
  '4000A Busbar',
  'Mundra SEZ, Gujarat',
  'Adani Logistics SEZ',
  '2024',
  'Design and execution of compact sandwich-type aluminium busbar trunking systems across 450,000 sq.ft of automated warehousing.',
  '["4000A Sandwich Aluminium Busduct", "Seismic Class Zone 4 Containment", "Automated Plug-in Tap-off Units"]'::jsonb,
  '/images/service-electrical-systems.jpg',
  true,
  3
)
ON CONFLICT (id) DO NOTHING;

-- Site Settings
INSERT INTO public.site_settings (id, notifications_enabled, lead_capture_active, telemetry_mode, maintenance_mode, emergency_sla_hours)
VALUES ('default', true, true, 'Standard Production', false, 2)
ON CONFLICT (id) DO NOTHING;

-- Default Admin User (admin / admin123)
-- bcrypt hash of 'admin123' is '$2a$10$w.9fUomRkO/7v4oO7x8gku8iWwG3s1dYV8n9d5rZzPj9QY1XgqIOW'
INSERT INTO public.admin_users (username, name, role, password_hash)
VALUES ('admin', 'Principal Administrator', 'Super Admin', crypt('admin123', gen_salt('bf')))
ON CONFLICT (username) DO NOTHING;

-- ==============================================================================
-- SCHEMA CREATION COMPLETE!
-- Your Supabase project is now fully equipped to manage the Brahmani website.
-- ==============================================================================
