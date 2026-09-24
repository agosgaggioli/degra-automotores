'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react';

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
      setError(
        err.message ||
          'No pudimos iniciar sesión.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#071224] px-4 py-8">

      {/* DETALLES DE FONDO */}

      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#1f4e96]/10 blur-[100px]" />

      <div className="pointer-events-none absolute bottom-[-120px] right-[-80px] h-72 w-72 rounded-full bg-[#3169b7]/10 blur-[100px]" />

      {/* LOGIN */}

      <div className="relative w-full max-w-[380px]">

        {/* MARCA */}

        <div className="mb-5 text-center">

          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg border border-[#3169b7]/30 bg-[#1f4e96]/10 text-blue-300">
            <ShieldCheck size={18} />
          </div>

          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-300">
            Degra Automotores
          </p>

        </div>

        {/* CARD */}

        <div className="rounded-xl border border-white/10 bg-white p-6 shadow-2xl sm:p-7">

          <div>

            <h1 className="text-xl font-semibold tracking-tight text-[#071224]">
              Iniciar sesión
            </h1>

            <p className="mt-1.5 text-xs leading-5 text-slate-500">
              Ingresá al backoffice para gestionar vehículos,
              consignaciones y consultas.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >

            {/* EMAIL */}

            <div>

              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Email
              </label>

              <div className="relative">

                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="admin@degraautomotores.com"
                  className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-slate-200
                    bg-slate-50
                    pl-9
                    pr-3
                    text-sm
                    text-[#071224]
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-[#1f4e96]
                    focus:bg-white
                    focus:ring-2
                    focus:ring-[#1f4e96]/10
                  "
                />

              </div>

            </div>

            {/* CONTRASEÑA */}

            <div>

              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Contraseña
              </label>

              <div className="relative">

                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="••••••••"
                  className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-slate-200
                    bg-slate-50
                    pl-9
                    pr-3
                    text-sm
                    text-[#071224]
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-[#1f4e96]
                    focus:bg-white
                    focus:ring-2
                    focus:ring-[#1f4e96]/10
                  "
                />

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                <p className="text-xs font-medium text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* BOTÓN */}

            <button
              type="submit"
              disabled={submitting}
              className="
                flex
                h-10
                w-full
                items-center
                justify-center
                rounded-lg
                bg-[#1f4e96]
                px-4
                text-xs
                font-semibold
                text-white
                transition
                hover:bg-[#295eaa]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {submitting
                ? 'Ingresando...'
                : 'Iniciar sesión'}
            </button>

          </form>

        </div>

        {/* PIE */}

        <p className="mt-4 text-center text-[10px] text-slate-500">
          Acceso exclusivo para administración
        </p>

      </div>

    </main>
  );
}