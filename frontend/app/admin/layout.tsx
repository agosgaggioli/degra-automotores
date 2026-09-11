import React from 'react';
import { AuthProvider } from '../../lib/auth-context';

export const metadata = {
  title: 'Backoffice | Degra Automotores',
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#071224]">
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
