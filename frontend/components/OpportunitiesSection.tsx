'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRight,
  Gauge,
  CalendarDays,
  Sparkles,
} from 'lucide-react';

import { motion } from 'framer-motion';

import { fetchFeaturedVehicles, Vehicle } from '../lib/api';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price);

export default function OpportunitiesSection() {
  const [opportunities, setOpportunities] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        const res = await fetchFeaturedVehicles(3);
        if (active) {
          setOpportunities(res.data);
          setError('');
        }
      } catch (err) {
        if (active) {
          setError('No pudimos cargar las oportunidades.');
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (!loading && !error && opportunities.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#071224] py-12">
      <div className="pointer-events-none absolute -left-48 top-0 h-[380px] w-[380px] rounded-full bg-[#1f4e96]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-48 bottom-0 h-[380px] w-[380px] rounded-full bg-[#163b71]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-blue-300" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
                Oportunidades
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Unidades con precio especial
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Vehículos seleccionados con condiciones especiales por tiempo limitado.
            </p>
          </div>

          <Link
            href="/vehiculos"
            className="hidden items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-white sm:inline-flex"
          >
            Ver todas las unidades
            <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="mx-auto w-full max-w-[310px] animate-pulse overflow-hidden rounded-xl border border-white/10 bg-[#0c192d]"
              >
                <div className="aspect-[4/5] w-full bg-white/5" />
                <div className="space-y-2 p-3.5">
                  <div className="h-2 w-16 rounded bg-white/10" />
                  <div className="h-4 w-24 rounded bg-white/10" />
                  <div className="h-8 w-full rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-slate-400">{error}</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {opportunities.map(
              ({ id, images, price, mileage, year, brand, model, slug }, index) => {
                const img = images?.[0] || '/images/vehicles/onix.jpeg';

                return (
                  <motion.article
                    key={id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className="group mx-auto w-full max-w-[310px] overflow-hidden rounded-xl border border-white/10 bg-[#0c192d] transition-all duration-300 hover:-translate-y-1 hover:border-[#3169b7]/70 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.8)]"
                  >
                    <Link
                      href={`/vehiculos/${slug}`}
                      className="relative block aspect-[4/5] w-full overflow-hidden bg-[#071224]"
                    >
                      <Image
                        src={img}
                        alt={`${brand} ${model}`}
                        fill
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 310px"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#071224]/65 via-transparent to-black/5" />

                      <div className="absolute left-3 top-3">
                        <span className="inline-flex h-6 items-center rounded-md bg-[#1f4e96] px-2.5 text-[9px] font-bold uppercase tracking-[0.08em] text-white">
                          Oportunidad
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-[#071224]/85 px-2 py-1 text-[9px] font-medium text-white backdrop-blur">
                          <CalendarDays size={10} className="text-blue-300" />
                          {year}
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-[#071224]/85 px-2 py-1 text-[9px] font-medium text-white backdrop-blur">
                          <Gauge size={10} className="text-blue-300" />
                          {mileage.toLocaleString('es-AR')} km
                        </span>
                      </div>
                    </Link>

                    <div className="p-3.5">
                      <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-blue-300">
                        {brand}
                      </p>

                      <Link href={`/vehiculos/${slug}`}>
                        <h3 className="mt-1 text-base font-semibold leading-tight text-white transition hover:text-blue-300">
                          {model}
                        </h3>
                      </Link>

                      <div className="mt-3 flex items-end justify-between gap-3 border-t border-white/10 pt-3">
                        <div>
                          <p className="text-lg font-bold tracking-tight text-white">
                            {formatPrice(price)}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/vehiculos/${slug}`}
                        className="mt-3 flex h-9 w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.025] px-3 text-[11px] font-semibold text-slate-300 transition hover:border-[#3169b7] hover:bg-[#1f4e96] hover:text-white"
                      >
                        Ver oportunidad
                        <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </motion.article>
                );
              },
            )}
          </div>
        )}

        <div className="mt-6 sm:hidden">
          <Link
            href="/vehiculos"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-white"
          >
            Ver todas las unidades
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}