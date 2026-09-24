'use client';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import useEmblaCarousel from 'embla-carousel-react';

import Image from 'next/image';
import Link from 'next/link';

import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Landmark,
  CalendarDays,
  Percent,
  WalletCards,
} from 'lucide-react';

/* =========================================
   FINANCIACIONES
========================================= */

const financings = [
  {
    id: 'fin1',
    bank: 'Banco Nación',
    logo: '/images/bancoNacion.png',
    name: 'Plan Nación 24 Cuotas',
    cuotas: 24,
    tasa: '18%',
    anticipo: '30%',
    beneficio:
      'Tasa fija y cuotas sin sorpresas.',
    url: '/financiacion',
  },
  {
    id: 'fin2',
    bank: 'Santander',
    logo: '/images/bancoSantander.png',
    name: 'Santander Flex',
    cuotas: 36,
    tasa: '20%',
    anticipo: '25%',
    beneficio:
      'Financiación flexible con aprobación rápida.',
    url: '/financiacion',
  },
  {
    id: 'fin3',
    bank: 'Banco Galicia',
    logo: '/images/bancoGalicia.png',
    name: 'Galicia Auto Fácil',
    cuotas: 30,
    tasa: '22%',
    anticipo: '35%',
    beneficio:
      'Pago anticipado sin costos extra.',
    url: '/financiacion',
  },
];

/* =========================================
   COMPONENTE
========================================= */

