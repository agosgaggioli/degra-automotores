'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const financings = [
  {
    id: 'fin1',
    bank: 'Banco Nación',
    logo: '/images/bancoNacion.png',
    name: 'Plan Nación 24 Cuotas',
    cuotas: 24,
    tasa: '18%',
    anticipo: '30%',
    beneficio: 'Tasa fija y cuotas sin sorpresas.',
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
    beneficio: 'Financiación flexible con aprobación rápida.',
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
    beneficio: 'Pago anticipado sin costos extra.',
    url: '/financiacion',
  },
];

export default function FinancingCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    slidesToScroll: 1,
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  /*
   * Actualiza la card seleccionada cada vez
   * que Embla cambia de posición.
   */
  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setSelectedIndex(emblaApi.selectedScrollSnap());
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

  /*
   * Autoplay simple.
   */
  useEffect(() => {
    if (!emblaApi) return;

    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, 6500);

    return () => clearInterval(timer);
  }, [emblaApi]);

  /*
   * Flechas.
   */
  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;

    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;

    emblaApi.scrollNext();
  }, [emblaApi]);

  /*
   * Permite tocar una card para seleccionarla
   * antes de entrar al detalle.
   */
  const selectSlide = useCallback(
    (index: number) => {
      if (!emblaApi) return;

      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <section className="relative overflow-hidden py-16">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Financiaciones pensadas para vos
          </h2>

          <p className="mt-4 text-gray-600">
            Elegí la opción que mejor se adapte a tu próximo vehículo.
          </p>
        </div>

        {/* Carrusel */}
        <div className="relative">
          {/*
           * IMPORTANTE:
           *
           * overflow-hidden es necesario para Embla.
           * py-8 genera espacio para que la card pueda
           * crecer con scale sin quedar cortada.
           */}
          <div
            ref={emblaRef}
            className="overflow-hidden px-2 py-8 md:px-14"
          >
            <div className="flex touch-pan-y">
              {financings.map((fin, index) => {
                const isSelected = index === selectedIndex;

                return (
                  <div
                    key={fin.id}
                    className="
                      min-w-0
                      flex-[0_0_86%]
                      px-3
                      sm:flex-[0_0_65%]
                      md:flex-[0_0_48%]
                      lg:flex-[0_0_36%]
                    "
                  >
                    <motion.div
                      onClick={() => selectSlide(index)}
                      animate={{
                        scale: isSelected ? 1.06 : 0.94,
                        opacity: isSelected ? 1 : 0.68,
                        y: isSelected ? 0 : 6,
                      }}
                      whileHover={{
                        scale: isSelected ? 1.07 : 0.98,
                      }}
                      transition={{
                        duration: 0.35,
                        ease: 'easeOut',
                      }}
                      className={`
                        relative
                        h-full
                        cursor-pointer
                        overflow-hidden
                        rounded-2xl
                        border
                        bg-white
                        transition-shadow
                        duration-300
                        ${
                          isSelected
                            ? 'border-bluePrimary shadow-xl'
                            : 'border-gray-200 shadow-md'
                        }
                      `}
                    >
                      {/* Badge seleccionado */}
                      {isSelected && (
                        <div className="absolute right-4 top-4 z-10">
                          <span className="rounded-full bg-bluePrimary px-3 py-1 text-xs font-semibold text-white shadow">
                            Destacada
                          </span>
                        </div>
                      )}

                      <div className="flex min-h-[390px] flex-col p-6">
                        {/* Logo */}
                        <div className="mb-6 flex h-20 items-center justify-center">
                          <div className="relative h-16 w-40">
                            <Image
                              src={fin.logo}
                              alt={fin.bank}
                              fill
                              className="object-contain"
                              sizes="160px"
                              priority={index === 0}
                            />
                          </div>
                        </div>

                        {/* Banco */}
                        <p className="mb-2 text-center text-sm font-medium uppercase tracking-wide text-gray-500">
                          {fin.bank}
                        </p>

                        {/* Nombre */}
                        <h3 className="mb-4 text-center text-xl font-bold text-gray-900">
                          {fin.name}
                        </h3>

                        {/* Datos */}
                        <div className="mb-5 flex items-center justify-center gap-3 text-sm text-gray-600">
                          <span className="font-medium">
                            {fin.cuotas} cuotas
                          </span>

                          <span className="h-1 w-1 rounded-full bg-gray-400" />

                          <span className="font-medium">
                            Tasa {fin.tasa}
                          </span>
                        </div>

                        {/* Anticipo */}
                        <div className="mb-4 rounded-xl bg-gray-50 px-4 py-3 text-center">
                          <span className="text-sm text-gray-500">
                            Anticipo desde
                          </span>

                          <p className="mt-1 text-xl font-bold text-blueSecondary">
                            {fin.anticipo}
                          </p>
                        </div>

                        {/* Beneficio */}
                        <p className="mb-6 text-center text-sm leading-relaxed text-gray-600">
                          {fin.beneficio}
                        </p>

                        {/* CTA */}
                        <Link
                          href={fin.url}
                          onClick={(e) => e.stopPropagation()}
                          className="
                            mt-auto
                            block
                            w-full
                            rounded-xl
                            bg-bluePrimary
                            px-5
                            py-3
                            text-center
                            font-semibold
                            text-white
                            transition-all
                            duration-300
                            hover:-translate-y-0.5
                            hover:bg-blueSecondary
                            hover:shadow-lg
                          "
                        >
                          Ver financiación
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flecha izquierda */}
          <button
            type="button"
            aria-label="Anterior financiación"
            onClick={scrollPrev}
            className="
              absolute
              left-0
              top-1/2
              z-30
              hidden
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-gray-100
              bg-white
              p-3
              shadow-lg
              transition-all
              duration-300
              hover:scale-110
              hover:bg-gray-50
              md:flex
            "
          >
            <ChevronLeft
              size={26}
              strokeWidth={2}
              className="text-blueSecondary"
            />
          </button>

          {/* Flecha derecha */}
          <button
            type="button"
            aria-label="Siguiente financiación"
            onClick={scrollNext}
            className="
              absolute
              right-0
              top-1/2
              z-30
              hidden
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-gray-100
              bg-white
              p-3
              shadow-lg
              transition-all
              duration-300
              hover:scale-110
              hover:bg-gray-50
              md:flex
            "
          >
            <ChevronRight
              size={26}
              strokeWidth={2}
              className="text-blueSecondary"
            />
          </button>
        </div>

        {/* Indicadores */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {financings.map((fin, index) => {
            const isSelected = index === selectedIndex;

            return (
              <button
                key={fin.id}
                type="button"
                aria-label={`Ir a financiación ${index + 1}`}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`
                  h-2.5
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    isSelected
                      ? 'w-8 bg-bluePrimary'
                      : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                  }
                `}
              />
            );
          })}
        </div>

        {/* Botón final */}
        <div className="mt-10 text-center">
          <Link
            href="/financiacion"
            className="
              inline-flex
              items-center
              justify-center
              rounded-xl
              bg-blueSecondary
              px-8
              py-3
              font-semibold
              text-white
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-bluePrimary
              hover:shadow-lg
            "
          >
            Ver todas las financiaciones
          </Link>
        </div>
      </div>
    </section>
  );
}
