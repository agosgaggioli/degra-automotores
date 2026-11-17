'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Search, Sparkles } from 'lucide-react';

import { fetchAdminVehicles, deleteVehicle, Vehicle } from '../../../../lib/api';

const FALLBACK_IMG = '/images/vehicles/onix.jpeg';

const STATUS_LABEL: Record<string, string> = {
  published: 'Publicado',
  draft: 'Borrador',
};

const STATUS_STYLE: Record<string, string> = {
  published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  draft: 'bg-amber-50 text-amber-700 border-amber-200',
};

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency || 'ARS',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function AdminZeroKmPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError('');
    fetchAdminVehicles({ search, condition: 'new', pageSize: 100 })
      .then((res) => setVehicles(res.data))
      .catch((err) => setError(err.message || 'No pudimos cargar los 0km.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const timeout = setTimeout(load, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function handleDelete(v: Vehicle) {
    if (!confirm(`¿Eliminar el 0km ${v.brand} ${v.model}? Esta acción no se puede deshacer.`)) return;
    setDeletingId(v.id);
    try {
      await deleteVehicle(v.id);
      setVehicles((prev) => prev.filter((x) => x.id !== v.id));
    } catch (err: any) {
      alert(err.message || 'No pudimos eliminar el 0km.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-full">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[#1f4e96]">
            <Sparkles size={14} />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em]">Inventario</span>
          </div>
          <h1 className="mt-1.5 text-xl font-semibold tracking-tight text-[#071224]">0km</h1>
          <p className="mt-1 text-xs text-slate-500">Gestioná los vehículos 0km que se muestran en la tienda.</p>
        </div>

        <Link
          href="/admin/0km/nuevo"
          className="inline-flex h-9 w-fit items-center justify-center gap-1.5 rounded-lg bg-[#1f4e96] px-3.5 text-[11px] font-semibold text-white transition hover:bg-[#295eaa]"
        >
          <Plus size={14} />
          Cargar 0km
        </Link>
      </div>

      {/* BUSCADOR */}
      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            aria-label="Buscar 0km"
            placeholder="Buscar por marca, modelo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs text-[#071224] outline-none transition placeholder:text-slate-400 focus:border-[#1f4e96] focus:bg-white focus:ring-2 focus:ring-[#1f4e96]/10"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">{error}</div>
      )}

      {/* TABLA */}
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex h-10 items-center justify-between border-b border-slate-200 px-4">
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#1f4e96]" />
            <span className="text-[11px] font-semibold text-[#071224]">Modelos 0km</span>
          </div>
          {!loading && (
            <span className="text-[10px] text-slate-400">
              {vehicles.length} {vehicles.length === 1 ? 'modelo' : 'modelos'}
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="border-b border-slate-200 bg-slate-50/80">
              <tr className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                <th className="px-4 py-2">Vehículo</th>
                <th className="px-4 py-2">Año modelo</th>
                <th className="px-4 py-2">Precio</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-xs text-slate-400">
                    Cargando...
                  </td>
                </tr>
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center">
                    <div className="mx-auto flex max-w-xs flex-col items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                        <Sparkles size={16} />
                      </div>
                      <p className="mt-2.5 text-xs font-semibold text-slate-600">Todavía no cargaste 0km</p>
                      <p className="mt-1 text-[10px] leading-4 text-slate-400">
                        Los modelos que cargues se publican en la sección 0km de la tienda.
                      </p>
                      <Link
                        href="/admin/0km/nuevo"
                        className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#1f4e96] px-3 text-[10px] font-semibold text-white transition hover:bg-[#295eaa]"
                      >
                        <Plus size={12} />
                        Cargar 0km
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v.id} className="transition-colors hover:bg-slate-50/80">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2.5">
                        <div className="relative h-[48px] w-[38px] shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                          <Image src={v.images?.[0] || FALLBACK_IMG} alt="" fill className="object-cover" sizes="38px" />
                        </div>
                        <div className="min-w-0">
                          <p className="max-w-[240px] truncate text-xs font-semibold text-[#071224]">
                            {v.brand} {v.model}
                          </p>
                          {v.version && (
                            <p className="mt-0.5 max-w-[240px] truncate text-[10px] text-slate-400">{v.version}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-xs font-medium text-slate-600">{v.year}</td>
                    <td className="px-4 py-2">
                      <p className="text-xs font-semibold tabular-nums text-[#071224]">
                        {formatPrice(v.price, v.currency)}
                      </p>
                      <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-slate-400">
                        {v.currency || 'ARS'}
                      </p>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex h-6 items-center rounded-full border px-2 text-[9px] font-semibold ${
                          STATUS_STYLE[v.status] || 'border-slate-200 bg-slate-50 text-slate-500'
                        }`}
                      >
                        {STATUS_LABEL[v.status] || v.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          href={`/admin/0km/${v.id}`}
                          aria-label={`Editar ${v.brand} ${v.model}`}
                          title="Editar"
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-400 transition hover:border-[#1f4e96]/40 hover:bg-blue-50/50 hover:text-[#1f4e96]"
                        >
                          <Pencil size={12} />
                        </Link>
                        <button
                          type="button"
                          disabled={deletingId === v.id}
                          onClick={() => handleDelete(v)}
                          aria-label={`Eliminar ${v.brand} ${v.model}`}
                          title="Eliminar"
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
