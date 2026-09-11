'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Gauge, CalendarDays, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface Opportunity {
  id: string;
  img: string;
  price: number;
  oldPrice?: number;
  mileage: number;
  year: number;
  brand: string;
  model: string;
  slug: string;
}

const opportunities: Opportunity[] = [
  {
    id: 'opp1',
    img: '/images/vehicles/onix.jpeg',
    price: 6200000,
    oldPrice: 6500000,
    mileage: 40000,
    year: 2023,
    brand: 'Toyota',
    model: 'Hilux',
    slug: 'toyota-hilux-srx-2023',
  },
  {
    id: 'opp2',
    img: '/images/vehicles/onix.jpeg',
    price: 5000000,
    oldPrice: 5300000,
    mileage: 38000,
    year: 2022,
    brand: 'Volkswagen',
    model: 'Amarok',
    slug: 'volkswagen-amarok-trendline-2022',
  },
  {
    id: 'opp3',
    img: '/images/vehicles/onix.jpeg',
    price: 5700000,
    oldPrice: 5900000,
    mileage: 21000,
    year: 2022,
    brand: 'Ford',
    model: 'Ranger',
    slug: 'ford-ranger-xlt-2022',
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price);

export default function OpportunitiesSection() {
  return (
    <section className="relative overflow-hidden bg-[#071224] py-20">
      {/* Luces decorativas */}
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-4 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-blue-200 backdrop-blur">
              <Sparkles size={16} />
              Oportunidades seleccionadas
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Oportunidades que no duran mucho
          </h2>

          <p className="mt-4 text-base leading-relaxed text-gray-300 md:text-lg">
            Vehículos seleccionados con condiciones especiales por tiempo
            limitado.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.map(
            ({
              id,
              img,
              price,
              oldPrice,
              mileage,
              year,
              brand,
              model,
              slug,
            }) => {
              const benefit = oldPrice ? oldPrice - price : 0;

              const discountPercentage =
                oldPrice && oldPrice > price
                  ? Math.round(((oldPrice - price) / oldPrice) * 100)
                  : 0;

              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45 }}
                  whileHover={{ y: -8 }}
                  className="group h-full"
                >
                  <Link
                    href={`/vehiculos/${slug}`}
                    className="
                      relative
                      flex
                      h-full
                      flex-col
                      overflow-hidden
                      rounded-3xl
                      border
                      border-white/10
                      bg-white
                      shadow-xl
                      transition-all
                      duration-300
                      hover:border-blue-400/40
                      hover:shadow-2xl
                    "
                  >
                    {/* Imagen */}
                    <div className="relative h-[250px] w-full overflow-hidden">
                      <Image
                        src={img}
                        alt={`${brand} ${model}`}
                        fill
                        className="
                          object-cover
                          object-center
                          transition-transform
                          duration-700
                          ease-out
                          group-hover:scale-110
                        "
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Badge oportunidad */}
                      <div className="absolute left-4 top-4">
                        <span className="rounded-full bg-[#1f4e96] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                          Oportunidad
                        </span>
                      </div>

                      {/* Descuento */}
                      {discountPercentage > 0 && (
                        <div className="absolute right-4 top-4">
                          <span className="rounded-full bg-white px-3 py-2 text-sm font-extrabold text-[#163b71] shadow-lg">
                            -{discountPercentage}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="flex flex-1 flex-col p-6">
                      {/* Marca */}
                      <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-[#1f4e96]">
                        {brand}
                      </p>

                      {/* Modelo */}
                      <h3 className="text-2xl font-bold text-gray-900">
                        {model}
                      </h3>

                      {/* Datos */}
                      <div className="mt-4 flex items-center gap-5 border-b border-gray-100 pb-5 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarDays
                            size={17}
                            className="text-[#1f4e96]"
                          />
                          <span>{year}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Gauge size={18} className="text-[#1f4e96]" />
                          <span>
                            {mileage.toLocaleString('es-AR')} km
                          </span>
                        </div>
                      </div>

                      {/* Precio */}
                      <div className="mt-5">
                        {oldPrice && (
                          <p className="mb-1 text-sm text-gray-400">
                            Antes{' '}
                            <span className="line-through">
                              {formatPrice(oldPrice)}
                            </span>
                          </p>
                        )}

                        <p className="text-3xl font-extrabold tracking-tight text-gray-900">
                          {formatPrice(price)}
                        </p>
                      </div>

                      {/* Ahorro */}
                      {benefit > 0 && (
                        <div className="mt-4 inline-flex w-fit items-center rounded-lg bg-blue-50 px-3 py-2">
                          <span className="text-sm font-semibold text-[#163b71]">
                            Ahorrás {formatPrice(benefit)}
                          </span>
                        </div>
                      )}

                      {/* Botón */}
                      <div className="mt-6 flex items-center justify-between rounded-xl bg-[#071224] px-5 py-4 text-white transition-all duration-300 group-hover:bg-[#1f4e96]">
                        <span className="font-semibold">
                          Ver oportunidad
                        </span>

                        <ArrowRight
                          size={20}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            }
          )}
        </div>

        {/* CTA general */}
        <div className="mt-12 text-center">
          <Link
            href="/vehiculos"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-white/20
              bg-white/5
              px-7
              py-3
              font-semibold
              text-white
              backdrop-blur
              transition-all
              duration-300
              hover:bg-white
              hover:text-[#071224]
            "
          >
            Ver todos los vehículos
            <ArrowRight size={19} />
          </Link>
        </div>
      </div>
    </section>
  );
}