export default function FinancingCarousel() {
  const [emblaRef, emblaApi] =
    useEmblaCarousel({
      loop: true,
      align: 'start',
      slidesToScroll: 1,
    });

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  /* =========================================
     SELECCIÓN
  ========================================= */

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setSelectedIndex(
      emblaApi.selectedScrollSnap(),
    );
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();

    emblaApi.on(
      'select',
      onSelect,
    );

    emblaApi.on(
      'reInit',
      onSelect,
    );

    return () => {
      emblaApi.off(
        'select',
        onSelect,
      );

      emblaApi.off(
        'reInit',
        onSelect,
      );
    };
  }, [emblaApi, onSelect]);

  /* =========================================
     AUTOPLAY
  ========================================= */

  useEffect(() => {
    if (!emblaApi) return;

    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, 6500);

    return () =>
      clearInterval(timer);
  }, [emblaApi]);

  /* =========================================
     NAVEGACIÓN
  ========================================= */

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const selectSlide = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  /* =========================================
     RENDER
  ========================================= */

  return (
    <section className="relative overflow-hidden bg-[#071224] py-14">

      {/* =====================================
          FONDO
      ===================================== */}

      <div className="pointer-events-none absolute -left-48 top-0 h-[420px] w-[420px] rounded-full bg-[#1f4e96]/10 blur-[130px]" />

      <div className="pointer-events-none absolute -right-48 bottom-0 h-[420px] w-[420px] rounded-full bg-[#163b71]/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <Landmark
                size={14}
                className="text-blue-300"
              />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
                Financiación
              </span>

            </div>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Opciones para llegar a tu próximo vehículo
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Conocé las alternativas disponibles y
              encontrá una financiación que se adapte a vos.
            </p>

          </div>

          {/* FLECHAS */}

          <div className="hidden items-center gap-2 sm:flex">

            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Financiación anterior"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-white/10
                bg-[#0c192d]
                text-slate-400
                transition
                hover:border-[#3169b7]
                hover:text-white
              "
            >
              <ChevronLeft size={17} />
            </button>

            <button
              type="button"
              onClick={scrollNext}
              aria-label="Financiación siguiente"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-white/10
                bg-[#0c192d]
                text-slate-400
                transition
                hover:border-[#3169b7]
                hover:text-white
              "
            >
              <ChevronRight size={17} />
            </button>

          </div>

        </div>

        {/* =====================================
            CARRUSEL
        ===================================== */}

        <div
          ref={emblaRef}
          className="overflow-hidden"
        >

          <div className="-ml-3 flex touch-pan-y">

            {financings.map(
              (fin, index) => {

                const isSelected =
                  selectedIndex === index;

                return (
                  <div
                    key={fin.id}
                    className="
                      min-w-0
                      flex-[0_0_88%]
                      pl-3
                      sm:flex-[0_0_55%]
                      md:flex-[0_0_45%]
                      lg:flex-[0_0_36%]
                    "
                  >

                    {/* CARD */}

                    <article
                      onClick={() =>
                        selectSlide(index)
                      }
                      className={`
                        group
                        flex
                        h-full
                        cursor-pointer
                        flex-col
                        overflow-hidden
                        rounded-xl
                        border
                        bg-[#0c192d]
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-[#3169b7]/70

                        ${
                          isSelected
                            ? `
                              border-[#3169b7]/60
                              shadow-[0_18px_45px_-25px_rgba(49,105,183,0.55)]
                            `
                            : `
                              border-white/10
                            `
                        }
                      `}
                    >

                      {/* =================================
                          LOGO
                      ================================= */}

                      <div className="border-b border-white/10 p-3">

                        <div
                          className="
                            relative
                            flex
                            h-[82px]
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-lg
                            bg-white
                            px-5
                          "
                        >

                          <div className="relative h-12 w-[145px]">

                            <Image
                              src={fin.logo}
                              alt={fin.bank}
                              fill
                              className="object-contain"
                              sizes="145px"
                              priority={index === 0}
                            />

                          </div>

                          {/* INDICADOR SELECCIONADO */}

                          {isSelected && (
                            <span
                              className="
                                absolute
                                right-2
                                top-2
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-[#1f4e96]
                              "
                            />
                          )}

                        </div>

                      </div>

                      {/* =================================
                          INFORMACIÓN
                      ================================= */}

                      <div className="flex flex-1 flex-col p-4">

                        <p
                          className="
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.15em]
                            text-blue-300
                          "
                        >
                          {fin.bank}
                        </p>

                        <h3
                          className="
                            mt-1
                            text-base
                            font-semibold
                            text-white
                          "
                        >
                          {fin.name}
                        </h3>

                        <p
                          className="
                            mt-2
                            min-h-[40px]
                            text-xs
                            leading-5
                            text-slate-500
                          "
                        >
                          {fin.beneficio}
                        </p>

                        {/* =================================
                            DATOS
                        ================================= */}

                        <div
                          className="
                            mt-4
                            grid
                            grid-cols-3
                            overflow-hidden
                            rounded-lg
                            border
                            border-white/10
                          "
                        >

                          <FinancingData
                            icon={
                              <CalendarDays
                                size={13}
                              />
                            }
                            label="Cuotas"
                            value={`${fin.cuotas}`}
                          />

                          <FinancingData
                            icon={
                              <Percent
                                size={13}
                              />
                            }
                            label="Tasa"
                            value={fin.tasa}
                          />

                          <FinancingData
                            icon={
                              <WalletCards
                                size={13}
                              />
                            }
                            label="Anticipo"
                            value={fin.anticipo}
                          />

                        </div>

                        {/* =================================
                            CTA
                        ================================= */}

                        <Link
                          href={fin.url}
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                          className="
                            mt-4
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
                            text-xs
                            font-semibold
                            text-slate-300
                            transition
                            hover:border-[#3169b7]
                            hover:bg-[#1f4e96]
                            hover:text-white
                          "
                        >
                          Ver financiación

                          <ArrowRight
                            size={13}
                            className="
                              transition-transform
                              group-hover:translate-x-0.5
                            "
                          />
                        </Link>

                      </div>

                    </article>

                  </div>
                );
              },
            )}

          </div>

        </div>

        {/* =====================================
            NAVEGACIÓN INFERIOR
        ===================================== */}

        <div
          className="
            mt-6
            flex
            items-center
            justify-between
            gap-4
          "
        >

          {/* INDICADORES */}

          <div className="flex items-center gap-1.5">

            {financings.map(
              (fin, index) => {

                const isSelected =
                  selectedIndex === index;

                return (
                  <button
                    key={fin.id}
                    type="button"
                    onClick={() =>
                      emblaApi?.scrollTo(index)
                    }
                    aria-label={`Ir a financiación ${index + 1}`}
                    className={`
                      h-1.5
                      rounded-full
                      transition-all
                      duration-300

                      ${
                        isSelected
                          ? 'w-6 bg-[#1f4e96]'
                          : 'w-1.5 bg-white/20 hover:bg-white/40'
                      }
                    `}
                  />
                );
              },
            )}

          </div>

          {/* VER TODAS */}

          <Link
            href="/financiacion"
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
            Ver todas las financiaciones

            <ArrowRight size={13} />
          </Link>

        </div>

      </div>

    </section>
  );
}

/* =========================================
   FINANCING DATA
========================================= */

interface FinancingDataProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function FinancingData({
  icon,
  label,
  value,
}: FinancingDataProps) {
  return (
    <div
      className="
        border-r
        border-white/10
        px-2
        py-2.5
        text-center
        last:border-r-0
      "
    >

      <div
        className="
          flex
          items-center
          justify-center
          gap-1
          text-blue-300
        "
      >
        {icon}

        <span
          className="
            text-[8px]
            uppercase
            tracking-wide
            text-slate-600
          "
        >
          {label}
        </span>
      </div>

      <p
        className="
          mt-1
          text-[11px]
          font-semibold
          text-slate-300
        "
      >
        {value}
      </p>

    </div>
  );
}