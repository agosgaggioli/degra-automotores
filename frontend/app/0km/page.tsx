'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X, Fuel, Settings2, CalendarDays, ArrowRight, Sparkles } from 'lucide-react';

import { fetchVehicles, fetchVehicleFilters, Vehicle } from '../../lib/api';

const FALLBACK_IMG = '/images/vehicles/onix.jpeg';
const PAGE_SIZE = 48;

const fieldClass =
  'h-10 w-full rounded-lg border border-white/10 bg-[#071224] px-3 text-xs text-slate-300 outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-[#3169b7] focus:ring-2 focus:ring-[#3169b7]/20';

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency || 'ARS',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ZeroKmPage() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [brands, setBrands] = useState<string[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVehicleFilters('new')
      .then((f) => setBrands(f.brands))
      .catch(() => setBrands([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    const timeout = setTimeout(() => {
      fetchVehicles({ condition: 'new', search, brand, pageSize: PAGE_SIZE })
        .then((res) => {
          if (cancelled) return;
          setVehicles(res.data);
          setTotal(res.pagination.total);
        })
        .catch((err) => {
          if (cancelled) return;
          setError(err.message || 'No pudimos cargar los 0km. Probá de nuevo en unos minutos.');
          setVehicles([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [search, brand]);

  const hasActiveFilters = search !== '' || brand !== '';
  const clearFilters = () => {
    setSearch('');
    setBrand('');
  };

  return (
    <main className="min-h-screen bg-[#071224] text-white">
      {/* CABECERA */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-48 -top-48 h-[500px] w-[500px] rounded-full bg-[#1f4e96]/20 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-28 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">Vehículos nuevos</span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">0km</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Conocé los modelos 0km disponibles y consultanos por precio, colores y financiación.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        {/* FILTROS */}
        <div className="mb-8 rounded-xl border border-white/10 bg-[#0c192d] p-4 shadow-xl shadow-black/10 md:p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative sm:col-span-2">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                aria-label="Buscar 0km"
                placeholder="Buscar por marca, modelo o versión..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`${fieldClass} pl-9 text-white`}
              />
            </div>

            <select aria-label="Marca" value={brand} onChange={(e) => setBrand(e.target.value)} className={fieldClass}>
              <option value="">Todas las marcas</option>
              {brands.map((b) => (
                <option key={b} value={b} className="bg-[#071224]">
                  {b}
                </option>
              ))}
            </select>

            <div className="flex h-10 items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs text-slate-400">
              <span>
                <span className="mr-1.5 font-semibold text-white">{total}</span>
                {total === 1 ? 'modelo' : 'modelos'}
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-[11px] font-medium text-slate-400 transition hover:text-white"
                >
                  <X size={12} />
                  Limpiar
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">{error}</div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="mx-auto w-full max-w-[285px] animate-pulse overflow-hidden rounded-xl border border-white/10 bg-[#0c192d]"
              >
                <div className="aspect-[4/5] w-full bg-white/5" />
                <div className="space-y-2 p-4">
                  <div className="h-2.5 w-16 rounded bg-white/10" />
                  <div className="h-4 w-32 rounded bg-white/10" />
                  <div className="h-9 w-full rounded-lg bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : vehicles.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {vehicles.map((v) => (
              <article
                key={v.id}
                onClick={() => router.push(`/vehiculos/${v.slug}`)}
                className="group mx-auto w-full max-w-[285px] cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#0c192d] transition duration-300 hover:border-[#3169b7]/70 hover:shadow-[0_16px_40px_-20px_rgba(0,0,0,0.85)]"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0a1526]">
                  <Image
                    src={v.images?.[0] || FALLBACK_IMG}
                    alt={`${v.brand} ${v.model}`}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="285px"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-[#1f4e96] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                    <Sparkles size={11} />
                    0km
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-blue-300">{v.brand}</p>
                  <h2 className="mt-1 truncate text-base font-semibold text-white">{v.model}</h2>
                  <p className="mt-0.5 truncate text-[11px] text-slate-500">{v.version}</p>

                  <div className="mt-3 grid grid-cols-3 border-y border-white/10 py-2.5">
                    <div className="flex min-w-0 items-center gap-1.5 border-r border-white/10 pr-2 text-[9px] text-slate-400">
                      <CalendarDays size={12} className="shrink-0 text-blue-300" />
                      <span className="truncate">{v.year}</span>
                    </div>
                    <div className="flex min-w-0 items-center gap-1.5 border-r border-white/10 px-2 text-[9px] text-slate-400">
                      <Settings2 size={12} className="shrink-0 text-blue-300" />
                      <span className="truncate">{v.transmission || '—'}</span>
                    </div>
                    <div className="flex min-w-0 items-center gap-1.5 pl-2 text-[9px] text-slate-400">
                      <Fuel size={12} className="shrink-0 text-blue-300" />
                      <span className="truncate">{v.fuel || '—'}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-[9px] uppercase tracking-wider text-slate-500">Precio</p>
                    <p className="mt-0.5 text-base font-bold text-white">{formatPrice(v.price, v.currency)}</p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/vehiculos/${v.slug}`);
                    }}
                    className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#1f4e96] text-[11px] font-semibold text-white transition hover:bg-[#295eaa]"
                  >
                    Ver 0km
                    <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-[#0c192d] px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-400/10">
              <Sparkles size={20} className="text-blue-300" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">
              {hasActiveFilters ? 'No encontramos 0km con esos filtros' : 'Pronto vas a ver nuestros 0km acá'}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">
              {hasActiveFilters
                ? 'Probá con otra marca o búsqueda.'
                : 'Mientras tanto, escribinos y te contamos qué modelos tenemos disponibles.'}
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 h-9 rounded-lg bg-[#1f4e96] px-4 text-xs font-semibold text-white transition hover:bg-[#295eaa]"
              >
                Limpiar filtros
              </button>
            ) : (
              <a
                href="/contacto"
                className="mt-5 inline-flex h-9 items-center rounded-lg bg-[#1f4e96] px-4 text-xs font-semibold text-white transition hover:bg-[#295eaa]"
              >
                Consultar 0km
              </a>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
