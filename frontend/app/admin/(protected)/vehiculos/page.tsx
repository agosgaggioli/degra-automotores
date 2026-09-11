'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { fetchAdminVehicles, deleteVehicle, Vehicle } from '../../../../lib/api';

const FALLBACK_IMG = '/images/vehicles/onix.jpeg';

const STATUS_LABEL: Record<string, string> = {
  published: 'Publicado',
  draft: 'Borrador',
  sold: 'Vendido',
};

const STATUS_STYLE: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-gray-100 text-gray-600',
  sold: 'bg-blue-100 text-blue-700',
};

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetchAdminVehicles({ status, search, pageSize: 100 })
      .then((res) => setVehicles(res.data))
      .catch((err) => setError(err.message || 'No pudimos cargar los vehículos.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const timeout = setTimeout(load, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, search]);

  async function handleDelete(id: string) {
    if (!confirm('¿Seguro que querés eliminar este vehículo? Esta acción no se puede deshacer.')) return;
    setDeletingId(id);
    try {
      await deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch (err: any) {
      alert(err.message || 'No pudimos eliminar el vehículo.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#071224]">Vehículos</h1>
          <p className="mt-1 text-sm text-gray-500">Gestioná el stock que se ve en el sitio público.</p>
        </div>
        <Link
          href="/admin/vehiculos/nuevo"
          className="flex items-center gap-2 rounded-xl bg-[#071224] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f4e96]"
        >
          <Plus size={18} />
          Cargar vehículo
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por marca, modelo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-[#1f4e96]"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#1f4e96]"
        >
          <option value="">Todos los estados</option>
          <option value="published">Publicado</option>
          <option value="draft">Borrador</option>
          <option value="sold">Vendido</option>
        </select>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Vehículo</th>
              <th className="px-5 py-3">Año</th>
              <th className="px-5 py-3">Precio</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                  Cargando...
                </td>
              </tr>
            ) : vehicles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                  No hay vehículos cargados todavía.
                </td>
              </tr>
            ) : (
              vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="flex items-center gap-3 px-5 py-3">
                    <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-gray-100">
                      <Image src={v.images?.[0] || FALLBACK_IMG} alt="" fill className="object-cover" sizes="64px" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#071224]">
                        {v.brand} {v.model}
                      </p>
                      <p className="text-xs text-gray-500">{v.version}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">{v.year}</td>
                  <td className="px-5 py-3">
                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: v.currency || 'ARS', maximumFractionDigits: 0 }).format(v.price)}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[v.status]}`}>
                      {STATUS_LABEL[v.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/vehiculos/${v.id}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-[#1f4e96] hover:text-[#1f4e96]"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        type="button"
                        disabled={deletingId === v.id}
                        onClick={() => handleDelete(v.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-500 hover:text-red-500 disabled:opacity-50"
                      >
                        <Trash2 size={15} />
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
  );
}
