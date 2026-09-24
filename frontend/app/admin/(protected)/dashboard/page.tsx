'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import {
  Car,
  ClipboardList,
  MessageSquare,
  CheckCircle2,
  Plus,
  ArrowRight,
  LayoutDashboard,
} from 'lucide-react';

import { fetchStats } from '../../../../lib/api';

interface Stats {
  vehicles: {
    published: number;
    draft: number;
    sold: number;
  };

  consignments: {
    pending: number;
    total: number;
  };

  contact: {
    new: number;
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] =
    useState<Stats | null>(null);

  const [error, setError] =
    useState('');

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch((err) =>
        setError(
          err.message ||
            'No pudimos cargar las estadísticas.',
        ),
      );
  }, []);

  return (
    <div className="min-h-full">

      {/* =====================================
          HEADER
      ===================================== */}

      <div>

        <div className="flex items-center gap-1.5 text-[#1f4e96]">

          <LayoutDashboard size={14} />

          <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
            Administración
          </span>

        </div>

        <h1 className="mt-1.5 text-xl font-semibold tracking-tight text-[#071224]">
          Panel de control
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Resumen general de Degra Automotores.
        </p>

      </div>

      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* =====================================
          ESTADÍSTICAS
      ===================================== */}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

        {/* VEHÍCULOS */}

        <StatCard
          icon={<Car size={16} />}
          label="Vehículos publicados"
          value={stats?.vehicles.published}
          href="/admin/vehiculos"
        />

        {/* CONSIGNACIONES PENDIENTES */}

        <StatCard
          icon={<ClipboardList size={16} />}
          label="Consignaciones pendientes"
          value={stats?.consignments.pending}
          href="/admin/consignaciones"
          highlight
        />

        {/* CONSIGNACIONES TOTALES */}

        <StatCard
          icon={<CheckCircle2 size={16} />}
          label="Consignaciones totales"
          value={stats?.consignments.total}
          href="/admin/consignaciones"
        />

        {/* CONSULTAS */}

        <StatCard
          icon={<MessageSquare size={16} />}
          label="Consultas nuevas"
          value={stats?.contact.new}
          href="/admin/consultas"
          highlight
        />

      </div>

      {/* =====================================
          ACCIONES RÁPIDAS
      ===================================== */}

      <div className="mt-6">

        <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
          Acciones rápidas
        </p>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* NUEVO VEHÍCULO */}

          <Link
            href="/admin/vehiculos/nuevo"
            className="
              group
              flex
              min-h-[54px]
              items-center
              justify-between
              border-b
              border-slate-100
              px-4
              py-3
              transition
              hover:bg-slate-50
            "
          >

            <div className="flex items-center gap-3">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1f4e96] text-white">
                <Plus size={15} />
              </div>

              <div>

                <p className="text-xs font-semibold text-[#071224]">
                  Cargar vehículo
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Agregar una nueva unidad al inventario
                </p>

              </div>

            </div>

            <ArrowRight
              size={14}
              className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#1f4e96]"
            />

          </Link>

          {/* CONSIGNACIONES */}

          <Link
            href="/admin/consignaciones"
            className="
              group
              flex
              min-h-[54px]
              items-center
              justify-between
              border-b
              border-slate-100
              px-4
              py-3
              transition
              hover:bg-slate-50
            "
          >

            <div className="flex items-center gap-3">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-[#1f4e96]">
                <ClipboardList size={14} />
              </div>

              <div>

                <p className="text-xs font-semibold text-[#071224]">
                  Ver consignaciones
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Revisar solicitudes recibidas
                </p>

              </div>

            </div>

            <ArrowRight
              size={14}
              className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#1f4e96]"
            />

          </Link>

          {/* CONSULTAS */}

          <Link
            href="/admin/consultas"
            className="
              group
              flex
              min-h-[54px]
              items-center
              justify-between
              px-4
              py-3
              transition
              hover:bg-slate-50
            "
          >

            <div className="flex items-center gap-3">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-[#1f4e96]">
                <MessageSquare size={14} />
              </div>

              <div>

                <p className="text-xs font-semibold text-[#071224]">
                  Ver consultas
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Gestionar mensajes de potenciales clientes
                </p>

              </div>

            </div>

            <ArrowRight
              size={14}
              className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#1f4e96]"
            />

          </Link>

        </div>

      </div>

    </div>
  );
}

/* =========================================
   STAT CARD
========================================= */

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
      className={`
        group
        flex
        min-h-[78px]
        items-center
        justify-between
        rounded-xl
        border
        px-3.5
        py-3
        shadow-sm
        transition
        hover:border-[#1f4e96]/30
        hover:shadow
        ${
          highlight
            ? 'border-[#1f4e96]/20 bg-[#1f4e96]/[0.035]'
            : 'border-slate-200 bg-white'
        }
      `}
    >

      <div className="flex min-w-0 items-center gap-2.5">

        <div
          className={`
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            ${
              highlight
                ? 'bg-[#1f4e96] text-white'
                : 'bg-[#1f4e96]/10 text-[#1f4e96]'
            }
          `}
        >
          {icon}
        </div>

        <div className="min-w-0">

          <p className="text-lg font-semibold leading-none tracking-tight text-[#071224]">
            {value ?? '—'}
          </p>

          <p className="mt-1.5 text-[10px] font-medium leading-4 text-slate-500">
            {label}
          </p>

        </div>

      </div>

      <ArrowRight
        size={12}
        className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#1f4e96]"
      />

    </Link>
  );
}