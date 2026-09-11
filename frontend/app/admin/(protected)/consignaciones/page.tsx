'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Search, Trash2, Phone, Mail, X } from 'lucide-react';
import { fetchAdminConsignments, updateConsignment, deleteConsignment, Consignment } from '../../../../lib/api';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'evaluated', label: 'Evaluado' },
  { value: 'accepted', label: 'Aceptado' },
  { value: 'rejected', label: 'Rechazado' },
];

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  contacted: 'bg-blue-100 text-blue-700',
  evaluated: 'bg-purple-100 text-purple-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function AdminConsignmentsPage() {
  const [items, setItems] = useState<Consignment[]>([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Consignment | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    fetchAdminConsignments({ status, search, pageSize: 100 })
      .then((res) => setItems(res.data))
      .catch((err) => setError(err.message || 'No pudimos cargar las consignaciones.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, search]);

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const { data } = await updateConsignment(id, { status: newStatus });
      setItems((prev) => prev.map((i) => (i.id === id ? data : i)));
      if (selected?.id === id) setSelected(data);
    } catch (err: any) {
      alert(err.message || 'No pudimos actualizar el estado.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta consignación?')) return;
    try {
      await deleteConsignment(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err: any) {
      alert(err.message || 'No pudimos eliminar la consignación.');
    }
  }

  async function saveNotes() {
    if (!selected) return;
    setSaving(true);
    try {
      const { data } = await updateConsignment(selected.id, { internal_notes: notes });
      setItems((prev) => prev.map((i) => (i.id === selected.id ? data : i)));
      setSelected(data);
    } catch (err: any) {
      alert(err.message || 'No pudimos guardar la nota.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#071224]">Consignaciones</h1>
      <p className="mt-1 text-sm text-gray-500">Vehículos que la gente quiere consignar con Degra Automotores.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, marca, email..."
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
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Contacto</th>
              <th className="px-5 py-3">Vehículo</th>
              <th className="px-5 py-3">Fecha</th>
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
                  No hay consignaciones todavía.
                </td>
              </tr>
            ) : (
              items.map((c) => (
                <tr key={c.id} className="cursor-pointer hover:bg-gray-50" onClick={() => { setSelected(c); setNotes(c.internal_notes || ''); }}>
                  <td className="px-5 py-3">
                    <p className="font-semibold text-[#071224]">
                      {c.first_name} {c.last_name}
                    </p>
                    <p className="text-xs text-gray-500">{c.phone}</p>
                  </td>
                  <td className="px-5 py-3">
                    {c.brand} {c.model} {c.version} {c.year ? `(${c.year})` : ''}
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500">
                    {new Date(c.created_at).toLocaleDateString('es-AR')}
                  </td>
                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={c.status}
                      onChange={(e) => handleStatusChange(c.id, e.target.value)}
                      className={`rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none ${STATUS_STYLE[c.status]}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-500 hover:text-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#071224]">
                  {selected.first_name} {selected.last_name}
                </h2>
                <p className="text-sm text-gray-500">
                  {selected.brand} {selected.model} {selected.version} {selected.year ? `· ${selected.year}` : ''}
                </p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700">
                <X size={22} />
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a href={`tel:${selected.phone}`} className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-[#1f4e96] hover:text-[#1f4e96]">
                <Phone size={16} /> {selected.phone}
              </a>
              <a href={`mailto:${selected.email}`} className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-[#1f4e96] hover:text-[#1f4e96]">
                <Mail size={16} /> {selected.email}
              </a>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 rounded-2xl bg-gray-50 p-4 text-sm sm:grid-cols-3">
              <Detail label="Localidad" value={selected.city} />
              <Detail label="Kilometraje" value={selected.mileage ? `${selected.mileage.toLocaleString('es-AR')} km` : '-'} />
              <Detail label="Patente" value={selected.license_plate} />
              <Detail label="Color" value={selected.color} />
              <Detail label="Combustible" value={selected.fuel} />
              <Detail label="Transmisión" value={selected.transmission} />
              <Detail
                label="Precio pretendido"
                value={
                  selected.expected_price
                    ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(
                        selected.expected_price
                      )
                    : '-'
                }
              />
            </div>

            {selected.observations && (
              <div className="mt-4">
                <p className="text-xs font-bold uppercase text-gray-400">Observaciones del cliente</p>
                <p className="mt-1 text-sm text-gray-700">{selected.observations}</p>
              </div>
            )}

            {selected.images.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-bold uppercase text-gray-400">Fotos</p>
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {selected.images.map((img) => (
                    <a key={img} href={img} target="_blank" rel="noopener noreferrer" className="relative h-20 overflow-hidden rounded-xl bg-gray-100">
                      <Image src={img} alt="" fill className="object-cover" sizes="120px" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <p className="text-xs font-bold uppercase text-gray-400">Notas internas</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#1f4e96] focus:bg-white"
                placeholder="Notas para el equipo (no las ve el cliente)..."
              />
              <button
                type="button"
                onClick={saveNotes}
                disabled={saving}
                className="mt-2 rounded-xl bg-[#071224] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f4e96] disabled:opacity-60"
              >
                {saving ? 'Guardando...' : 'Guardar nota'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-semibold text-gray-800">{value || '-'}</p>
    </div>
  );
}
