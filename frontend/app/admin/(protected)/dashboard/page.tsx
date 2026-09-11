'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Car, ClipboardList, MessageSquare, CheckCircle2, FileClock, PackageX } from 'lucide-react';
import { fetchStats } from '../../../../lib/api';

interface Stats {
  vehicles: { published: number; draft: number; sold: number };
  consignments: { pending: number; total: number };
  contact: { new: number };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch((err) => setError(err.message || 'No pudimos cargar las estadísticas.'));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#071224]">Panel de control</h1>
      <p className="mt-1 text-sm text-gray-500">Resumen general de Degra Automotores.</p>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<Car size={22} />}
          label="Vehículos publicados"
          value={stats?.vehicles.published}
          href="/admin/vehiculos"
        />
        <StatCard icon={<FileClock size={22} />} label="Borradores" value={stats?.vehicles.draft} href="/admin/vehiculos" />
        <StatCard icon={<PackageX size={22} />} label="Vendidos" value={stats?.vehicles.sold} href="/admin/vehiculos" />
        <StatCard
          icon={<ClipboardList size={22} />}
          label="Consignaciones pendientes"
          value={stats?.consignments.pending}
          href="/admin/consignaciones"
          highlight
        />
        <StatCard
          icon={<CheckCircle2 size={22} />}
          label="Consignaciones totales"
          value={stats?.consignments.total}
          href="/admin/consignaciones"
        />
        <StatCard
          icon={<MessageSquare size={22} />}
          label="Consultas nuevas"
          value={stats?.contact.new}
          href="/admin/consultas"
          highlight
        />
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        <Link
          href="/admin/vehiculos/nuevo"
          className="rounded-2xl bg-[#071224] px-5 py-4 text-center font-semibold text-white transition hover:bg-[#1f4e96]"
        >
          + Cargar vehículo
        </Link>
        <Link
          href="/admin/consignaciones"
          className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-center font-semibold text-[#071224] transition hover:border-[#1f4e96] hover:text-[#1f4e96]"
        >
          Ver consignaciones
        </Link>
        <Link
          href="/admin/consultas"
          className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-center font-semibold text-[#071224] transition hover:border-[#1f4e96] hover:text-[#1f4e96]"
        >
          Ver consultas
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  href,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value?: number;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        highlight ? 'border-[#1f4e96]/30 bg-[#1f4e96]/5' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1f4e96]/10 text-[#1f4e96]">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-[#071224]">{value ?? '—'}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>
    </Link>
  );
}
