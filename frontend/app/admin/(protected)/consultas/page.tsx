'use client';

import React, { useEffect, useState } from 'react';
import { Search, Trash2, Phone, Mail } from 'lucide-react';
import { fetchAdminContact, updateContactMessage, deleteContactMessage, ContactMessage } from '../../../../lib/api';

const STATUS_OPTIONS = [
  { value: 'new', label: 'Nueva' },
  { value: 'read', label: 'Leída' },
  { value: 'answered', label: 'Respondida' },
];

const STATUS_STYLE: Record<string, string> = {
  new: 'bg-yellow-100 text-yellow-700',
  read: 'bg-blue-100 text-blue-700',
  answered: 'bg-green-100 text-green-700',
};

const SUBJECT_LABEL: Record<string, string> = {
  vehiculo: 'Consulta por un vehículo',
  financiacion: 'Financiación',
  consignacion: 'Consignación',
  permuta: 'Entregar usado / Permuta',
  otra: 'Otra consulta',
};

export default function AdminContactPage() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    fetchAdminContact({ status, search, pageSize: 100 })
      .then((res) => setItems(res.data))
      .catch((err) => setError(err.message || 'No pudimos cargar las consultas.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, search]);

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const { data } = await updateContactMessage(id, { status: newStatus });
      setItems((prev) => prev.map((i) => (i.id === id ? data : i)));
    } catch (err: any) {
      alert(err.message || 'No pudimos actualizar el estado.');
    }
  }

  async function markAsRead(item: ContactMessage) {
    if (item.status === 'new') {
      handleStatusChange(item.id, 'read');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta consulta?')) return;
    try {
      await deleteContactMessage(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      alert(err.message || 'No pudimos eliminar la consulta.');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#071224]">Consultas</h1>
      <p className="mt-1 text-sm text-gray-500">Mensajes recibidos desde el formulario de contacto y las fichas de vehículos.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email, mensaje..."
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

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-center text-sm text-gray-400">Cargando...</p>
        ) : items.length === 0 ? (
          <p className="rounded-2xl border border-gray-200 bg-white px-5 py-10 text-center text-sm text-gray-400">
            No hay consultas todavía.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              onClick={() => markAsRead(item)}
              className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-[#1f4e96]/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[#071224]">{item.name}</p>
                    {item.subject && (
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                        {SUBJECT_LABEL[item.subject] || item.subject}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                    <a href={`tel:${item.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 hover:text-[#1f4e96]">
                      <Phone size={13} /> {item.phone}
                    </a>
                    <a href={`mailto:${item.email}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 hover:text-[#1f4e96]">
                      <Mail size={13} /> {item.email}
                    </a>
                    <span>{new Date(item.created_at).toLocaleString('es-AR')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className={`rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none ${STATUS_STYLE[item.status]}`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-500 hover:text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <p className="mt-3 whitespace-pre-line text-sm text-gray-700">{item.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
