import './globals.css';

import React from 'react';

import SiteLayout from '../components/SiteLayout';

export const metadata = {
  title: 'Degra Automotores',
  description:
    'Concesionaria Degra Automotores - Vehículos usados y financiamiento',
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
      </body>
    </html>
  );
}