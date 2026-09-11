'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import {
  ChevronLeft,
  ChevronRight,
  Gauge,
  Fuel,
  Settings2,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  mileage: number;
  price: number;
  currency: string;
  transmission: string;
  fuel: string;
  img: string;
  featured: boolean;
  opportunity: boolean;
  newlyAdded: boolean;
  slug: string;
}

/* Datos de ejemplo — después se reemplazan por el backend */
const vehicles: Vehicle[] = [
  {
    id: 'v1',
    brand: 'Toyota',
    model: 'Hilux',
    version: 'SRX',
    year: 2023,
    mileage: 35000,
    price: 6500000,
    currency: 'ARS',
    transmission: 'Manual',
    fuel: 'Diésel',
    img: '/images/vehicles/onix.jpeg',
    featured: true,
    opportunity: false,
    newlyAdded: true,
    slug: 'toyota-hilux-srx-2023',
  },
  {
    id: 'v2',
    brand: 'Ford',
    model: 'Ranger',
    version: 'XLT',
    year: 2022,
    mileage: 18000,
    price: 5900000,
    currency: 'ARS',
    transmission: 'Automática',
    fuel: 'Nafta',
    img: '/images/vehicles/onix.jpeg',
    featured: true,
    opportunity: false,
    newlyAdded: false,
    slug: 'ford-ranger-xlt-2022',
  },
  {
    id: 'v3',
    brand: 'Volkswagen',
    model: 'Amarok',
    version: 'Trendline',
    year: 2021,
    mileage: 40000,
    price: 5300000,
    currency: 'ARS',
    transmission: 'Manual',
    fuel: 'Diésel',
    img: '/images/vehicles/onix.jpeg',
    featured: true,
    opportunity: true,
    newlyAdded: false,
    slug: 'volkswagen-amarok-trendline-2021',
  },
];

const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
};

