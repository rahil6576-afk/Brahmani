import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brahmani Admin — Engineering Control Center',
  description: 'Administrative portal for managing Brahmani site content, hardware catalog, engineering disciplines, and client inquiries.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-white)] antialiased selection:bg-[#FFC107] selection:text-[#0A0D0F] font-segoe-admin transition-colors duration-300"
      style={{
        fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
        fontWeight: 400,
      }}
    >
      {children}
    </div>
  );
}
