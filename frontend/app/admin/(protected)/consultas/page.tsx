'use client';

import React, { useEffect, useState } from 'react';

import {
  Search,
  Trash2,
  Phone,
  Mail,
  MessageSquare,
  Clock3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import {
  fetchAdminContact,
  updateContactMessage,
  deleteContactMessage,
  ContactMessage,
} from '../../../../lib/api';

/* =========================================
   ESTADOS
========================================= */

const STATUS_OPTIONS = [
  {
    value: 'new',
    label: 'Nueva',
  },
  {
    value: 'read',
    label: 'Leída',
  },
  {
    value: 'answered',
    label: 'Respondida',
  },
];

const STATUS_STYLE: Record<string, string> = {
  new: 'bg-amber-50 text-amber-700 border-amber-200',
  read: 'bg-blue-50 text-blue-700 border-blue-200',
  answered:
    'bg-emerald-50 text-emerald-700 border-emerald-200',
};

/* =========================================
   ASUNTOS
========================================= */

const SUBJECT_LABEL: Record<string, string> = {
  vehiculo: 'Consulta por un vehículo',
  financiacion: 'Financiación',
  consignacion: 'Consignación',
  permuta: 'Entregar usado / Permuta',
  otra: 'Otra consulta',
};

/* =========================================
   PAGINADO
========================================= */

const ITEMS_PER_PAGE = 8;

/* =========================================
   COMPONENTE
========================================= */

export default function AdminContactPage() {
  const [items, setItems] =
    useState<ContactMessage[]>([]);

  const [status, setStatus] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [page, setPage] =
    useState(1);

  /* =========================================
     PAGINADO
  ========================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      items.length / ITEMS_PER_PAGE,
    ),
  );

  const startIndex =
    (page - 1) * ITEMS_PER_PAGE;

  const endIndex =
    startIndex + ITEMS_PER_PAGE;

  const paginatedItems =
    items.slice(
      startIndex,
      endIndex,
    );

  /* =========================================
     CARGA
  ========================================= */

  function load() {
    setLoading(true);

    fetchAdminContact({
      status,
      search,
      pageSize: 100,
    })
      .then((res) =>
        setItems(res.data),
      )
      .catch((err) =>
        setError(
          err.message ||
            'No pudimos cargar las consultas.',
        ),
      )
      .finally(() =>
        setLoading(false),
      );
  }

  useEffect(() => {
    const t = setTimeout(
      load,
      250,
    );

    return () =>
      clearTimeout(t);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, search]);

  /* =========================================
     REINICIAR PAGINADO AL FILTRAR
  ========================================= */

  useEffect(() => {
    setPage(1);
  }, [status, search]);

  /* =========================================
     CORREGIR PÁGINA AL ELIMINAR
  ========================================= */

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [
    items.length,
    page,
    totalPages,
  ]);

  /* =========================================
     CAMBIAR ESTADO
  ========================================= */

  async function handleStatusChange(
    id: string,
    newStatus: string,
  ) {
    try {
      const { data } =
        await updateContactMessage(
          id,
          {
            status: newStatus,
          },
        );

      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? data
            : i,
        ),
      );
    } catch (err: any) {
      alert(
        err.message ||
          'No pudimos actualizar el estado.',
      );
    }
  }

  /* =========================================
     MARCAR COMO LEÍDA
  ========================================= */

  async function markAsRead(
    item: ContactMessage,
  ) {
    if (item.status === 'new') {
      handleStatusChange(
        item.id,
        'read',
      );
    }
  }

  /* =========================================
     ELIMINAR
  ========================================= */

  async function handleDelete(
    id: string,
  ) {
    if (
      !confirm(
        '¿Eliminar esta consulta?',
      )
    ) {
      return;
    }

    try {
      await deleteContactMessage(
        id,
      );

      setItems((prev) =>
        prev.filter(
          (i) => i.id !== id,
        ),
      );
    } catch (err: any) {
      alert(
        err.message ||
          'No pudimos eliminar la consulta.',
      );
    }
  }

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="min-h-full">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <div className="flex items-center gap-1.5 text-[#1f4e96]">

            <MessageSquare
              size={14}
            />

            <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
              Atención comercial
            </span>

          </div>

          <h1 className="mt-1.5 text-xl font-semibold tracking-tight text-[#071224]">
            Consultas
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Mensajes recibidos desde el formulario de contacto y las fichas de vehículos.
          </p>

        </div>

        {/* CONTADOR */}

        <div className="inline-flex h-8 w-fit items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] text-slate-500">

          <span className="font-semibold text-[#071224]">
            {items.length}
          </span>

          consultas

        </div>

      </div>

      {/* =====================================
          FILTROS
      ===================================== */}

      <div className="mt-5 flex flex-col gap-2.5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row">

        {/* BUSCADOR */}

        <div className="relative min-w-0 flex-1">

          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Buscar por nombre, email, mensaje..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value,
              )
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

        {/* ESTADO */}

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value,
            )
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
            focus:ring-2
            focus:ring-[#1f4e96]/10
          "
        >

          <option value="">
            Todos los estados
          </option>

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
          CONSULTAS
      ===================================== */}

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* CABECERA */}

        <div className="flex h-10 items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4">

          <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-500">
            Mensajes recibidos
          </span>

          {!loading && (
            <span className="text-[10px] text-slate-400">
              {items.length}{' '}
              {items.length === 1
                ? 'resultado'
                : 'resultados'}
            </span>
          )}

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="flex min-h-[150px] items-center justify-center">

            <p className="text-xs text-slate-400">
              Cargando...
            </p>

          </div>

        ) : items.length === 0 ? (

          /* VACÍO */

          <div className="flex min-h-[180px] items-center justify-center px-4">

            <div className="flex max-w-sm flex-col items-center text-center">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400">

                <MessageSquare
                  size={16}
                />

              </div>

              <p className="mt-2.5 text-xs font-semibold text-slate-600">
                No hay consultas todavía
              </p>

              <p className="mt-1 text-[10px] leading-4 text-slate-400">
                Los mensajes enviados desde la web aparecerán en este listado.
              </p>

            </div>

          </div>

        ) : (

          /* LISTADO */

          <div className="divide-y divide-slate-100">

            {paginatedItems.map(
              (item) => (

                <div
                  key={item.id}
                  onClick={() =>
                    markAsRead(
                      item,
                    )
                  }
                  className="
                    group
                    cursor-pointer
                    px-4
                    py-3
                    transition-colors
                    hover:bg-slate-50/80
                  "
                >

                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">

                    {/* INFORMACIÓN */}

                    <div className="min-w-0 flex-1">

                      {/* NOMBRE + ASUNTO */}

                      <div className="flex flex-wrap items-center gap-1.5">

                        {item.status ===
                          'new' && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#1f4e96]" />
                        )}

                        <p className="text-xs font-semibold text-[#071224]">
                          {item.name}
                        </p>

                        {item.subject && (
                          <span
                            className="
                              inline-flex
                              items-center
                              rounded-md
                              border
                              border-slate-200
                              bg-slate-50
                              px-1.5
                              py-0.5
                              text-[9px]
                              font-medium
                              text-slate-500
                            "
                          >
                            {SUBJECT_LABEL[
                              item.subject
                            ] ||
                              item.subject}
                          </span>
                        )}

                      </div>

                      {/* CONTACTO */}

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-slate-500">

                        <a
                          href={`tel:${item.phone}`}
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                          className="inline-flex items-center gap-1 transition hover:text-[#1f4e96]"
                        >

                          <Phone
                            size={11}
                          />

                          {item.phone}

                        </a>

                        <a
                          href={`mailto:${item.email}`}
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                          className="inline-flex items-center gap-1 transition hover:text-[#1f4e96]"
                        >

                          <Mail
                            size={11}
                          />

                          {item.email}

                        </a>

                        <span className="inline-flex items-center gap-1 text-slate-400">

                          <Clock3
                            size={10}
                          />

                          {new Date(
                            item.created_at,
                          ).toLocaleString(
                            'es-AR',
                          )}

                        </span>

                      </div>

                      {/* MENSAJE */}

                      <div className="mt-2 max-w-4xl">

                        <p className="whitespace-pre-line text-xs leading-5 text-slate-600">
                          {item.message}
                        </p>

                      </div>

                    </div>

                    {/* ACCIONES */}

                    <div
                      className="flex shrink-0 items-center gap-1.5"
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                    >

                      {/* ESTADO */}

                      <select
                        value={
                          item.status
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            item.id,
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
                          ${
                            STATUS_STYLE[
                              item.status
                            ]
                          }
                        `}
                      >

                        {STATUS_OPTIONS.map(
                          (s) => (
                            <option
                              key={
                                s.value
                              }
                              value={
                                s.value
                              }
                            >
                              {
                                s.label
                              }
                            </option>
                          ),
                        )}

                      </select>

                      {/* ELIMINAR */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            item.id,
                          )
                        }
                        aria-label="Eliminar consulta"
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

                        <Trash2
                          size={12}
                        />

                      </button>

                    </div>

                  </div>

                </div>
              ),
            )}

          </div>
        )}

        {/* =====================================
            PAGINACIÓN
        ===================================== */}

        {!loading &&
          items.length > 0 && (

          <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50/50 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">

            {/* CANTIDAD */}

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

            {/* CONTROLES */}

            <div className="flex items-center gap-1">

              {/* ANTERIOR */}

              <button
                type="button"
                disabled={page === 1}
                onClick={() =>
                  setPage(
                    (prev) =>
                      Math.max(
                        prev - 1,
                        1,
                      ),
                  )
                }
                aria-label="Página anterior"
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

                <ChevronLeft
                  size={13}
                />

              </button>

              {/* NÚMEROS */}

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
                    key={
                      pageNumber
                    }
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
                  page ===
                  totalPages
                }
                onClick={() =>
                  setPage(
                    (prev) =>
                      Math.min(
                        prev + 1,
                        totalPages,
                      ),
                  )
                }
                aria-label="Página siguiente"
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

                <ChevronRight
                  size={13}
                />

              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}