export default function FeaturedVehiclesCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    slidesToScroll: 1,
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  /* Sincronizar slide seleccionado */
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

  /* Autoplay */
  useEffect(() => {
    if (!emblaApi) return;

    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, 7000);

    return () => clearInterval(timer);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;

    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;

    emblaApi.scrollNext();
  }, [emblaApi]);

  const selectSlide = useCallback(
    (index: number) => {
      if (!emblaApi) return;

      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <section className="relative overflow-hidden bg-[#f3f4f6] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4e96]">
            Selección especial
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Unidades destacadas
          </h2>

          <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
            Encontrá vehículos seleccionados por nuestro equipo y conocé tu
            próxima unidad.
          </p>
        </div>

        {/* CARRUSEL */}
        <div className="relative">
          <div
            ref={emblaRef}
            className="overflow-hidden px-2 py-10 md:px-14"
          >
            <div className="flex touch-pan-y">
              {vehicles.map((vehicle, index) => {
                const isSelected = index === selectedIndex;

                const whatsappMessage = encodeURIComponent(
                  `Hola, quisiera consultar por el ${vehicle.brand} ${vehicle.model} ${vehicle.version} año ${vehicle.year}`
                );

                const whatsappUrl = `https://wa.me/5493512345678?text=${whatsappMessage}`;

                return (
                  <div
                    key={vehicle.id}
                    className="
                      min-w-0
                      flex-[0_0_88%]
                      px-3
                      sm:flex-[0_0_68%]
                      md:flex-[0_0_49%]
                      lg:flex-[0_0_37%]
                    "
                  >
                    <motion.article
                      onClick={() => selectSlide(index)}
                      animate={{
                        scale: isSelected ? 1.05 : 0.94,
                        opacity: isSelected ? 1 : 0.68,
                        y: isSelected ? 0 : 8,
                      }}
                      whileHover={{
                        scale: isSelected ? 1.06 : 0.97,
                        y: -4,
                      }}
                      transition={{
                        duration: 0.35,
                        ease: 'easeOut',
                      }}
                      className={`
                        group
                        flex
                        h-full
                        cursor-pointer
                        flex-col
                        overflow-hidden
                        rounded-3xl
                        border
                        bg-white
                        transition-shadow
                        duration-300
                        ${
                          isSelected
                            ? 'border-[#1f4e96]/40 shadow-2xl'
                            : 'border-gray-200 shadow-md'
                        }
                      `}
                    >
                      {/* IMAGEN */}
                      <div className="relative h-[260px] w-full overflow-hidden">
                        <Image
                          src={vehicle.img}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          fill
                          className="
                            object-cover
                            object-center
                            transition-transform
                            duration-700
                            ease-out
                            group-hover:scale-110
                          "
                          sizes="
                            (max-width: 768px) 100vw,
                            (max-width: 1200px) 50vw,
                            33vw
                          "
                          priority={index < 3}
                        />

                        {/* Degradado */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                        {/* BADGES */}
                        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                          {vehicle.featured && (
                            <span className="rounded-full bg-[#1f4e96] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow">
                              Destacado
                            </span>
                          )}

                          {vehicle.opportunity && (
                            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#163b71] shadow">
                              Oportunidad
                            </span>
                          )}

                          {vehicle.newlyAdded && (
                            <span className="rounded-full bg-[#071224] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow">
                              Recién ingresado
                            </span>
                          )}
                        </div>

                        {/* AÑO */}
                        <div className="absolute bottom-4 right-4">
                          <span className="rounded-lg bg-black/60 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur">
                            {vehicle.year}
                          </span>
                        </div>
                      </div>

                      {/* INFORMACIÓN */}
                      <div className="flex flex-1 flex-col p-6">
                        
                        {/* MARCA */}
                        <p className="text-sm font-semibold uppercase tracking-wider text-[#1f4e96]">
                          {vehicle.brand}
                        </p>

                        {/* MODELO */}
                        <h3 className="mt-1 text-2xl font-bold text-gray-900">
                          {vehicle.model}
                        </h3>

                        {/* VERSIÓN */}
                        <p className="mt-1 text-sm font-medium text-gray-500">
                          {vehicle.version}
                        </p>

                        {/* CARACTERÍSTICAS */}
                        <div className="mt-5 grid grid-cols-3 gap-2 border-y border-gray-100 py-4">
                          
                          {/* KM */}
                          <div className="flex flex-col items-center gap-1 text-center">
                            <Gauge
                              size={18}
                              className="text-[#1f4e96]"
                            />

                            <span className="text-xs text-gray-500">
                              Kilometraje
                            </span>

                            <span className="text-sm font-semibold text-gray-800">
                              {vehicle.mileage.toLocaleString('es-AR')} km
                            </span>
                          </div>

                          {/* TRANSMISIÓN */}
                          <div className="flex flex-col items-center gap-1 text-center">
                            <Settings2
                              size={18}
                              className="text-[#1f4e96]"
                            />

                            <span className="text-xs text-gray-500">
                              Caja
                            </span>

                            <span className="text-sm font-semibold text-gray-800">
                              {vehicle.transmission}
                            </span>
                          </div>

                          {/* COMBUSTIBLE */}
                          <div className="flex flex-col items-center gap-1 text-center">
                            <Fuel
                              size={18}
                              className="text-[#1f4e96]"
                            />

                            <span className="text-xs text-gray-500">
                              Combustible
                            </span>

                            <span className="text-sm font-semibold text-gray-800">
                              {vehicle.fuel}
                            </span>
                          </div>
                        </div>

                        {/* PRECIO */}
                        <div className="mt-5">
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Precio
                          </p>

                          <p className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900">
                            {formatPrice(
                              vehicle.price,
                              vehicle.currency
                            )}
                          </p>
                        </div>

                        {/* ACCIONES */}
                        <div className="mt-6 flex gap-3">
                          <Link
                            href={`/vehiculos/${vehicle.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="
                              flex
                              flex-1
                              items-center
                              justify-center
                              gap-2
                              rounded-xl
                              bg-[#071224]
                              px-4
                              py-3
                              text-sm
                              font-semibold
                              text-white
                              transition-all
                              duration-300
                              hover:bg-[#1f4e96]
                            "
                          >
                            Ver vehículo

                            <ArrowRight size={17} />
                          </Link>

                          {/* WHATSAPP */}
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Consultar por WhatsApp sobre ${vehicle.brand} ${vehicle.model}`}
                            className="
                              flex
                              h-12
                              w-12
                              flex-shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              border
                              border-gray-200
                              bg-white
                              text-[#163b71]
                              transition-all
                              duration-300
                              hover:border-[#1f4e96]
                              hover:bg-[#1f4e96]
                              hover:text-white
                            "
                          >
                            <MessageCircle size={21} />
                          </a>
                        </div>
                      </div>
                    </motion.article>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FLECHA IZQUIERDA */}
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Vehículo anterior"
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
              shadow-xl
              transition-all
              duration-300
              hover:scale-110
              hover:bg-gray-50
              md:flex
            "
          >
            <ChevronLeft
              size={26}
              className="text-[#163b71]"
            />
          </button>

          {/* FLECHA DERECHA */}
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Vehículo siguiente"
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
              shadow-xl
              transition-all
              duration-300
              hover:scale-110
              hover:bg-gray-50
              md:flex
            "
          >
            <ChevronRight
              size={26}
              className="text-[#163b71]"
            />
          </button>
        </div>

        {/* INDICADORES */}
        <div className="mt-2 flex justify-center gap-2">
          {vehicles.map((vehicle, index) => {
            const isSelected = selectedIndex === index;

            return (
              <button
                key={vehicle.id}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Ir al vehículo ${index + 1}`}
                className={`
                  h-2.5
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    isSelected
                      ? 'w-8 bg-[#1f4e96]'
                      : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                  }
                `}
              />
            );
          })}
        </div>

        {/* VER TODO EL CATÁLOGO */}
        <div className="mt-10 text-center">
          <Link
            href="/vehiculos"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-[#163b71]
              bg-white
              px-7
              py-3
              font-semibold
              text-[#163b71]
              shadow-sm
              transition-all
              duration-300
              hover:bg-[#163b71]
              hover:text-white
              hover:shadow-md
            "
          >
            Ver todo el catálogo

            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}