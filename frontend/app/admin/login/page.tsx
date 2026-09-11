'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../../../lib/auth-context';

export default function AdminLoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      router.replace('/admin/dashboard');
    }
  }, [loading, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'No pudimos iniciar sesión.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#071224] px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 shadow-2xl md:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1f4e96]/10 text-[#1f4e96]">
          <Lock size={26} />
        </div>

        <h1 className="mt-5 text-center text-2xl font-bold text-[#071224]">Backoffice Degra Automotores</h1>
        <p className="mt-2 text-center text-sm text-gray-500">Iniciá sesión para gestionar vehículos, consignaciones y consultas.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@degraautomotores.com"
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#1f4e96] focus:bg-white focus:ring-2 focus:ring-[#1f4e96]/10"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Contraseña</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#1f4e96] focus:bg-white focus:ring-2 focus:ring-[#1f4e96]/10"
              />
            </div>
          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#071224] px-4 py-3.5 font-semibold text-white transition hover:bg-[#1f4e96] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </main>
  );
}
