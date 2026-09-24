'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import {
  Search,
  Trash2,
  Phone,
  Mail,
  X,
  CarFront,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import {
  fetchAdminConsignments,
  updateConsignment,
  deleteConsignment,
  Consignment,
} from '../../../../lib/api';

/* =========================================
   ESTADOS
========================================= */

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'evaluated', label: 'Evaluado' },
  { value: 'accepted', label: 'Aceptado' },
  { value: 'rejected', label: 'Rechazado' },
];

const STATUS_STYLE: Record<string, string> = {
  pending:
    'bg-amber-50 text-amber-700 border-amber-200',
  contacted:
    'bg-blue-50 text-blue-700 border-blue-200',
  evaluated:
    'bg-violet-50 text-violet-700 border-violet-200',
  accepted:
    'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected:
    'bg-red-50 text-red-700 border-red-200',
};

/* =========================================
   PAGINADO
========================================= */

const ITEMS_PER_PAGE = 8;

/* =========================================
   COMPONENTE
========================================= */

export default function AdminConsignmentsPage() {
  const [items, setItems] = useState<Consignment[]>([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selected, setSelected] =
    useState<Consignment | null>(null);

  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  /* PAGINADO */

  const [page, setPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(items.length / ITEMS_PER_PAGE),
  );

  const startIndex =
    (page - 1) * ITEMS_PER_PAGE;

  const endIndex =
    startIndex + ITEMS_PER_PAGE;

  const paginatedItems =
    items.slice(startIndex, endIndex);

  /* =========================================
     CARGA
  ========================================= */

  function load() {
    setLoading(true);

    fetchAdminConsignments({
      status,
      search,
      pageSize: 100,
    })
      .then((res) => setItems(res.data))
      .catch((err) =>
        setError(
          err.message ||
            'No pudimos cargar las consignaciones.',
        ),
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const t = setTimeout(load, 250);

    return () => clearTimeout(t);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, search]);

  /* =========================================
     REINICIAR PÁGINA CON FILTROS
  ========================================= */

  useEffect(() => {
    setPage(1);
  }, [status, search]);

  /* =========================================
     CORREGIR PÁGINA SI CAMBIA EL TOTAL
  ========================================= */

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [items.length, page, totalPages]);

  /* =========================================
     CAMBIAR ESTADO
  ========================================= */

  async function handleStatusChange(
    id: string,
    newStatus: string,
  ) {
    try {
      const { data } =
        await updateConsignment(id, {
          status: newStatus,
        });

      setItems((prev) =>
        prev.map((i) =>
          i.id === id ? data : i,
        ),
      );

      if (selected?.id === id) {
        setSelected(data);
      }
    } catch (err: any) {
      alert(
        err.message ||
          'No pudimos actualizar el estado.',
      );
    }
  }

  /* =========================================
     ELIMINAR
  ========================================= */

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta consignación?')) {
      return;
    }

    try {
      await deleteConsignment(id);

      setItems((prev) =>
        prev.filter((i) => i.id !== id),
      );

      if (selected?.id === id) {
        setSelected(null);
      }
    } catch (err: any) {
      alert(
        err.message ||
          'No pudimos eliminar la consignación.',
      );
    }
  }

  /* =========================================
     GUARDAR NOTAS
  ========================================= */

  async function saveNotes() {
    if (!selected) return;

    setSaving(true);

    try {
      const { data } =
        await updateConsignment(selected.id, {
          internal_notes: notes,
        });

      setItems((prev) =>
        prev.map((i) =>
          i.id === selected.id ? data : i,
        ),
      );

      setSelected(data);
    } catch (err: any) {
      alert(
        err.message ||
          'No pudimos guardar la nota.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-full">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <div className="flex items-center gap-1.5 text-[#1f4e96]">
            <CarFront size={14} />

            <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
              Gestión comercial
            </span>
          </div>

          <h1 className="mt-1.5 text-xl font-semibold tracking-tight text-[#071224]">
            Consignaciones
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Vehículos que la gente quiere consignar con Degra Automotores.
          </p>

        </div>

        <div className="inline-flex h-8 w-fit items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] text-slate-500">

          <span className="font-semibold text-[#071224]">
            {items.length}
          </span>

          consignaciones

        </div>

      </div>

      {/* =====================================
          FILTROS
      ===================================== */}

      <div className="mt-5 flex flex-col gap-2.5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row">

        <div className="relative min-w-0 flex-1">

          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Buscar por nombre, marca, email..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              h-9
              w-full
              rounded-lg
              border
              border-slate-200
              bg-slate-50
              pl-8
              pr-3
              text-xs
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

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          className="
            h-9
            min-w-[165px]
            rounded-lg
            border
            border-slate-200
            bg-slate-50
            px-3
            text-xs
            text-[#071224]
            outline-none
            transition
            focus:border-[#1f4e96]
            focus:bg-white
          "
        >
          <option value="">
            Todos los estados
          </option>

          {STATUS_OPTIONS.map((s) => (
            <option
              key={s.value}
              value={s.value}
            >
              {s.label}
            </option>
          ))}
        </select>

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
          TABLA
      ===================================== */}

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[760px] text-left">

            <thead className="border-b border-slate-200 bg-slate-50/80">

              <tr className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-500">

                <th className="px-4 py-2.5">
                  Contacto
                </th>

                <th className="px-4 py-2.5">
                  Vehículo
                </th>

                <th className="px-4 py-2.5">
                  Fecha
                </th>

                <th className="px-4 py-2.5">
                  Estado
                </th>

                <th className="px-4 py-2.5 text-right">
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading ? (

                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-xs text-slate-400"
                  >
                    Cargando...
                  </td>
                </tr>

              ) : items.length === 0 ? (

                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center"
                  >

                    <CarFront
                      size={20}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-2 text-xs font-medium text-slate-500">
                      No hay consignaciones todavía.
                    </p>

                  </td>
                </tr>

              ) : (

                paginatedItems.map((c) => (

                  <tr
                    key={c.id}
                    className="cursor-pointer transition-colors hover:bg-slate-50/80"
                    onClick={() => {
                      setSelected(c);
                      setNotes(
                        c.internal_notes || '',
                      );
                    }}
                  >

                    {/* CONTACTO */}

                    <td className="px-4 py-2.5">

                      <p className="text-xs font-semibold text-[#071224]">
                        {c.first_name}{' '}
                        {c.last_name}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-500">
                        {c.phone}
                      </p>

                    </td>

                    {/* VEHÍCULO */}

                    <td className="px-4 py-2.5">

                      <p className="text-xs font-medium text-slate-700">
                        {c.brand} {c.model}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {c.version}

                        {c.year
                          ? ` · ${c.year}`
                          : ''}
                      </p>

                    </td>

                    {/* FECHA */}

                    <td className="px-4 py-2.5 text-[10px] text-slate-500">

                      {new Date(
                        c.created_at,
                      ).toLocaleDateString(
                        'es-AR',
                      )}

                    </td>

                    {/* ESTADO */}

                    <td
                      className="px-4 py-2.5"
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                    >

                      <select
                        value={c.status}
                        onChange={(e) =>
                          handleStatusChange(
                            c.id,
                            e.target.value,
                          )
                        }
                        className={`
                          h-7
                          cursor-pointer
                          rounded-full
                          border
                          px-2
                          text-[10px]
                          font-semibold
                          outline-none
                          ${STATUS_STYLE[c.status]}
                        `}
                      >

                        {STATUS_OPTIONS.map(
                          (s) => (
                            <option
                              key={s.value}
                              value={s.value}
                            >
                              {s.label}
                            </option>
                          ),
                        )}

                      </select>

                    </td>

                    {/* ACCIONES */}

                    <td
                      className="px-4 py-2.5"
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                    >

                      <div className="flex justify-end">

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(c.id)
                          }
                          aria-label="Eliminar consignación"
                          className="
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-md
                            border
                            border-slate-200
                            text-slate-400
                            transition
                            hover:border-red-200
                            hover:bg-red-50
                            hover:text-red-500
                          "
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

        {/* =====================================
            PAGINACIÓN
        ===================================== */}

        {!loading && items.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50/50 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-[10px] text-slate-400">

              Mostrando{' '}

              <span className="font-medium text-slate-600">
                {startIndex + 1}
              </span>

              {' '}a{' '}

              <span className="font-medium text-slate-600">
                {Math.min(
                  endIndex,
                  items.length,
                )}
              </span>

              {' '}de{' '}

              <span className="font-medium text-slate-600">
                {items.length}
              </span>

            </p>

            <div className="flex items-center gap-1">

              {/* ANTERIOR */}

              <button
                type="button"
                disabled={page === 1}
                onClick={() =>
                  setPage((prev) =>
                    Math.max(
                      prev - 1,
                      1,
                    ),
                  )
                }
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-md
                  border
                  border-slate-200
                  bg-white
                  text-slate-500
                  transition
                  hover:border-[#1f4e96]/40
                  hover:text-[#1f4e96]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <ChevronLeft size={13} />
              </button>

              {/* PÁGINAS */}

              {Array.from(
                {
                  length:
                    totalPages,
                },
                (_, index) =>
                  index + 1,
              ).map(
                (pageNumber) => (

                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() =>
                      setPage(
                        pageNumber,
                      )
                    }
                    className={`
                      flex
                      h-7
                      min-w-7
                      items-center
                      justify-center
                      rounded-md
                      px-2
                      text-[10px]
                      font-semibold
                      transition
                      ${
                        page ===
                        pageNumber
                          ? 'bg-[#1f4e96] text-white'
                          : 'border border-slate-200 bg-white text-slate-500 hover:border-[#1f4e96]/40 hover:text-[#1f4e96]'
                      }
                    `}
                  >
                    {pageNumber}
                  </button>

                ),
              )}

              {/* SIGUIENTE */}

              <button
                type="button"
                disabled={
                  page === totalPages
                }
                onClick={() =>
                  setPage((prev) =>
                    Math.min(
                      prev + 1,
                      totalPages,
                    ),
                  )
                }
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-md
                  border
                  border-slate-200
                  bg-white
                  text-slate-500
                  transition
                  hover:border-[#1f4e96]/40
                  hover:text-[#1f4e96]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <ChevronRight size={13} />
              </button>

            </div>

          </div>
        )}

      </div>

      {/* =====================================
          MODAL DETALLE
      ===================================== */}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#071224]/70 p-4 backdrop-blur-[2px]"
          onClick={() =>
            setSelected(null)
          }
        >

          <div
            className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER MODAL */}

            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-5 py-4">

              <div>

                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#1f4e96]">
                  Detalle de consignación
                </span>

                <h2 className="mt-1 text-base font-semibold text-[#071224]">
                  {selected.first_name}{' '}
                  {selected.last_name}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {selected.brand}{' '}
                  {selected.model}{' '}
                  {selected.version}

                  {selected.year
                    ? ` · ${selected.year}`
                    : ''}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelected(null)
                }
                aria-label="Cerrar"
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-[#071224]"
              >
                <X size={16} />
              </button>

            </div>

            <div className="p-5">

              {/* CONTACTO */}

              <div className="grid gap-2 sm:grid-cols-2">

                <a
                  href={`tel:${selected.phone}`}
                  className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-700 transition hover:border-[#1f4e96]/50 hover:text-[#1f4e96]"
                >
                  <Phone size={13} />

                  {selected.phone}
                </a>

                <a
                  href={`mailto:${selected.email}`}
                  className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-700 transition hover:border-[#1f4e96]/50 hover:text-[#1f4e96]"
                >
                  <Mail size={13} />

                  {selected.email}
                </a>

              </div>

              {/* DATOS */}

              <div className="mt-4">

                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  Datos del vehículo
                </p>

                <div className="mt-2 grid grid-cols-2 overflow-hidden rounded-lg border border-slate-200 bg-slate-50/60 sm:grid-cols-3">

                  <Detail
                    label="Localidad"
                    value={selected.city}
                  />

                  <Detail
                    label="Kilometraje"
                    value={
                      selected.mileage
                        ? `${selected.mileage.toLocaleString(
                            'es-AR',
                          )} km`
                        : '-'
                    }
                  />

                  <Detail
                    label="Patente"
                    value={
                      selected.license_plate
                    }
                  />

                  <Detail
                    label="Color"
                    value={selected.color}
                  />

                  <Detail
                    label="Combustible"
                    value={selected.fuel}
                  />

                  <Detail
                    label="Transmisión"
                    value={
                      selected.transmission
                    }
                  />

                  <Detail
                    label="Precio pretendido"
                    value={
                      selected.expected_price
                        ? new Intl.NumberFormat(
                            'es-AR',
                            {
                              style:
                                'currency',
                              currency:
                                'ARS',
                              maximumFractionDigits: 0,
                            },
                          ).format(
                            selected.expected_price,
                          )
                        : '-'
                    }
                  />

                </div>

              </div>

              {/* OBSERVACIONES */}

              {selected.observations && (
                <div className="mt-4">

                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    Observaciones del cliente
                  </p>

                  <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">

                    <p className="text-xs leading-5 text-slate-600">
                      {selected.observations}
                    </p>

                  </div>

                </div>
              )}

              {/* FOTOS */}

              {selected.images.length > 0 && (
                <div className="mt-4">

                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    Fotos
                  </p>

                  <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6">

                    {selected.images.map(
                      (img) => (

                        <a
                          key={img}
                          href={img}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative aspect-square overflow-hidden rounded-md border border-slate-200 bg-slate-100"
                        >

                          <Image
                            src={img}
                            alt=""
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                            sizes="90px"
                          />

                        </a>

                      ),
                    )}

                  </div>

                </div>
              )}

              {/* NOTAS */}

              <div className="mt-5 border-t border-slate-200 pt-4">

                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  Notas internas
                </p>

                <textarea
                  value={notes}
                  onChange={(e) =>
                    setNotes(
                      e.target.value,
                    )
                  }
                  rows={3}
                  className="
                    mt-2
                    w-full
                    resize-none
                    rounded-lg
                    border
                    border-slate-200
                    bg-slate-50
                    px-3
                    py-2.5
                    text-xs
                    text-[#071224]
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-[#1f4e96]
                    focus:bg-white
                    focus:ring-2
                    focus:ring-[#1f4e96]/10
                  "
                  placeholder="Notas para el equipo (no las ve el cliente)..."
                />

                <div className="mt-2.5 flex justify-end">

                  <button
                    type="button"
                    onClick={saveNotes}
                    disabled={saving}
                    className="
                      inline-flex
                      h-8
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#1f4e96]
                      px-3.5
                      text-[10px]
                      font-semibold
                      text-white
                      transition
                      hover:bg-[#295eaa]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {saving
                      ? 'Guardando...'
                      : 'Guardar nota'}
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* =========================================
   DETAIL
========================================= */

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="min-h-[55px] border-b border-r border-slate-200 p-2.5">

      <p className="text-[9px] text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 text-xs font-semibold text-slate-700">
        {value || '-'}
      </p>

    </div>
  );
}