'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRight,
  Gauge,
  CalendarDays,
  Sparkles,
  TrendingDown,
} from 'lucide-react';

import { motion } from 'framer-motion';

/* =========================================
   TYPES
========================================= */

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

/* =========================================
   DATA
========================================= */

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

/* =========================================
   FORMAT PRICE
========================================= */

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price);

/* =========================================
   COMPONENT
========================================= */

export default function OpportunitiesSection() {
  return (
    <section className="relative overflow-hidden bg-[#071224] py-12">

      {/* FONDO */}

      <div className="pointer-events-none absolute -left-48 top-0 h-[380px] w-[380px] rounded-full bg-[#1f4e96]/10 blur-[120px]" />

      <div className="pointer-events-none absolute -right-48 bottom-0 h-[380px] w-[380px] rounded-full bg-[#163b71]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <Sparkles
                size={14}
                className="text-blue-300"
              />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
                Oportunidades
              </span>

            </div>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Unidades con precio especial
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Vehículos seleccionados con condiciones
              especiales por tiempo limitado.
            </p>

          </div>

          <Link
            href="/vehiculos"
            className="
              hidden
              items-center
              gap-1.5
              text-xs
              font-semibold
              text-slate-400
              transition
              hover:text-white
              sm:inline-flex
            "
          >
            Ver todas las unidades

            <ArrowRight size={13} />
          </Link>

        </div>

        {/* =====================================
            VEHÍCULOS
        ===================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
            lg:gap-5
          "
        >

          {opportunities.map(
            (
              {
                id,
                img,
                price,
                oldPrice,
                mileage,
                year,
                brand,
                model,
                slug,
              },
              index,
            ) => {

              const benefit =
                oldPrice && oldPrice > price
                  ? oldPrice - price
                  : 0;

              const discountPercentage =
                oldPrice && oldPrice > price
                  ? Math.round(
                      ((oldPrice - price) /
                        oldPrice) *
                        100,
                    )
                  : 0;

              return (
                <motion.article
                  key={id}
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.04,
                  }}
                  className="
                    group
                    mx-auto
                    w-full
                    max-w-[310px]
                    overflow-hidden
                    rounded-xl
                    border
                    border-white/10
                    bg-[#0c192d]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#3169b7]/70
                    hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.8)]
                  "
                >

                  {/* =================================
                      FOTO 4:5 INSTAGRAM
                  ================================= */}

                  <Link
                    href={`/vehiculos/${slug}`}
                    className="
                      relative
                      block
                      aspect-[4/5]
                      w-full
                      overflow-hidden
                      bg-[#071224]
                    "
                  >

                    <Image
                      src={img}
                      alt={`${brand} ${model}`}
                      fill
                      className="
                        object-cover
                        object-center
                        transition-transform
                        duration-500
                        group-hover:scale-[1.02]
                      "
                      sizes="
                        (max-width: 640px) 90vw,
                        (max-width: 1024px) 45vw,
                        310px
                      "
                    />

                    {/* DEGRADADO */}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-[#071224]/65
                        via-transparent
                        to-black/5
                      "
                    />

                    {/* OPORTUNIDAD */}

                    <div className="absolute left-3 top-3">

                      <span
                        className="
                          inline-flex
                          h-6
                          items-center
                          rounded-md
                          bg-[#1f4e96]
                          px-2.5
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-[0.08em]
                          text-white
                        "
                      >
                        Oportunidad
                      </span>

                    </div>

                    {/* DESCUENTO */}

                    {discountPercentage > 0 && (
                      <div className="absolute right-3 top-3">

                        <span
                          className="
                            inline-flex
                            h-6
                            items-center
                            gap-1
                            rounded-md
                            border
                            border-white/15
                            bg-[#071224]/85
                            px-2
                            text-[10px]
                            font-bold
                            text-white
                            backdrop-blur
                          "
                        >

                          <TrendingDown
                            size={11}
                            className="text-blue-300"
                          />

                          {discountPercentage}% menos

                        </span>

                      </div>
                    )}

                    {/* AÑO + KM */}

                    <div
                      className="
                        absolute
                        bottom-3
                        left-3
                        flex
                        items-center
                        gap-1.5
                      "
                    >

                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1
                          rounded-md
                          border
                          border-white/10
                          bg-[#071224]/85
                          px-2
                          py-1
                          text-[9px]
                          font-medium
                          text-white
                          backdrop-blur
                        "
                      >

                        <CalendarDays
                          size={10}
                          className="text-blue-300"
                        />

                        {year}

                      </span>

                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1
                          rounded-md
                          border
                          border-white/10
                          bg-[#071224]/85
                          px-2
                          py-1
                          text-[9px]
                          font-medium
                          text-white
                          backdrop-blur
                        "
                      >

                        <Gauge
                          size={10}
                          className="text-blue-300"
                        />

                        {mileage.toLocaleString(
                          'es-AR',
                        )}{' '}
                        km

                      </span>

                    </div>

                  </Link>

                  {/* =================================
                      INFORMACIÓN
                  ================================= */}

                  <div className="p-3.5">

                    {/* MARCA */}

                    <p
                      className="
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.15em]
                        text-blue-300
                      "
                    >
                      {brand}
                    </p>

                    {/* MODELO */}

                    <Link
                      href={`/vehiculos/${slug}`}
                    >
                      <h3
                        className="
                          mt-1
                          text-base
                          font-semibold
                          leading-tight
                          text-white
                          transition
                          hover:text-blue-300
                        "
                      >
                        {model}
                      </h3>
                    </Link>

                    {/* PRECIO */}

                    <div
                      className="
                        mt-3
                        flex
                        items-end
                        justify-between
                        gap-3
                        border-t
                        border-white/10
                        pt-3
                      "
                    >

                      <div>

                        {oldPrice && (
                          <div className="flex items-center gap-1.5">

                            <span
                              className="
                                text-[8px]
                                uppercase
                                tracking-wide
                                text-slate-600
                              "
                            >
                              Antes
                            </span>

                            <span
                              className="
                                text-[10px]
                                text-slate-500
                                line-through
                              "
                            >
                              {formatPrice(
                                oldPrice,
                              )}
                            </span>

                          </div>
                        )}

                        <p
                          className="
                            mt-1
                            text-lg
                            font-bold
                            tracking-tight
                            text-white
                          "
                        >
                          {formatPrice(price)}
                        </p>

                      </div>

                      {/* AHORRO */}

                      {benefit > 0 && (
                        <div className="text-right">

                          <p
                            className="
                              text-[8px]
                              uppercase
                              tracking-wide
                              text-slate-600
                            "
                          >
                            Ahorrás
                          </p>

                          <p
                            className="
                              mt-1
                              text-[11px]
                              font-semibold
                              text-blue-300
                            "
                          >
                            {formatPrice(
                              benefit,
                            )}
                          </p>

                        </div>
                      )}

                    </div>

                    {/* BOTÓN */}

                    <Link
                      href={`/vehiculos/${slug}`}
                      className="
                        mt-3
                        flex
                        h-9
                        w-full
                        items-center
                        justify-between
                        rounded-lg
                        border
                        border-white/10
                        bg-white/[0.025]
                        px-3
                        text-[11px]
                        font-semibold
                        text-slate-300
                        transition
                        hover:border-[#3169b7]
                        hover:bg-[#1f4e96]
                        hover:text-white
                      "
                    >
                      Ver oportunidad

                      <ArrowRight
                        size={12}
                        className="
                          transition-transform
                          group-hover:translate-x-0.5
                        "
                      />
                    </Link>

                  </div>

                </motion.article>
              );
            },
          )}

        </div>

        {/* =====================================
            MOBILE CTA
        ===================================== */}

        <div className="mt-6 sm:hidden">

          <Link
            href="/vehiculos"
            className="
              inline-flex
              items-center
              gap-1.5
              text-xs
              font-semibold
              text-slate-400
              transition
              hover:text-white
            "
          >
            Ver todas las unidades

            <ArrowRight size={13} />
          </Link>

        </div>

      </div>

    </section>
  );
}