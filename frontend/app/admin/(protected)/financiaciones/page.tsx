'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Search, Building2 } from 'lucide-react';
import { fetchAdminFinancings, deleteFinancing, Financing } from '../../../../lib/api';

const STATUS_STYLE: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-gray-100 text-gray-600',
};

export default function AdminFinancingsPage() {
  const [items, setItems] = useState<Financing[]>([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetchAdminFinancings({ status, search })
      .then((res) => setItems(res.data))
      .catch((err) => setError(err.message || 'No pudimos cargar las financiaciones.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, search]);

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta financiación?')) return;
    setDeletingId(id);
    try {
      await deleteFinancing(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      alert(err.message || 'No pudimos eliminar la financiación.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#071224]">Financiaciones</h1>
          <p className="mt-1 text-sm text-gray-500">Los planes que se muestran en la página pública de Financiación.</p>
        </div>
        <Link
          href="/admin/financiaciones/nueva"
          className="flex items-center gap-2 rounded-xl bg-[#1f4e96] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#163b71]"
        >
          <Plus size={18} />
          Cargar financiación
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por banco, plan, marca..."
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
        </select>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Plan</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Cuotas / Tasa</th>
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
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                  No hay financiaciones cargadas todavía.
                </td>
              </tr>
            ) : (
              items.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="flex items-center gap-3 px-5 py-3">
                    <div className="relative flex h-12 w-16 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                      {f.logo ? (
                        <Image src={f.logo} alt="" fill className="object-contain p-1" sizes="64px" />
                      ) : (
                        <Building2 size={18} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[#071224]">{f.name}</p>
                      <p className="text-xs text-gray-500">{f.bank}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">{f.type === 'general' ? 'General' : f.brand}</td>
                  <td className="px-5 py-3">
                    {f.cuotas} cuotas{f.tasa ? ` · ${f.tasa}` : ''}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[f.status]}`}>
                      {f.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/financiaciones/${f.id}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-[#1f4e96] hover:text-[#1f4e96]"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        type="button"
                        disabled={deletingId === f.id}
                        onClick={() => handleDelete(f.id)}
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