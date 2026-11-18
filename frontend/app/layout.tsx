import './globals.css';

import React from 'react';
import { Analytics } from '@vercel/analytics/react';

import SiteLayout from '../components/SiteLayout';

export const metadata = {
  metadataBase: new URL('https://www.degraautomotores.com.ar'),
  title: 'Degra Automotores',
  description:
    'Concesionaria Degra Automotores - Vehículos usados y financiamiento',
  icons: {
    icon: '/images/favicon.jpg',
    shortcut: '/images/favicon.jpg',
    apple: '/images/favicon.jpg',
  },
  openGraph: {
    title: 'Degra Automotores',
    description: 'Concesionaria Degra Automotores - Vehículos usados y financiamiento',
    url: 'https://www.degraautomotores.com.ar',
    siteName: 'Degra Automotores',
    locale: 'es_AR',
    type: 'website',
    images: ['/images/favicon.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <SiteLayout>
          {children}
        </SiteLayout>
        <Analytics />
      </body>
    </html>
  );
}