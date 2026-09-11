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

const values = [
  {
    icon: ShieldCheck,
    title: 'Confianza',
    description:
      'Buscamos relaciones claras y transparentes en cada operación.',
  },
  {
    icon: HeartHandshake,
    title: 'Acompañamiento',
    description:
      'No te dejamos solo. Estamos presentes antes, durante y después.',
  },
  {
    icon: Star,
    title: 'Calidad',
    description:
      'Seleccionamos unidades y cuidamos cada detalle de la experiencia.',
  },
  {
    icon: TrendingUp,
    title: 'Crecimiento',
    description:
      'Nos mueve mejorar constantemente y seguir construyendo algo grande.',
  },
];

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
      emblaApi.selectedScrollSnap()
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
    [emblaApi]
  );

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

  useEffect(() => {
    if (!emblaApi) return;

    const interval =
      setInterval(() => {
        emblaApi.scrollNext();
      }, 6500);

    return () =>
      clearInterval(interval);
  }, [emblaApi]);

  return (
    <main className="min-h-screen bg-[#071224]">

      {/* ========================= */}
      {/* HERO */}
      {/* ========================= */}

      <section className="relative overflow-hidden bg-[#071224] pb-20 pt-14 text-white">

        <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#1f4e96]/20 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#163b71]/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">

          {/* TEXTO */}

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
          >

            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7db4ff]">
              Nuestra historia
            </span>

            <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              No vendemos autos.

              <span className="block text-[#7db4ff]">
                Construimos confianza.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-300 md:text-lg">
              Degra Automotores nació con trabajo,
              esfuerzo y una idea clara:
              acompañar a cada persona en uno
              de los momentos más importantes,
              elegir su próximo vehículo.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <Link
                href="/vehiculos"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#1f4e96]
                  px-6
                  py-3.5
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#163b71]
                "
              >
                Ver vehículos
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/contacto"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-white/20
                  bg-white/5
                  px-6
                  py-3.5
                  font-semibold
                  text-white
                  transition
                  hover:bg-white
                  hover:text-[#071224]
                "
              >
                Conocé al equipo
              </Link>

            </div>

          </motion.div>

          {/* IMAGEN */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.1,
            }}
            className="relative"
          >

            <div className="relative h-[380px] overflow-hidden rounded-3xl shadow-2xl md:h-[520px]">

              <Image
                src="/images/about/equipo.jpg"
                alt="Equipo Degra Automotores"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#071224]/70 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5">

                <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#071224] shadow-lg">

                  <Users
                    size={17}
                    className="text-[#1f4e96]"
                  />

                  Un equipo que crece con vos

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </section>

      {/* ========================= */}
      {/* FRASE */}
      {/* ========================= */}

      <section className="bg-white py-20">

        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.6,
            }}
          >

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#1f4e96]">
              Nuestra esencia
            </span>

            <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-bold leading-tight text-[#071224] md:text-4xl lg:text-5xl">
              Empezamos con poco, pero con
              muchas ganas de hacer las cosas
              bien.
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-gray-600 md:text-lg">
              Y esa sigue siendo nuestra forma
              de trabajar. Cada cliente, cada
              consulta y cada vehículo forman
              parte de nuestra historia.
            </p>

          </motion.div>

        </div>

      </section>

      {/* ========================= */}
      {/* HISTORIA CARRUSEL */}
      {/* ========================= */}

      <section className="overflow-hidden bg-[#f3f4f6] py-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-10 text-center">

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#1f4e96]">
              El camino
            </span>

            <h2 className="mt-3 text-3xl font-bold text-[#071224] md:text-4xl">
              Nuestra historia
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Algunos momentos que marcaron
              nuestro crecimiento.
            </p>

          </div>

          {/* CARRUSEL */}

          <div className="relative">

            <div
              ref={emblaRef}
              className="overflow-hidden px-2 py-8 md:px-14"
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
                          px-3
                          sm:flex-[0_0_68%]
                          md:flex-[0_0_50%]
                          lg:flex-[0_0_42%]
                        "
                      >

                        <motion.article
                          onClick={() =>
                            selectSlide(
                              index
                            )
                          }
                          animate={{
                            scale:
                              isSelected
                                ? 1.03
                                : 0.94,
                            opacity:
                              isSelected
                                ? 1
                                : 0.65,
                            y:
                              isSelected
                                ? 0
                                : 8,
                          }}
                          whileHover={{
                            scale:
                              isSelected
                                ? 1.04
                                : 0.97,
                          }}
                          transition={{
                            duration: 0.35,
                          }}
                          className={`
                            group
                            cursor-pointer
                            overflow-hidden
                            rounded-3xl
                            border
                            bg-white
                            shadow-lg
                            transition-all
                            ${
                              isSelected
                                ? 'border-[#1f4e96]/40 shadow-2xl'
                                : 'border-gray-200'
                            }
                          `}
                        >

                          {/* IMAGEN */}

                          <div className="relative h-[250px] overflow-hidden md:h-[290px]">

                            <Image
                              src={
                                item.image
                              }
                              alt={
                                item.title
                              }
                              fill
                              className="
                                object-cover
                                transition-transform
                                duration-700
                                group-hover:scale-105
                              "
                              sizes="
                                (max-width: 640px) 88vw,
                                (max-width: 768px) 68vw,
                                (max-width: 1024px) 50vw,
                                42vw
                              "
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-[#071224]/80 via-transparent to-transparent" />

                            <div className="absolute bottom-4 left-5">

                              <span className="text-4xl font-black tracking-tight text-white md:text-5xl">
                                {item.year}
                              </span>

                            </div>

                          </div>

                          {/* INFO */}

                          <div className="p-6">

                            <h3 className="text-xl font-bold text-[#071224] md:text-2xl">
                              {
                                item.title
                              }
                            </h3>

                            <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-gray-600 md:text-base">
                              {
                                item.description
                              }
                            </p>

                            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#1f4e96]">

                              <CheckCircle2
                                size={17}
                              />

                              Parte de nuestra historia

                            </div>

                          </div>

                        </motion.article>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

            {/* FLECHA IZQUIERDA */}

            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Historia anterior"
              className="
                absolute
                left-0
                top-1/2
                z-10
                hidden
                h-11
                w-11
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white
                text-[#071224]
                shadow-xl
                transition-all
                hover:scale-110
                hover:text-[#1f4e96]
                md:flex
              "
            >
              <ChevronLeft
                size={24}
              />
            </button>

            {/* FLECHA DERECHA */}

            <button
              type="button"
              onClick={scrollNext}
              aria-label="Historia siguiente"
              className="
                absolute
                right-0
                top-1/2
                z-10
                hidden
                h-11
                w-11
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white
                text-[#071224]
                shadow-xl
                transition-all
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

          {/* BOTONES AÑOS */}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">

            {history.map(
              (item, index) => (

                <button
                  key={item.year}
                  type="button"
                  onClick={() =>
                    selectSlide(index)
                  }
                  className={`
                    rounded-full
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    transition-all
                    ${
                      selectedIndex ===
                      index
                        ? 'bg-[#1f4e96] text-white shadow-md'
                        : 'bg-white text-gray-500 hover:text-[#1f4e96]'
                    }
                  `}
                >
                  {item.year}
                </button>

              )
            )}

          </div>

        </div>

      </section>

      {/* ========================= */}
      {/* ESTADÍSTICAS */}
      {/* ========================= */}

      <section className="bg-[#071224] py-16 text-white">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {stats.map(
              (stat) => (

                <motion.div
                  key={stat.label}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  whileHover={{
                    y: -4,
                  }}
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    p-6
                    text-center
                    backdrop-blur
                  "
                >

                  <p className="text-4xl font-black text-white">
                    {stat.value}
                  </p>

                  <p className="mt-2 text-sm text-gray-300">
                    {stat.label}
                  </p>

                </motion.div>

              )
            )}

          </div>

        </div>

      </section>

      {/* ========================= */}
      {/* VALORES */}
      {/* ========================= */}

      <section className="bg-white py-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-12 text-center">

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#1f4e96]">
              Lo que nos mueve
            </span>

            <h2 className="mt-3 text-3xl font-bold text-[#071224] md:text-4xl">
              Más que vender vehículos
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Nuestra forma de trabajar se basa
              en cuatro cosas que no negociamos.
            </p>

          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

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
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  whileHover={{
                    y: -5,
                  }}
                  className="
                    rounded-3xl
                    border
                    border-gray-200
                    bg-white
                    p-6
                    shadow-sm
                    transition-shadow
                    hover:shadow-xl
                  "
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1f4e96]/10 text-[#1f4e96]">

                    <Icon size={23} />

                  </div>

                  <h3 className="mt-5 text-xl font-bold text-[#071224]">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {description}
                  </p>

                </motion.div>

              )
            )}

          </div>

        </div>

      </section>

      {/* ========================= */}
      {/* IDENTIDAD */}
      {/* ========================= */}

      <section className="bg-[#f3f4f6] py-20">

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">

          {/* TEXTO */}

          <div>

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#1f4e96]">
              Somos DR
            </span>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-[#071224] md:text-4xl">
              La agencia creció.
              <br />
              La esencia sigue siendo la misma.
            </h2>

            <p className="mt-5 leading-relaxed text-gray-600">
              Queremos que cuando una persona
              piense en cambiar su auto,
              venderlo o buscar una oportunidad,
              piense en nosotros.
            </p>

            <p className="mt-4 leading-relaxed text-gray-600">
              No por ser los más grandes, sino
              porque sabe que va a encontrar un
              equipo que la escuche, la asesore
              y la acompañe.
            </p>

            <div className="mt-7 space-y-3">

              {[
                'Atención personalizada',
                'Vehículos seleccionados',
                'Opciones de financiación',
                'Consignación de vehículos',
              ].map(
                (item) => (

                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >

                    <CheckCircle2
                      size={19}
                      className="text-[#1f4e96]"
                    />

                    <span className="font-medium text-[#071224]">
                      {item}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

          {/* IMAGEN */}

          <div className="relative">

            <div className="relative h-[420px] overflow-hidden rounded-3xl shadow-xl md:h-[500px]">

              <Image
                src="/images/about/agencia.jpg"
                alt="Degra Automotores"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#071224]/50 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f4e96] text-white">

                  <MapPin size={20} />

                </div>

                <div>

                  <p className="text-xs text-gray-500">
                    Nuestra casa
                  </p>

                  <p className="font-bold text-[#071224]">
                    Degra Automotores
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ========================= */}
      {/* CTA FINAL */}
      {/* ========================= */}

      <section className="relative overflow-hidden bg-[#071224] py-20 text-white">

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1f4e96]/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1f4e96]">

            <CarFront size={28} />

          </div>

          <h2 className="mt-6 text-3xl font-bold md:text-4xl lg:text-5xl">
            Nuestra historia sigue.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-300 md:text-lg">
            Y queremos que tu próximo vehículo
            también forme parte de ella.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              href="/vehiculos"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#1f4e96]
                px-7
                py-3.5
                font-semibold
                text-white
                transition
                hover:bg-[#163b71]
              "
            >
              Ver vehículos

              <ArrowRight size={18} />
            </Link>

            <Link
              href="/contacto"
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                border
                border-white/20
                bg-white/5
                px-7
                py-3.5
                font-semibold
                text-white
                transition
                hover:bg-white
                hover:text-[#071224]
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