'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Car, ClipboardList, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

const links = [
  { href: '/admin/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/admin/vehiculos', label: 'Vehículos', icon: Car },
  { href: '/admin/consignaciones', label: 'Consignaciones', icon: ClipboardList },
  { href: '/admin/consultas', label: 'Consultas', icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col border-r border-white/10 bg-[#071224] text-white">
      <div className="p-6">
        <p className="text-lg font-bold">Degra Automotores</p>
        <p className="text-xs text-gray-400">Backoffice</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                active ? 'bg-[#1f4e96] text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
        <p className="truncate text-xs text-gray-400">{user?.email}</p>
        <button
          type="button"
          onClick={logout}
          className="mt-3 flex w-full items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-red-500 hover:text-red-400"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
