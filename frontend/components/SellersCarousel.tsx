'use client';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';

import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Users,
} from 'lucide-react';

/* =========================================
   TYPES
========================================= */

interface Seller {
  id: string;
  name: string;
  role: string;
  photo: string;
  whatsapp: string;
}

/* =========================================
   VENDEDORES
========================================= */

const sellers: Seller[] = [
  {
    id: 's1',
    name: 'Lautaro Degra',
    role: 'Vendedor',
    photo: '/images/sellers/juan.jpeg',
    whatsapp: '3463406181',
  },
  {
    id: 's2',
    name: 'Valentin Degra',
    role: 'Vendedor',
    photo: '/images/sellers/juan.jpeg',
    whatsapp: '3463412087',
  },
  {
    id: 's3',
    name: 'Dario Degra',
    role: 'Vendedor',
    photo: '/images/sellers/juan.jpeg',
    whatsapp: '3517358079',
  },
    {
    id: 's3',
    name: 'Marwan',
    role: 'Vendedor',
    photo: '/images/sellers/juan.jpeg',
    whatsapp: '3513681188',
  },
];

/* =========================================
   COMPONENT
========================================= */

export default function SellersCarousel() {
  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const [emblaRef, emblaApi] =
    useEmblaCarousel({
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      skipSnaps: false,
      dragFree: false,
    });

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

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  /* =========================================
     AUTOPLAY
  ========================================= */

  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      clearInterval(autoplay);
    };
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
    <section className="relative overflow-hidden bg-[#071224] py-12">

      {/* LUCES DE FONDO */}

      <div className="pointer-events-none absolute -left-48 top-0 h-[380px] w-[380px] rounded-full bg-[#1f4e96]/10 blur-[120px]" />

      <div className="pointer-events-none absolute -right-48 bottom-0 h-[380px] w-[380px] rounded-full bg-[#163b71]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =====================================
            ENCABEZADO
        ===================================== */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <Users
                size={14}
                className="text-blue-300"
              />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
                Nuestro equipo
              </span>

            </div>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Estamos para ayudarte
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Contactá directamente a uno de nuestros
              asesores y encontrá tu próximo vehículo.
            </p>

          </div>

          {/* FLECHAS DESKTOP */}

          <div className="hidden items-center gap-2 sm:flex">

            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Vendedor anterior"
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
              aria-label="Vendedor siguiente"
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

            {sellers.map(
              (seller, index) => {

                const isSelected =
                  selectedIndex === index;

                const message =
                  encodeURIComponent(
                    `Hola ${seller.name}, estoy buscando un vehículo y quería hacerte una consulta.`,
                  );

                const whatsappUrl =
                  `https://wa.me/${seller.whatsapp}?text=${message}`;

                return (
                  <div
                    key={seller.id}
                    className="
                      min-w-0
                      flex-[0_0_78%]
                      pl-3
                      sm:flex-[0_0_45%]
                      md:flex-[0_0_33.333%]
                      lg:flex-[0_0_25%]
                    "
                  >

                    {/* =============================
                        CARD
                    ============================= */}

                    <article
                      onClick={() =>
                        selectSlide(index)
                      }
                      className={`
                        group
                        relative
                        flex
                        h-full
                        cursor-pointer
                        flex-col
                        items-center
                        rounded-xl
                        border
                        bg-[#0c192d]
                        px-4
                        py-5
                        text-center
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:border-[#3169b7]/70

                        ${
                          isSelected
                            ? `
                              border-[#3169b7]/60
                              shadow-[0_16px_35px_-25px_rgba(49,105,183,0.65)]
                            `
                            : `
                              border-white/10
                            `
                        }
                      `}
                    >

                      {/* INDICADOR ACTIVO */}

                      {isSelected && (
                        <span
                          className="
                            absolute
                            right-3
                            top-3
                            h-1.5
                            w-1.5
                            rounded-full
                            bg-blue-400
                          "
                        />
                      )}

                      {/* =============================
                          FOTO REDONDA
                      ============================= */}

                      <div
                        className={`
                          relative
                          h-[92px]
                          w-[92px]
                          shrink-0
                          overflow-hidden
                          rounded-full
                          border-2
                          bg-[#071224]

                          ${
                            isSelected
                              ? 'border-[#3169b7]'
                              : 'border-white/10'
                          }
                        `}
                      >

                        <Image
                          src={seller.photo}
                          alt={seller.name}
                          fill
                          className="
                            object-cover
                            object-center
                            transition-transform
                            duration-500
                            group-hover:scale-105
                          "
                          sizes="92px"
                          priority={index === 0}
                        />

                      </div>

                      {/* =============================
                          INFORMACIÓN
                      ============================= */}

                      <div className="mt-4">

                        <h3 className="text-[15px] font-semibold leading-tight text-white">
                          {seller.name}
                        </h3>

                        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-300">
                          {seller.role}
                        </p>

                      </div>

                      {/* DESCRIPCIÓN */}

                      <p className="mt-3 max-w-[210px] text-[11px] leading-5 text-slate-500">
                        Asesoramiento personalizado para ayudarte
                        a encontrar la unidad indicada.
                      </p>

                      {/* SEPARADOR INTERNO */}

                      <div className="my-4 h-px w-full bg-white/10" />

                      {/* =============================
                          WHATSAPP
                      ============================= */}

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                        aria-label={`Contactar a ${seller.name} por WhatsApp`}
                        className="
                          flex
                          h-9
                          w-full
                          items-center
                          justify-center
                          gap-2
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
                        <MessageCircle size={14} />

                        Contactar
                      </a>

                    </article>

                  </div>
                );
              },
            )}

          </div>

        </div>

        {/* =====================================
            PARTE INFERIOR
        ===================================== */}

        <div className="mt-5 flex items-center justify-between">

          {/* INDICADORES */}

          <div className="flex items-center gap-1.5">

            {sellers.map(
              (seller, index) => (
                <button
                  key={seller.id}
                  type="button"
                  onClick={() =>
                    selectSlide(index)
                  }
                  aria-label={`Ir al vendedor ${index + 1}`}
                  className={`
                    h-1.5
                    rounded-full
                    transition-all
                    duration-300

                    ${
                      selectedIndex === index
                        ? 'w-6 bg-[#1f4e96]'
                        : 'w-1.5 bg-white/20 hover:bg-white/40'
                    }
                  `}
                />
              ),
            )}

          </div>

          {/* FLECHAS MOBILE */}

          <div className="flex items-center gap-2 sm:hidden">

            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Vendedor anterior"
              className="
                flex
                h-8
                w-8
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
              <ChevronLeft size={15} />
            </button>

            <button
              type="button"
              onClick={scrollNext}
              aria-label="Vendedor siguiente"
              className="
                flex
                h-8
                w-8
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
              <ChevronRight size={15} />
            </button>

          </div>

          <span className="hidden text-[10px] text-slate-600 sm:block">
            Deslizá para conocer al equipo
          </span>

        </div>

      </div>

    </section>
  );
}