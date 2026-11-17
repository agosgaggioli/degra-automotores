import './globals.css';

import React from 'react';
import { Analytics } from '@vercel/analytics/next';

import SiteLayout from '../components/SiteLayout';

export const metadata = {
  title: 'Degra Automotores',
  description:
    'Concesionaria Degra Automotores - Vehículos usados y financiamiento',
  icons: {
    icon: '/images/favicon.jpg',
    shortcut: '/images/favicon.jpg',
    apple: '/images/favicon.jpg',
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