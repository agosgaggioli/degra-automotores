'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRight,
  ShieldCheck,
  Megaphone,
  BadgeCheck,
  Users,
  Check,
} from 'lucide-react';

/* =========================================
   BENEFICIOS
========================================= */

const benefits = [
  {
    label: 'Mayor exposición',
    icon: Megaphone,
  },
  {
    label: 'Gestión profesional',
    icon: BadgeCheck,
  },
  {
    label: 'Operación segura',
    icon: ShieldCheck,
  },
  {
    label: 'Acompañamiento',
    icon: Users,
  },
];

/* =========================================
   COMPONENT
========================================= */

export default function ConsignmentSection() {
  return (
    <section className="relative overflow-hidden bg-[#071224] py-14">

      {/* =====================================
          LUZ DE FONDO
      ===================================== */}

      <div className="pointer-events-none absolute -right-40 top-0 h-[420px] w-[420px] rounded-full bg-[#1f4e96]/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =====================================
            CONTENEDOR PRINCIPAL
        ===================================== */}

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-white/10
            bg-[#0c192d]
          "
        >

          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">

            {/* =================================
                IMAGEN
            ================================= */}

            <div
              className="
                relative
                min-h-[280px]
                border-b
                border-white/10
                sm:min-h-[340px]
                lg:min-h-[420px]
                lg:border-b-0
                lg:border-r
              "
            >

              <Image
                src="/images/consignacion.jpeg"
                alt="Consignación de vehículos"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />

              {/* OVERLAY */}

              <div className="absolute inset-0 bg-gradient-to-t from-[#071224]/80 via-[#071224]/10 to-transparent" />

              {/* BADGE INFERIOR */}

              <div className="absolute bottom-4 left-4 right-4">

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-white/10
                    bg-[#071224]/80
                    px-3
                    py-2
                    backdrop-blur-md
                  "
                >

                  <ShieldCheck
                    size={15}
                    className="text-blue-300"
                  />

                  <span className="text-xs font-medium text-white">
                    Tu vehículo, en buenas manos
                  </span>

                </div>

              </div>

            </div>

            {/* =================================
                CONTENIDO
            ================================= */}

            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">

              {/* ETIQUETA */}

              <span
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-blue-300
                "
              >
                Consignación
              </span>

              {/* TÍTULO */}

              <h2
                className="
                  mt-3
                  max-w-xl
                  text-2xl
                  font-semibold
                  leading-tight
                  tracking-tight
                  text-white
                  sm:text-3xl
                "
              >
                Nosotros vendemos
                <span className="text-blue-300">
                  {' '}tu vehículo por vos.
                </span>
              </h2>

              {/* DESCRIPCIÓN */}

              <p
                className="
                  mt-4
                  max-w-xl
                  text-sm
                  leading-6
                  text-slate-400
                "
              >
                Nos encargamos de publicarlo, gestionar
                las consultas y acompañarte durante toda
                la operación para que vender sea mucho
                más simple.
              </p>

              {/* =================================
                  BENEFICIOS
              ================================= */}

              <div
                className="
                  mt-6
                  grid
                  gap-x-6
                  gap-y-3
                  sm:grid-cols-2
                "
              >

                {benefits.map(
                  ({
                    label,
                    icon: Icon,
                  }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2.5"
                    >

                      <div
                        className="
                          flex
                          h-7
                          w-7
                          shrink-0
                          items-center
                          justify-center
                          rounded-md
                          bg-[#1f4e96]/15
                          text-blue-300
                        "
                      >
                        <Icon size={14} />
                      </div>

                      <span
                        className="
                          text-xs
                          font-medium
                          text-slate-300
                        "
                      >
                        {label}
                      </span>

                    </div>
                  ),
                )}

              </div>

              {/* =================================
                  SEPARADOR INTERNO
              ================================= */}

              <div className="my-6 h-px bg-white/10" />

              {/* =================================
                  INFO + ACCIONES
              ================================= */}

              <div
                className="
                  flex
                  flex-col
                  gap-5
                  xl:flex-row
                  xl:items-center
                  xl:justify-between
                "
              >

                {/* INFORMACIÓN */}

                <div className="flex items-start gap-2">

                  <Check
                    size={15}
                    className="mt-0.5 shrink-0 text-blue-300"
                  />

                  <p
                    className="
                      max-w-xs
                      text-[11px]
                      leading-5
                      text-slate-500
                    "
                  >
                    Cargar los datos de tu vehículo no
                    implica ningún compromiso.
                  </p>

                </div>

                {/* BOTONES */}

                <div className="flex flex-wrap gap-2">

                  <Link
                    href="/consignacion"
                    className="
                      inline-flex
                      h-10
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      bg-[#1f4e96]
                      px-4
                      text-xs
                      font-semibold
                      text-white
                      transition
                      hover:bg-[#295eaa]
                    "
                  >
                    Consignar vehículo

                    <ArrowRight size={14} />
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
                      bg-transparent
                      px-4
                      text-xs
                      font-semibold
                      text-slate-300
                      transition
                      hover:border-white/20
                      hover:bg-white/[0.03]
                      hover:text-white
                    "
                  >
                    Hablar con un asesor
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}