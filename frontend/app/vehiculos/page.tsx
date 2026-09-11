'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
} from 'lucide-react';

import { fetchVehicles, fetchVehicleFilters, Vehicle, VehicleFilters } from '../../lib/api';

const ITEMS_PER_PAGE = 6;
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
  const [filters, setFilters] = useState<VehicleFilters>({ brands: [], transmissions: [], fuels: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVehicleFilters()
      .then(setFilters)
      .catch(() => setFilters({ brands: [], transmissions: [], fuels: [] }));
  }, []);

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
        setPageCount(Math.max(res.pagination.totalPages, 1));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'No pudimos cargar los vehículos. Probá de nuevo en unos minutos.');
        setVehicles([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search, selectedBrand, selectedTransmission, selectedFuel, yearMin, yearMax, page]);

  useEffect(() => {
    setPage(1);
  }, [search, selectedBrand, selectedTransmission, selectedFuel, yearMin, yearMax]);

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

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency || 'ARS',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <main className="min-h-screen bg-[#f3f4f6]">
      <section className="bg-[#071224] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
            Nuestro stock
          </span>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">Catálogo de vehículos</h1>
          <p className="mt-4 max-w-2xl text-gray-300 md:text-lg">
            Buscá por marca, modelo, año y características para encontrar el vehículo ideal para vos.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* FILTROS */}
        <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={20} className="text-[#1f4e96]" />
              <h2 className="text-lg font-bold text-gray-900">Filtrar vehículos</h2>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition hover:text-[#1f4e96]"
              >
                <X size={17} />
                Limpiar filtros
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <div className="relative sm:col-span-2 lg:col-span-3 xl:col-span-2">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar marca, modelo, versión..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1f4e96] focus:bg-white focus:ring-2 focus:ring-[#1f4e96]/10"
              />
            </div>

            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition focus:border-[#1f4e96] focus:bg-white"
            >
              <option value="">Todas las marcas</option>
              {filters.brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            <select
              value={selectedTransmission}
              onChange={(e) => setSelectedTransmission(e.target.value)}
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition focus:border-[#1f4e96] focus:bg-white"
            >
              <option value="">Todas las cajas</option>
              {filters.transmissions.map((transmission) => (
                <option key={transmission} value={transmission}>
                  {transmission}
                </option>
              ))}
            </select>

            <select
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition focus:border-[#1f4e96] focus:bg-white"
            >
              <option value="">Combustible</option>
              {filters.fuels.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Año desde"
              value={yearMin}
              min={1980}
              max={new Date().getFullYear()}
              onChange={(e) => setYearMin(e.target.value ? Number(e.target.value) : '')}
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition focus:border-[#1f4e96] focus:bg-white"
            />

            <input
              type="number"
              placeholder="Año hasta"
              value={yearMax}
              min={1980}
              max={new Date().getFullYear()}
              onChange={(e) => setYearMax(e.target.value ? Number(e.target.value) : '')}
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition focus:border-[#1f4e96] focus:bg-white"
            />
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            <span className="font-bold text-gray-900">{total}</span>{' '}
            {total === 1 ? 'vehículo encontrado' : 'vehículos encontrados'}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[430px] animate-pulse rounded-3xl border border-gray-200 bg-white" />
            ))}
          </div>
        ) : vehicles.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <article
                key={vehicle.id}
                onClick={() => router.push(`/vehiculos/${vehicle.slug}`)}
                className="group cursor-pointer overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={vehicle.images?.[0] || FALLBACK_IMG}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className="absolute bottom-4 right-4 rounded-lg bg-black/60 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur">
                    {vehicle.year}
                  </span>
                </div>

                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1f4e96]">{vehicle.brand}</p>
                  <h2 className="mt-1 text-2xl font-bold text-gray-900">{vehicle.model}</h2>
                  <p className="mt-1 text-sm text-gray-500">{vehicle.version}</p>

                  <div className="mt-5 grid grid-cols-3 gap-2 border-y border-gray-100 py-4">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <Gauge size={18} className="text-[#1f4e96]" />
                      <span className="text-xs text-gray-400">Km</span>
                      <span className="text-xs font-semibold text-gray-700">
                        {vehicle.mileage?.toLocaleString('es-AR')}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <Settings2 size={18} className="text-[#1f4e96]" />
                      <span className="text-xs text-gray-400">Caja</span>
                      <span className="max-w-[90px] truncate text-xs font-semibold text-gray-700">
                        {vehicle.transmission}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <Fuel size={18} className="text-[#1f4e96]" />
                      <span className="text-xs text-gray-400">Combustible</span>
                      <span className="text-xs font-semibold text-gray-700">{vehicle.fuel}</span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Precio</p>
                    <p className="mt-1 text-2xl font-extrabold text-[#071224]">
                      {formatPrice(vehicle.price, vehicle.currency)}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="mt-5 w-full rounded-xl bg-[#071224] px-4 py-3 text-sm font-semibold text-white transition group-hover:bg-[#1f4e96]"
                  >
                    Ver vehículo
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <Search size={25} className="text-gray-400" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">No encontramos vehículos</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Probá modificando alguno de los filtros o limpiándolos para ver todo el catálogo.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-[#071224] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1f4e96]"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {pageCount > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((previous) => Math.max(previous - 1, 1))}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#071224] transition hover:border-[#1f4e96] hover:text-[#1f4e96] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={19} />
            </button>

            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition ${
                  page === pageNumber
                    ? 'bg-[#1f4e96] text-white shadow-md'
                    : 'border border-gray-200 bg-white text-gray-700 hover:border-[#1f4e96] hover:text-[#1f4e96]'
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              disabled={page === pageCount}
              onClick={() => setPage((previous) => Math.min(previous + 1, pageCount))}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#071224] transition hover:border-[#1f4e96] hover:text-[#1f4e96] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight size={19} />
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}
