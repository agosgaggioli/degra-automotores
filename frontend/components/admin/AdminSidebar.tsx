'use client';

import React from 'react';

import Link from 'next/link';

import { usePathname } from 'next/navigation';


import { LayoutDashboard, Car, ClipboardList, MessageSquare, CreditCard, LogOut } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

const links = [
  { href: '/admin/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/admin/vehiculos', label: 'Vehículos', icon: Car },
  { href: '/admin/financiaciones', label: 'Financiaciones', icon: CreditCard },
  { href: '/admin/consignaciones', label: 'Consignaciones', icon: ClipboardList },
  { href: '/admin/consultas', label: 'Consultas', icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const { user, logout } = useAuth();

  return (
    <aside
      className="
        sticky
        top-0
        flex
        h-screen
        w-60
        shrink-0
        flex-col
        overflow-hidden
        border-r
        border-white/10
        bg-[#071224]
        text-white
      "
    >

      {/* =====================================
          LOGO / HEADER
      ===================================== */}

      <div className="border-b border-white/10 px-4 py-4">

        <div className="flex items-center gap-2.5">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1f4e96]">

            <Car
              size={15}
              strokeWidth={2}
            />

          </div>

          <div className="min-w-0">

            <p className="truncate text-[13px] font-semibold text-white">
              Degra Automotores
            </p>

            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-slate-500">
              Backoffice
            </p>

          </div>

        </div>

      </div>

      {/* =====================================
          NAVEGACIÓN
      ===================================== */}

      <nav className="flex-1 overflow-y-auto px-2.5 py-3">

        <p className="mb-2 px-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
          Administración
        </p>

        <div className="space-y-1">

          {links.map(
            ({
              href,
              label,
              icon: Icon,
            }) => {
              const active =
                pathname === href ||
                pathname?.startsWith(
                  `${href}/`,
                );

              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    flex
                    h-9
                    items-center
                    gap-2.5
                    rounded-lg
                    px-3
                    text-[11px]
                    font-semibold
                    transition
                    ${
                      active
                        ? 'bg-[#1f4e96] text-white'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >

                  <Icon
                    size={14}
                    strokeWidth={2}
                  />

                  <span>
                    {label}
                  </span>

                </Link>
              );
            },
          )}

        </div>

      </nav>

      {/* =====================================
          USUARIO
      ===================================== */}

      <div className="shrink-0 border-t border-white/10 p-3">

        <div className="px-1">

          <p className="truncate text-[11px] font-semibold text-white">
            {user?.name}
          </p>

          <p className="mt-0.5 truncate text-[9px] text-slate-500">
            {user?.email}
          </p>

        </div>

        {/* CERRAR SESIÓN */}

        <button
          type="button"
          onClick={logout}
          className="
            mt-2.5
            flex
            h-8
            w-full
            items-center
            gap-2
            rounded-lg
            border
            border-white/10
            px-3
            text-[10px]
            font-semibold
            text-slate-400
            transition
            hover:border-red-500/40
            hover:bg-red-500/5
            hover:text-red-400
          "
        >

          <LogOut
            size={13}
          />

          Cerrar sesión

        </button>

      </div>

    </aside>
  );
}