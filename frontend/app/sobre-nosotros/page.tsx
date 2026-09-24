'use client';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';

import {
  ArrowRight,
  CarFront,
  Users,
  MapPin,
  Star,
  ShieldCheck,
  HeartHandshake,
  TrendingUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

/* =========================================
   HISTORIA
========================================= */

const history = [
  {
    year: '2017',
    title: 'El comienzo',
    description:
      'Degra Automotores nace con una idea simple: hacer las cosas de otra manera. Empezamos desde abajo, con mucho trabajo, confianza y ganas de crecer.',
    image: '/images/about/history-2017.jpg',
  },
  {
    year: '2021',
    title: 'Crecimos con nuestros clientes',
    description:
      'Con cada operación fuimos sumando experiencia, clientes y nuevas oportunidades. El boca en boca y la confianza fueron claves para seguir avanzando.',
    image: '/images/about/history-2021.jpg',
  },
  {
    year: '2024',
    title: 'Un equipo cada vez más grande',
    description:
      'La agencia dejó de ser solo un lugar para comprar un vehículo. Empezamos a formar un equipo dedicado a acompañar cada operación de principio a fin.',
    image: '/images/about/history-2024.jpg',
  },
  {
    year: 'Hoy',
    title: 'Seguimos creciendo',
    description:
      'Hoy seguimos con la misma esencia del primer día, pero con más experiencia, más herramientas y un objetivo claro: que comprar o vender un vehículo sea una buena experiencia.',
    image: '/images/about/history-now.jpg',
  },
];

/* =========================================
   VALORES
========================================= */

const values = [
  {
    icon: ShieldCheck,
    title: 'Confianza',
    description:
      'Relaciones claras y transparentes en cada operación.',
  },
  {
    icon: HeartHandshake,
    title: 'Acompañamiento',
    description:
      'Estamos presentes antes, durante y después.',
  },
  {
    icon: Star,
    title: 'Calidad',
    description:
      'Seleccionamos unidades y cuidamos cada detalle.',
  },
  {
    icon: TrendingUp,
    title: 'Crecimiento',
    description:
      'Buscamos mejorar y seguir construyendo todos los días.',
  },
];

/* =========================================
   STATS
========================================= */

const stats = [
  {
    value: '+500',
    label: 'Operaciones realizadas',
  },
  {
    value: '+8',
    label: 'Años de experiencia',
  },
  {
    value: '+300',
    label: 'Clientes que confiaron',
  },
  {
    value: '100%',
    label: 'Compromiso',
  },
];

export default function SobreNosotrosPage() {
  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const [emblaRef, emblaApi] =
    useEmblaCarousel({
      loop: true,
      align: 'center',
      slidesToScroll: 1,
    });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setSelectedIndex(
      emblaApi.selectedScrollSnap(),
    );
  }, [emblaApi]);

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

  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 6500);

    return () =>
      clearInterval(interval);
  }, [emblaApi]);

  return (
    <main className="min-h-screen bg-[#071224] text-white">

      {/* =====================================
          HERO
      ===================================== */}

      <section className="relative overflow-hidden border-b border-white/10">

        <div className="pointer-events-none absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-[#1f4e96]/20 blur-[130px]" />

        <div className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#163b71]/15 blur-[120px]" />

        <div className="
          relative
          mx-auto
          grid
          max-w-7xl
          items-center
          gap-10
          px-4
          pb-12
          pt-28
          sm:px-6
          lg:grid-cols-[1fr_0.9fr]
          lg:px-8
        ">

          {/* TEXTO */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
          >

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              Nuestra historia
            </span>

            <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              No vendemos autos.
              <span className="block text-blue-300">
                Construimos confianza.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Degra Automotores nació con trabajo,
              esfuerzo y una idea clara:
              acompañar a cada persona al momento
              de elegir su próximo vehículo.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">

              <Link
                href="/vehiculos"
                className="
                  inline-flex
                  h-10
                  items-center
                  gap-2
                  rounded-lg
                  bg-[#1f4e96]
                  px-4
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#295eaa]
                "
              >
                Ver vehículos
                <ArrowRight size={15} />
              </Link>

              <Link
                href="/contacto"
                className="
                  inline-flex
                  h-10
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-white/10
                  bg-white/[0.03]
                  px-4
                  text-sm
                  font-semibold
                  text-slate-300
                  transition
                  hover:border-white/20
                  hover:text-white
                "
              >
                Contactarnos
              </Link>

            </div>

          </motion.div>

          {/* IMAGEN */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.7,
            }}
          >

            <div className="relative h-[290px] overflow-hidden rounded-2xl border border-white/10 sm:h-[360px] lg:h-[390px]">

              <Image
                src="/images/about/equipo.jpg"
                alt="Equipo Degra Automotores"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#071224]/75 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4">

                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#071224]/80 px-3 py-2 backdrop-blur">

                  <Users
                    size={15}
                    className="text-blue-300"
                  />

                  <span className="text-xs font-medium text-white">
                    Un equipo que crece con vos
                  </span>

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </section>

      {/* =====================================
          ESTADÍSTICAS
      ===================================== */}

      <section className="border-b border-white/10">

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">

            {stats.map((stat) => (
              <div
                key={stat.label}
                className="
                  rounded-xl
                  border
                  border-white/10
                  bg-[#0c192d]
                  px-4
                  py-4
                  text-center
                "
              >

                <p className="text-2xl font-bold text-white sm:text-3xl">
                  {stat.value}
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  {stat.label}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* =====================================
          HISTORIA
      ===================================== */}

      <section className="overflow-hidden border-b border-white/10 py-14">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
                El camino
              </span>

              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                Nuestra historia
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Algunos momentos que marcaron nuestro crecimiento.
              </p>

            </div>

            <div className="hidden gap-2 md:flex">

              <button
                type="button"
                onClick={scrollPrev}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#0c192d] text-slate-400 transition hover:border-[#3169b7] hover:text-white"
              >
                <ChevronLeft size={17} />
              </button>

              <button
                type="button"
                onClick={scrollNext}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#0c192d] text-slate-400 transition hover:border-[#3169b7] hover:text-white"
              >
                <ChevronRight size={17} />
              </button>

            </div>

          </div>

          <div
            ref={emblaRef}
            className="overflow-hidden"
          >

            <div className="flex touch-pan-y">

              {history.map(
                (item, index) => {

                  const isSelected =
                    index ===
                    selectedIndex;

                  return (
                    <div
                      key={item.year}
                      className="
                        min-w-0
                        flex-[0_0_88%]
                        pr-3
                        sm:flex-[0_0_60%]
                        md:flex-[0_0_45%]
                        lg:flex-[0_0_34%]
                      "
                    >

                      <motion.article
                        onClick={() =>
                          selectSlide(index)
                        }
                        animate={{
                          opacity:
                            isSelected
                              ? 1
                              : 0.55,
                        }}
                        transition={{
                          duration: 0.25,
                        }}
                        className="
                          group
                          h-full
                          cursor-pointer
                          overflow-hidden
                          rounded-xl
                          border
                          border-white/10
                          bg-[#0c192d]
                          transition
                          hover:border-[#3169b7]/70
                        "
                      >

                        <div className="relative h-[185px] overflow-hidden">

                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="
                              (max-width: 640px) 88vw,
                              (max-width: 768px) 60vw,
                              (max-width: 1024px) 45vw,
                              34vw
                            "
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-[#071224]/85 via-transparent to-transparent" />

                          <span className="absolute bottom-3 left-4 text-2xl font-bold text-white">
                            {item.year}
                          </span>

                        </div>

                        <div className="p-4">

                          <h3 className="text-base font-semibold text-white">
                            {item.title}
                          </h3>

                          <p className="mt-2 line-clamp-4 text-xs leading-5 text-slate-400">
                            {item.description}
                          </p>

                        </div>

                      </motion.article>

                    </div>
                  );
                },
              )}

            </div>

          </div>

          {/* AÑOS */}

          <div className="mt-5 flex flex-wrap gap-2">

            {history.map(
              (item, index) => (
                <button
                  key={item.year}
                  type="button"
                  onClick={() =>
                    selectSlide(index)
                  }
                  className={`
                    h-8
                    rounded-lg
                    px-3
                    text-xs
                    font-semibold
                    transition
                    ${
                      selectedIndex ===
                      index
                        ? 'bg-[#1f4e96] text-white'
                        : 'border border-white/10 bg-[#0c192d] text-slate-500 hover:text-white'
                    }
                  `}
                >
                  {item.year}
                </button>
              ),
            )}

          </div>

        </div>

      </section>

      {/* =====================================
          VALORES
      ===================================== */}

      <section className="border-b border-white/10 py-14">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-7">

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
              Lo que nos mueve
            </span>

            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Nuestra forma de trabajar
            </h2>

            <p className="mt-2 max-w-xl text-sm text-slate-500">
              Cuatro principios que están presentes en cada operación.
            </p>

          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {values.map(
              ({
                icon: Icon,
                title,
                description,
              }) => (

                <motion.div
                  key={title}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  className="
                    rounded-xl
                    border
                    border-white/10
                    bg-[#0c192d]
                    p-4
                  "
                >

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1f4e96]/15 text-blue-300">
                    <Icon size={17} />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-white">
                    {title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {description}
                  </p>

                </motion.div>

              ),
            )}

          </div>

        </div>

      </section>

      {/* =====================================
          IDENTIDAD
      ===================================== */}

      <section className="border-b border-white/10 py-14">

        <div className="
          mx-auto
          grid
          max-w-7xl
          items-center
          gap-8
          px-4
          sm:px-6
          lg:grid-cols-2
          lg:px-8
        ">

          {/* IMAGEN */}

          <div className="relative h-[300px] overflow-hidden rounded-2xl border border-white/10 sm:h-[360px]">

            <Image
              src="/images/about/agencia.jpg"
              alt="Degra Automotores"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#071224]/60 via-transparent to-transparent" />

            <div className="absolute bottom-4 left-4">

              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#071224]/80 px-3 py-2 backdrop-blur">

                <MapPin
                  size={15}
                  className="text-blue-300"
                />

                <span className="text-xs font-medium">
                  Degra Automotores
                </span>

              </div>

            </div>

          </div>

          {/* TEXTO */}

          <div>

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
              Somos Degra
            </span>

            <h2 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl">
              La agencia creció.
              <br />
              La esencia sigue siendo la misma.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">
              Queremos que cuando una persona piense en
              cambiar su auto, venderlo o buscar una
              oportunidad, piense en nosotros.
            </p>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
              No por ser los más grandes, sino porque
              sabe que va a encontrar un equipo que la
              escuche, la asesore y la acompañe.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">

              {[
                'Atención personalizada',
                'Vehículos seleccionados',
                'Opciones de financiación',
                'Consignación de vehículos',
              ].map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-2"
                >

                  <CheckCircle2
                    size={15}
                    className="text-blue-300"
                  />

                  <span className="text-xs font-medium text-slate-300">
                    {item}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================
          CTA
      ===================================== */}

      <section className="relative overflow-hidden py-14">

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1f4e96]/15 blur-[120px]" />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">

          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#1f4e96]">
            <CarFront size={21} />
          </div>

          <h2 className="mt-5 text-2xl font-semibold sm:text-3xl">
            Nuestra historia sigue.
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
            Y queremos que tu próximo vehículo también forme parte de ella.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">

            <Link
              href="/vehiculos"
              className="
                inline-flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-[#1f4e96]
                px-5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#295eaa]
              "
            >
              Ver vehículos
              <ArrowRight size={15} />
            </Link>

            <Link
              href="/contacto"
              className="
                inline-flex
                h-10
                items-center
                justify-center
                rounded-lg
                border
                border-white/10
                bg-white/[0.03]
                px-5
                text-sm
                font-semibold
                text-slate-300
                transition
                hover:border-white/20
                hover:text-white
              "
            >
              Contactarnos
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}