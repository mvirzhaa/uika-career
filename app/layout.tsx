import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/providers/providers';

export const metadata: Metadata = {
  title: {
    default: 'UIKA Career Portal — Platform Karir Mahasiswa & Alumni',
    template: '%s | UIKA Career Portal',
  },
  description:
    'Platform karir resmi Universitas Ibn Khaldun Bogor. Buat CV profesional, tulis surat lamaran, dan lamar pekerjaan terbaik untuk mahasiswa dan alumni UIKA.',
  keywords: ['karir', 'lowongan kerja', 'cv', 'UIKA', 'mahasiswa', 'alumni', 'Bogor'],
  authors: [{ name: 'UIKA Career Center' }],
  openGraph: {
    title: 'UIKA Career Portal',
    description: 'Platform Karir Mahasiswa & Alumni UIKA Bogor',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
