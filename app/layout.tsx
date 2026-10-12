import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ContentProvider } from '@/lib/contentContext';
import LightEnvironment from '@/components/LightEnvironment';
import CustomCursor from '@/components/CustomCursor';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0A0D0F',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://brahmani.com'),
  title: 'Brahmani — Electrical & Solar Solutions | Powering Tomorrow',
  description:
    'Brahmani provides premium electrical, solar and power solutions for residential, commercial and industrial projects.',
  keywords: [
    'Brahmani',
    'electrical systems',
    'solar energy solutions',
    'industrial power solutions',
    'solar panels',
    'cables and wiring',
    'switchgear',
    'inverters',
    'LED lighting',
    'electrical maintenance',
    'Ahmedabad',
    'Gujarat',
    'power infrastructure'
  ],
  authors: [{ name: 'Brahmani Electrical & Solar' }],
  openGraph: {
    title: 'Brahmani — Electrical & Solar Solutions | Powering Tomorrow',
    description:
      'Brahmani provides premium electrical, solar and power solutions for residential, commercial and industrial projects.',
    url: 'https://brahmani.com',
    siteName: 'Brahmani',
    images: [
      {
        url: '/images/hero-solar-sunrise.jpg',
        width: 1200,
        height: 630,
        alt: 'Brahmani - Powering Tomorrow',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brahmani — Electrical & Solar Solutions | Powering Tomorrow',
    description:
      'Brahmani provides premium electrical, solar and power solutions for residential, commercial and industrial projects.',
    images: ['/images/hero-solar-sunrise.jpg'],
  },
  icons: {
    icon: '/images/brahmani-mark-dark.png',
    apple: '/images/brahmani-mark-dark.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} scroll-smooth`}>
      <body className="min-h-screen font-sans antialiased selection:bg-[#FFC107] selection:text-[#0A0D0F] flex flex-col transition-colors duration-700">
        <ContentProvider>
          <ThemeProvider>
            <LightEnvironment />
            <CustomCursor />
            <Navbar />
            <main className="flex-1 w-full flex flex-col">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </ContentProvider>
      </body>
    </html>
  );
}
