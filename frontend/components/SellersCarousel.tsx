'use client';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';

interface Seller {
  id: string;
  name: string;
  role: string;
  photo: string;
  whatsapp: string;
}

const sellers: Seller[] = [
  {
    id: 's1',
    name: 'Juan Pérez',
    role: 'Vendedor',
    photo: '/images/sellers/juan.jpeg',
    whatsapp: '5493512345678',
  },
  {
    id: 's2',
    name: 'María López',
    role: 'Vendedora',
    photo: '/images/sellers/juan.jpeg',
    whatsapp: '5493512345679',
  },
  {
    id: 's3',
    name: 'Carlos Gómez',
    role: 'Vendedor',
    photo: '/images/sellers/juan.jpeg',
    whatsapp: '5493512345680',
  },
];

export default function SellersCarousel() {
  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const [emblaRef, emblaApi] =
    useEmblaCarousel({
      loop: true,
      align: 'center',
      slidesToScroll: 1,
      skipSnaps: false,
      dragFree: false,
    });

  /* ========================= */
  /* ACTUALIZAR CARD ACTIVA */
  /* ========================= */

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setSelectedIndex(
      emblaApi.selectedScrollSnap()
    );
  }, [emblaApi]);

  /* ========================= */
  /* INICIALIZAR EMBLA */
  /* ========================= */

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();

    emblaApi.on(
      'select',
      onSelect
    );

    emblaApi.on(
      'reInit',
      onSelect
    );

    /*
      Fuerza a Embla a recalcular
      tamaños cuando se monta.
    */
    emblaApi.reInit();

    return () => {
      emblaApi.off(
        'select',
        onSelect
      );

      emblaApi.off(
        'reInit',
        onSelect
      );
    };
  }, [emblaApi, onSelect]);

  /* ========================= */
  /* AUTOPLAY */
  /* ========================= */

  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      clearInterval(autoplay);
    };
  }, [emblaApi]);

  /* ========================= */
  /* NAVEGACIÓN */
  /* ========================= */

  const scrollPrev =
    useCallback(() => {
      if (!emblaApi) return;

      emblaApi.scrollPrev();
    }, [emblaApi]);

  const scrollNext =
    useCallback(() => {
      if (!emblaApi) return;

      emblaApi.scrollNext();
    }, [emblaApi]);

  const selectSlide =
    useCallback(
      (index: number) => {
        if (!emblaApi) return;

        emblaApi.scrollTo(index);
      },
      [emblaApi]
    );

  return (
    <section className="relative overflow-hidden bg-white py-16">

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* ========================= */}
        {/* ENCABEZADO */}
        {/* ========================= */}

        <div className="mx-auto mb-7 max-w-2xl text-center">

          <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4e96]">
            Estamos para ayudarte
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-[#071224] md:text-4xl">
            Encontrá tu próximo auto
            con nosotros
          </h2>

          <p className="mt-3 text-gray-600">
            Nuestro equipo está listo
            para asesorarte.
          </p>

        </div>

        {/* ========================= */}
        {/* CARRUSEL */}
        {/* ========================= */}

        <div className="relative">

          {/* VIEWPORT */}

          <div
            ref={emblaRef}
            className="
              overflow-hidden
              px-2
              py-8
              md:px-14
            "
          >

            {/* CONTAINER */}

            <div className="flex touch-pan-y">

              {sellers.map(
                (seller, index) => {

                  const isSelected =
                    selectedIndex === index;

                  const message =
                    encodeURIComponent(
                      `Hola ${seller.name}, estoy buscando un vehículo y quería hacerte una consulta.`
                    );

                  const whatsappUrl =
                    `https://wa.me/${seller.whatsapp}?text=${message}`;

                  return (

                    /* ========================= */
                    /* SLIDE */
                    /* ========================= */

                    <div
                      key={seller.id}
                      className="
                        min-w-0
                        flex-[0_0_84%]
                        px-3
                        sm:flex-[0_0_62%]
                        md:flex-[0_0_46%]
                        lg:flex-[0_0_38%]
                      "
                    >

                      <motion.article
                        onClick={() =>
                          selectSlide(index)
                        }
                        animate={{
                          scale:
                            isSelected
                              ? 1.04
                              : 0.94,

                          opacity:
                            isSelected
                              ? 1
                              : 0.65,

                          y:
                            isSelected
                              ? 0
                              : 6,
                        }}
                        whileHover={{
                          scale:
                            isSelected
                              ? 1.05
                              : 0.97,

                          y: -3,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: 'easeOut',
                        }}
                        className={`
                          flex
                          h-full
                          cursor-pointer
                          flex-col
                          items-center
                          rounded-3xl
                          border
                          bg-white
                          p-5
                          text-center
                          transition-shadow
                          duration-300
                          
                          ${
                            isSelected
                              ? 'border-[#1f4e96]/40 shadow-xl'
                              : 'border-gray-200 shadow-sm'
                          }
                        `}
                      >

                        {/* ========================= */}
                        {/* FOTO */}
                        {/* ========================= */}

                        <div
                          className={`
                            relative
                            mb-4
                            h-28
                            w-28
                            overflow-hidden
                            rounded-full
                            border-4
                            
                            ${
                              isSelected
                                ? 'border-[#1f4e96]/20'
                                : 'border-gray-100'
                            }
                          `}
                        >

                          <Image
                            src={
                              seller.photo
                            }
                            alt={
                              seller.name
                            }
                            fill
                            className="object-cover object-center"
                            sizes="112px"
                          />

                        </div>

                        {/* ========================= */}
                        {/* NOMBRE */}
                        {/* ========================= */}

                        <h3 className="text-lg font-bold text-[#071224]">
                          {seller.name}
                        </h3>

                        <p className="mt-1 text-sm font-medium text-[#1f4e96]">
                          {seller.role}
                        </p>

                        <p className="mt-3 max-w-[260px] text-sm leading-relaxed text-gray-500">
                          Contactalo y recibí
                          asesoramiento
                          personalizado.
                        </p>

                        {/* ========================= */}
                        {/* WHATSAPP */}
                        {/* ========================= */}

                        <a
                          href={
                            whatsappUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                          aria-label={`Contactar a ${seller.name} por WhatsApp`}
                          className="
                            mt-5
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-[#071224]
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition-all
                            duration-300
                            hover:bg-[#1f4e96]
                            hover:shadow-md
                          "
                        >

                          <MessageCircle
                            size={18}
                          />

                          Contactar

                        </a>

                      </motion.article>

                    </div>
                  );
                }
              )}

            </div>

          </div>

          {/* ========================= */}
          {/* FLECHA IZQUIERDA */}
          {/* ========================= */}

          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Vendedor anterior"
            className="
              absolute
              left-0
              top-1/2
              z-30
              hidden
              h-11
              w-11
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-gray-100
              bg-white
              text-[#071224]
              shadow-xl
              transition-all
              duration-300
              hover:scale-110
              hover:text-[#1f4e96]
              md:flex
            "
          >

            <ChevronLeft
              size={24}
            />

          </button>

          {/* ========================= */}
          {/* FLECHA DERECHA */}
          {/* ========================= */}

          <button
            type="button"
            onClick={scrollNext}
            aria-label="Vendedor siguiente"
            className="
              absolute
              right-0
              top-1/2
              z-30
              hidden
              h-11
              w-11
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-gray-100
              bg-white
              text-[#071224]
              shadow-xl
              transition-all
              duration-300
              hover:scale-110
              hover:text-[#1f4e96]
              md:flex
            "
          >

            <ChevronRight
              size={24}
            />

          </button>

        </div>

        {/* ========================= */}
        {/* INDICADORES */}
        {/* ========================= */}

        <div className="mt-1 flex items-center justify-center gap-2">

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
                  h-2
                  rounded-full
                  transition-all
                  duration-300
                  
                  ${
                    selectedIndex ===
                    index
                      ? 'w-7 bg-[#1f4e96]'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }
                `}
              />

            )
          )}

        </div>

      </div>

    </section>
  );
}