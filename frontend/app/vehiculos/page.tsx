'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import {
  Search,
  SlidersHorizontal,
  X,
  Gauge,
  Fuel,
  Settings2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

import {
  fetchVehicles,
  fetchVehicleFilters,
  Vehicle,
  VehicleFilters,
} from '../../lib/api';

/*
  12 queda mucho mejor visualmente:
  - desktop: 4 columnas x 3 filas
  - evita páginas con 1 solo vehículo en catálogos chicos
*/
const ITEMS_PER_PAGE = 12;

const FALLBACK_IMG = '/images/vehicles/onix.jpeg';

export default function VehiculosPage() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('');

  const [yearMin, setYearMin] = useState<number | ''>('');
  const [yearMax, setYearMax] = useState<number | ''>('');

  const [page, setPage] = useState(1);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const [filters, setFilters] = useState<VehicleFilters>({
    brands: [],
    transmissions: [],
    fuels: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* ================================
     CARGAR FILTROS
  ================================= */

  useEffect(() => {
    fetchVehicleFilters()
      .then(setFilters)
      .catch(() =>
        setFilters({
          brands: [],
          transmissions: [],
          fuels: [],
        }),
      );
  }, []);

  /* ================================
     CARGAR VEHÍCULOS
  ================================= */

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError('');

    fetchVehicles({
      search,
      brand: selectedBrand,
      transmission: selectedTransmission,
      fuel: selectedFuel,
      yearMin,
      yearMax,
      page,
      pageSize: ITEMS_PER_PAGE,
    })
      .then((res) => {
        if (cancelled) return;

        setVehicles(res.data);
        setTotal(res.pagination.total);

        const calculatedPages = Math.max(
          res.pagination.totalPages,
          1,
        );

        setPageCount(calculatedPages);

        /*
          Si por algún filtro o eliminación la página actual
          deja de existir, vuelve automáticamente a la última válida.
        */
        if (page > calculatedPages) {
          setPage(calculatedPages);
        }
      })
      .catch((err) => {
        if (cancelled) return;

        setError(
          err.message ||
            'No pudimos cargar los vehículos. Probá de nuevo en unos minutos.',
        );

        setVehicles([]);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    search,
    selectedBrand,
    selectedTransmission,
    selectedFuel,
    yearMin,
    yearMax,
    page,
  ]);

  /* ================================
     VOLVER A PÁGINA 1 AL FILTRAR
  ================================= */

  useEffect(() => {
    setPage(1);
  }, [
    search,
    selectedBrand,
    selectedTransmission,
    selectedFuel,
    yearMin,
    yearMax,
  ]);

  /* ================================
     LIMPIAR FILTROS
  ================================= */

  const clearFilters = () => {
    setSearch('');
    setSelectedBrand('');
    setSelectedTransmission('');
    setSelectedFuel('');
    setYearMin('');
    setYearMax('');
    setPage(1);
  };

  const hasActiveFilters =
    search !== '' ||
    selectedBrand !== '' ||
    selectedTransmission !== '' ||
    selectedFuel !== '' ||
    yearMin !== '' ||
    yearMax !== '';

  /* ================================
     PRECIO
  ================================= */

  const formatPrice = (
    price: number,
    currency: string,
  ) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency || 'ARS',
      maximumFractionDigits: 0,
    }).format(price);
  };

  /* ================================
     CAMBIO DE PÁGINA
  ================================= */

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > pageCount) return;

    setPage(newPage);

    /*
      Al cambiar de página vuelve arriba del catálogo
      en vez de quedarse abajo.
    */
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <main className="min-h-screen bg-[#071224] text-white">

      {/* ==================================
          CABECERA
      ================================== */}

      <section className="relative overflow-hidden border-b border-white/10">
        {/* luces muy suaves de fondo */}
        <div className="pointer-events-none absolute -right-48 -top-48 h-[500px] w-[500px] rounded-full bg-[#1f4e96]/20 blur-[120px]" />

        <div className="pointer-events-none absolute -left-48 top-20 h-[400px] w-[400px] rounded-full bg-blue-900/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-28 sm:px-6 lg:px-8">

          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">
            Nuestro stock
          </span>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Catálogo de vehículos
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Encontrá tu próximo vehículo entre nuestras
            unidades disponibles.
          </p>
        </div>
      </section>

      {/* ==================================
          CATÁLOGO
      ================================== */}

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">

        {/* ==================================
            FILTROS
        ================================== */}

        <div className="mb-10 rounded-2xl border border-white/10 bg-[#0c192d] p-5 shadow-2xl shadow-black/20 md:p-6">

          {/* título filtros */}
          <div className="mb-5 flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-400/10 text-blue-300">
                <SlidersHorizontal size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Filtrar vehículos
                </h2>

                <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">
                  Refiná tu búsqueda según tus preferencias
                </p>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={15} />
                Limpiar filtros
              </button>
            )}
          </div>

          {/* filtros */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {/* buscador */}
            <div className="relative sm:col-span-2">

              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                placeholder="Buscar por marca, modelo o versión..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-white/10
                  bg-[#071224]
                  pl-10
                  pr-4
                  text-sm
                  text-white
                  outline-none
                  transition
                  placeholder:text-slate-600
                  hover:border-white/20
                  focus:border-[#3169b7]
                  focus:ring-2
                  focus:ring-[#3169b7]/20
                "
              />
            </div>

            {/* marca */}
            <select
              value={selectedBrand}
              onChange={(e) =>
                setSelectedBrand(e.target.value)
              }
              className="
                h-11
                w-full
                rounded-lg
                border
                border-white/10
                bg-[#071224]
                px-3
                text-sm
                text-slate-300
                outline-none
                transition
                hover:border-white/20
                focus:border-[#3169b7]
                focus:ring-2
                focus:ring-[#3169b7]/20
              "
            >
              <option value="">
                Todas las marcas
              </option>

              {filters.brands.map((brand) => (
                <option
                  key={brand}
                  value={brand}
                  className="bg-[#071224]"
                >
                  {brand}
                </option>
              ))}
            </select>

            {/* transmisión */}
            <select
              value={selectedTransmission}
              onChange={(e) =>
                setSelectedTransmission(e.target.value)
              }
              className="
                h-11
                w-full
                rounded-lg
                border
                border-white/10
                bg-[#071224]
                px-3
                text-sm
                text-slate-300
                outline-none
                transition
                hover:border-white/20
                focus:border-[#3169b7]
                focus:ring-2
                focus:ring-[#3169b7]/20
              "
            >
              <option value="">
                Todas las cajas
              </option>

              {filters.transmissions.map(
                (transmission) => (
                  <option
                    key={transmission}
                    value={transmission}
                    className="bg-[#071224]"
                  >
                    {transmission}
                  </option>
                ),
              )}
            </select>

            {/* combustible */}
            <select
              value={selectedFuel}
              onChange={(e) =>
                setSelectedFuel(e.target.value)
              }
              className="
                h-11
                w-full
                rounded-lg
                border
                border-white/10
                bg-[#071224]
                px-3
                text-sm
                text-slate-300
                outline-none
                transition
                hover:border-white/20
                focus:border-[#3169b7]
                focus:ring-2
                focus:ring-[#3169b7]/20
              "
            >
              <option value="">
                Todos los combustibles
              </option>

              {filters.fuels.map((fuel) => (
                <option
                  key={fuel}
                  value={fuel}
                  className="bg-[#071224]"
                >
                  {fuel}
                </option>
              ))}
            </select>

            {/* año desde */}
            <input
              type="number"
              placeholder="Año desde"
              value={yearMin}
              min={1980}
              max={new Date().getFullYear()}
              onChange={(e) =>
                setYearMin(
                  e.target.value
                    ? Number(e.target.value)
                    : '',
                )
              }
              className="
                h-11
                w-full
                rounded-lg
                border
                border-white/10
                bg-[#071224]
                px-3
                text-sm
                text-slate-300
                outline-none
                transition
                placeholder:text-slate-600
                hover:border-white/20
                focus:border-[#3169b7]
                focus:ring-2
                focus:ring-[#3169b7]/20
              "
            />

            {/* año hasta */}
            <input
              type="number"
              placeholder="Año hasta"
              value={yearMax}
              min={1980}
              max={new Date().getFullYear()}
              onChange={(e) =>
                setYearMax(
                  e.target.value
                    ? Number(e.target.value)
                    : '',
                )
              }
              className="
                h-11
                w-full
                rounded-lg
                border
                border-white/10
                bg-[#071224]
                px-3
                text-sm
                text-slate-300
                outline-none
                transition
                placeholder:text-slate-600
                hover:border-white/20
                focus:border-[#3169b7]
                focus:ring-2
                focus:ring-[#3169b7]/20
              "
            />

            {/* resultado */}
            <div className="flex h-11 items-center rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm text-slate-400">
              <span className="mr-1.5 font-semibold text-white">
                {total}
              </span>

              {total === 1
                ? 'vehículo'
                : 'vehículos'}
            </div>
          </div>
        </div>

        {/* ==================================
            ERROR
        ================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* ==================================
            LOADING
        ================================== */}

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {Array.from({
              length: ITEMS_PER_PAGE,
            }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-xl border border-white/10 bg-[#0c192d]"
              >
                <div className="aspect-[4/3] bg-white/5" />

                <div className="space-y-3 p-4">
                  <div className="h-2.5 w-1/4 rounded bg-white/10" />
                  <div className="h-4 w-2/3 rounded bg-white/10" />
                  <div className="h-3 w-1/2 rounded bg-white/10" />
                  <div className="h-10 rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : vehicles.length > 0 ? (

          /* ==================================
             VEHÍCULOS
          ================================== */

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {vehicles.map((vehicle) => (
              <article
                key={vehicle.id}
                onClick={() =>
                  router.push(
                    `/vehiculos/${vehicle.slug}`,
                  )
                }
                className="
                  group
                  cursor-pointer
                  overflow-hidden
                  rounded-xl
                  border
                  border-white/10
                  bg-[#0c192d]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#3169b7]/70
                  hover:shadow-[0_18px_45px_-18px_rgba(0,0,0,0.8)]
                "
              >

                {/* imagen */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0a1526]">

                  <Image
                    src={
                      vehicle.images?.[0] ||
                      FALLBACK_IMG
                    }
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="
                      (max-width: 640px) 100vw,
                      (max-width: 1024px) 50vw,
                      (max-width: 1280px) 33vw,
                      25vw
                    "
                  />

                  {/* degradado */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />

                  {/* año */}
                  <span className="absolute left-3 top-3 rounded-md border border-white/20 bg-[#071224]/90 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm backdrop-blur">
                    {vehicle.year}
                  </span>
                </div>

                {/* info */}
                <div className="p-4">

                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300">
                    {vehicle.brand}
                  </p>

                  <h2 className="mt-1 truncate text-lg font-semibold text-white">
                    {vehicle.model}
                  </h2>

                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {vehicle.version}
                  </p>

                  {/* características */}
                  <div className="mt-4 grid grid-cols-3 border-y border-white/10 py-3">

                    <div className="flex items-center gap-1.5 border-r border-white/10 pr-2 text-[10px] text-slate-400">
                      <Gauge
                        size={13}
                        className="shrink-0 text-blue-300"
                      />

                      <span className="truncate">
                        {vehicle.mileage?.toLocaleString(
                          'es-AR',
                        )}{' '}
                        km
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 border-r border-white/10 px-2 text-[10px] text-slate-400">
                      <Settings2
                        size={13}
                        className="shrink-0 text-blue-300"
                      />

                      <span className="truncate">
                        {vehicle.transmission}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 pl-2 text-[10px] text-slate-400">
                      <Fuel
                        size={13}
                        className="shrink-0 text-blue-300"
                      />

                      <span className="truncate">
                        {vehicle.fuel}
                      </span>
                    </div>
                  </div>

                  {/* precio */}
                  <div className="mt-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                      Precio
                    </p>

                    <p className="mt-0.5 text-lg font-bold text-white">
                      {formatPrice(
                        vehicle.price,
                        vehicle.currency,
                      )}
                    </p>
                  </div>

                  {/* botón */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();

                      router.push(
                        `/vehiculos/${vehicle.slug}`,
                      );
                    }}
                    className="
                      mt-4
                      flex
                      h-10
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      bg-[#1f4e96]
                      text-xs
                      font-semibold
                      text-white
                      transition
                      hover:bg-[#295eaa]
                    "
                  >
                    Ver vehículo

                    <ArrowRight
                      size={14}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (

          /* ==================================
             SIN RESULTADOS
          ================================== */

          <div className="rounded-2xl border border-white/10 bg-[#0c192d] px-6 py-20 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-400/10">
              <Search
                size={23}
                className="text-blue-300"
              />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">
              No encontramos vehículos
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Probá modificando alguno de los filtros
              para encontrar otras unidades disponibles.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-lg bg-[#1f4e96] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#295eaa]"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* ==================================
            PAGINACIÓN
        ================================== */}

        {!loading &&
          vehicles.length > 0 &&
          pageCount > 1 && (
            <nav
              className="mt-12 flex items-center justify-center gap-2"
              aria-label="Paginación de vehículos"
            >

              {/* anterior */}
              <button
                type="button"
                aria-label="Página anterior"
                disabled={page === 1}
                onClick={() =>
                  changePage(page - 1)
                }
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-white/10
                  bg-[#0c192d]
                  text-slate-300
                  transition
                  hover:border-[#3169b7]
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
              >
                <ChevronLeft size={18} />
              </button>

              {/* números */}
              {Array.from(
                { length: pageCount },
                (_, index) => index + 1,
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  aria-label={`Ir a página ${pageNumber}`}
                  aria-current={
                    page === pageNumber
                      ? 'page'
                      : undefined
                  }
                  onClick={() =>
                    changePage(pageNumber)
                  }
                  className={`
                    h-10
                    min-w-10
                    rounded-lg
                    px-3
                    text-sm
                    font-semibold
                    transition
                    ${
                      page === pageNumber
                        ? 'bg-[#1f4e96] text-white shadow-lg shadow-blue-950/30'
                        : 'border border-white/10 bg-[#0c192d] text-slate-400 hover:border-[#3169b7] hover:text-white'
                    }
                  `}
                >
                  {pageNumber}
                </button>
              ))}

              {/* siguiente */}
              <button
                type="button"
                aria-label="Página siguiente"
                disabled={page === pageCount}
                onClick={() =>
                  changePage(page + 1)
                }
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-white/10
                  bg-[#0c192d]
                  text-slate-300
                  transition
                  hover:border-[#3169b7]
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
              >
                <ChevronRight size={18} />
              </button>
            </nav>
          )}
      </section>
    </main>
  );
}