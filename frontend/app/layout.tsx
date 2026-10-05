import './globals.css';

import React from 'react';
import { Analytics } from '@vercel/analytics/next';

import SiteLayout from '../components/SiteLayout';

export const metadata = {
  title: 'Degra Automotores',
  description:
    'Concesionaria Degra Automotores - Vehículos usados y financiamiento',
  icons: {
    icon: '/images/favicon.png',
    shortcut: '/images/favicon.png',
    apple: '/images/favicon.png',
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