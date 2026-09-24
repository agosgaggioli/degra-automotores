'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import {
  Plus,
  Pencil,
  Trash2,
  Search,
  CarFront,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import {
  fetchAdminVehicles,
  deleteVehicle,
  Vehicle,
} from '../../../../lib/api';

/* =========================================
   CONFIGURACIÓN VISUAL
========================================= */

const FALLBACK_IMG =
  '/images/vehicles/onix.jpeg';

const STATUS_LABEL: Record<string, string> = {
  published: 'Publicado',
};

const STATUS_STYLE: Record<string, string> = {
  published:
    'bg-emerald-50 text-emerald-700 border-emerald-200',
};

/* =========================================
   PAGINADO
========================================= */

const ITEMS_PER_PAGE = 8;

/* =========================================
   COMPONENTE
========================================= */

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] =
    useState<Vehicle[]>([]);

  const [status, setStatus] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [page, setPage] =
    useState(1);

  /* =========================================
     PAGINADO
  ========================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      vehicles.length / ITEMS_PER_PAGE,
    ),
  );

  const startIndex =
    (page - 1) * ITEMS_PER_PAGE;

  const endIndex =
    startIndex + ITEMS_PER_PAGE;

  const paginatedVehicles =
    vehicles.slice(
      startIndex,
      endIndex,
    );

  /* =========================================
     CARGA
  ========================================= */

  function load() {
    setLoading(true);

    fetchAdminVehicles({
      status,
      search,
      pageSize: 100,
    })
      .then((res) =>
        setVehicles(res.data),
      )
      .catch((err) =>
        setError(
          err.message ||
            'No pudimos cargar los vehículos.',
        ),
      )
      .finally(() =>
        setLoading(false),
      );
  }

  useEffect(() => {
    const timeout = setTimeout(
      load,
      250,
    );

    return () =>
      clearTimeout(timeout);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, search]);

  /* =========================================
     REINICIAR PÁGINA AL BUSCAR
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
    vehicles.length,
    page,
    totalPages,
  ]);

  /* =========================================
     ELIMINAR
  ========================================= */

  async function handleDelete(
    id: string,
  ) {
    if (
      !confirm(
        '¿Seguro que querés eliminar este vehículo? Esta acción no se puede deshacer.',
      )
    ) {
      return;
    }

    setDeletingId(id);

    try {
      await deleteVehicle(id);

      setVehicles((prev) =>
        prev.filter(
          (v) => v.id !== id,
        ),
      );
    } catch (err: any) {
      alert(
        err.message ||
          'No pudimos eliminar el vehículo.',
      );
    } finally {
      setDeletingId(null);
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

            <CarFront size={14} />

            <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
              Inventario
            </span>

          </div>

          <h1 className="mt-1.5 text-xl font-semibold tracking-tight text-[#071224]">
            Vehículos
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Gestioná los vehículos publicados en el sitio.
          </p>

        </div>

        {/* NUEVO VEHÍCULO */}

        <Link
          href="/admin/vehiculos/nuevo"
          className="
            inline-flex
            h-9
            w-fit
            items-center
            justify-center
            gap-1.5
            rounded-lg
            bg-[#1f4e96]
            px-3.5
            text-[11px]
            font-semibold
            text-white
            transition
            hover:bg-[#295eaa]
          "
        >
          <Plus size={14} />

          Cargar vehículo
        </Link>

      </div>

      {/* =====================================
          BUSCADOR
      ===================================== */}

      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

        <div className="relative">

          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Buscar por marca, modelo..."
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

        {/* HEADER TABLA */}

        <div className="flex h-10 items-center justify-between border-b border-slate-200 bg-white px-4">

          <div className="flex items-center gap-1.5">

            <CarFront
              size={13}
              className="text-[#1f4e96]"
            />

            <span className="text-[11px] font-semibold text-[#071224]">
              Stock de vehículos
            </span>

          </div>

          {!loading && (
            <span className="text-[10px] text-slate-400">

              {vehicles.length}{' '}

              {vehicles.length === 1
                ? 'vehículo'
                : 'vehículos'}

            </span>
          )}

        </div>

        {/* TABLA */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px] text-left">

            {/* CABECERA */}

            <thead className="border-b border-slate-200 bg-slate-50/80">

              <tr className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-500">

                <th className="px-4 py-2">
                  Vehículo
                </th>

                <th className="px-4 py-2">
                  Año
                </th>

                <th className="px-4 py-2">
                  Precio
                </th>

                <th className="px-4 py-2">
                  Estado
                </th>

                <th className="px-4 py-2 text-right">
                  Acciones
                </th>

              </tr>

            </thead>

            {/* BODY */}

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

              ) : vehicles.length === 0 ? (

                <tr>

                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center"
                  >

                    <div className="mx-auto flex max-w-xs flex-col items-center">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400">

                        <CarFront size={16} />

                      </div>

                      <p className="mt-2.5 text-xs font-semibold text-slate-600">
                        No hay vehículos cargados
                      </p>

                      <p className="mt-1 text-[10px] leading-4 text-slate-400">
                        Los vehículos que cargues aparecerán en este listado.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                paginatedVehicles.map(
                  (v) => (

                    <tr
                      key={v.id}
                      className="transition-colors hover:bg-slate-50/80"
                    >

                      {/* VEHÍCULO */}

                      <td className="px-4 py-2">

                        <div className="flex items-center gap-2.5">

                          {/* IMAGEN */}

                          <div
                            className="
                              relative
                              h-[48px]
                              w-[38px]
                              shrink-0
                              overflow-hidden
                              rounded-md
                              border
                              border-slate-200
                              bg-slate-100
                            "
                          >

                            <Image
                              src={
                                v.images?.[0] ||
                                FALLBACK_IMG
                              }
                              alt=""
                              fill
                              className="object-cover"
                              sizes="38px"
                            />

                          </div>

                          {/* INFO */}

                          <div className="min-w-0">

                            <p className="max-w-[240px] truncate text-xs font-semibold text-[#071224]">

                              {v.brand}{' '}
                              {v.model}

                            </p>

                            {v.version && (
                              <p className="mt-0.5 max-w-[240px] truncate text-[10px] text-slate-400">
                                {v.version}
                              </p>
                            )}

                          </div>

                        </div>

                      </td>

                      {/* AÑO */}

                      <td className="px-4 py-2">

                        <span className="text-xs font-medium text-slate-600">
                          {v.year}
                        </span>

                      </td>

                      {/* PRECIO */}

                      <td className="px-4 py-2">

                        <p className="text-xs font-semibold tabular-nums text-[#071224]">

                          {new Intl.NumberFormat(
                            'es-AR',
                            {
                              style:
                                'currency',
                              currency:
                                v.currency ||
                                'ARS',
                              maximumFractionDigits: 0,
                            },
                          ).format(
                            v.price,
                          )}

                        </p>

                        <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-slate-400">
                          {v.currency || 'ARS'}
                        </p>

                      </td>

                      {/* ESTADO */}

                      <td className="px-4 py-2">

                        <span
                          className={`
                            inline-flex
                            h-6
                            items-center
                            rounded-full
                            border
                            px-2
                            text-[9px]
                            font-semibold
                            ${
                              STATUS_STYLE[
                                v.status
                              ] ||
                              'border-slate-200 bg-slate-50 text-slate-500'
                            }
                          `}
                        >

                          {STATUS_LABEL[
                            v.status
                          ] ||
                            v.status}

                        </span>

                      </td>

                      {/* ACCIONES */}

                      <td className="px-4 py-2">

                        <div className="flex justify-end gap-1.5">

                          {/* EDITAR */}

                          <Link
                            href={`/admin/vehiculos/${v.id}`}
                            aria-label="Editar vehículo"
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
                              hover:border-[#1f4e96]/40
                              hover:bg-blue-50/50
                              hover:text-[#1f4e96]
                            "
                          >

                            <Pencil
                              size={12}
                            />

                          </Link>

                          {/* ELIMINAR */}

                          <button
                            type="button"
                            disabled={
                              deletingId ===
                              v.id
                            }
                            onClick={() =>
                              handleDelete(
                                v.id,
                              )
                            }
                            aria-label="Eliminar vehículo"
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
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                          >

                            <Trash2
                              size={12}
                            />

                          </button>

                        </div>

                      </td>

                    </tr>
                  ),
                )
              )}

            </tbody>

          </table>

        </div>

        {/* =====================================
            PAGINADO
        ===================================== */}

        {!loading &&
          vehicles.length > 0 && (

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
                  vehicles.length,
                )}
              </span>

              {' '}de{' '}

              <span className="font-medium text-slate-600">
                {vehicles.length}
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