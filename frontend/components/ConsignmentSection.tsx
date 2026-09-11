'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Megaphone,
  BadgeCheck,
  Users,
} from 'lucide-react';

const benefits = [
  {
    label: 'Más exposición',
    icon: Megaphone,
  },
  {
    label: 'Gestión profesional',
    icon: BadgeCheck,
  },
  {
    label: 'Seguridad',
    icon: ShieldCheck,
  },
  {
    label: 'Acompañamiento',
    icon: Users,
  },
];

export default function ConsignmentSection() {
  return (
    <section className="relative overflow-hidden bg-[#071224] py-20">
      {/* DECORACIÓN DE FONDO */}
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 md:grid-cols-2 lg:gap-16 lg:px-8">
        
        {/* ========================= */}
        {/* IMAGEN */}
        {/* ========================= */}

        <div className="relative">
          <div className="relative h-[320px] overflow-hidden rounded-3xl shadow-2xl sm:h-[380px] md:h-[440px]">
            <Image
              src="/images/consignacion.jpeg"
              alt="Consignación de vehículos"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#071224]/75 via-[#071224]/10 to-transparent" />

            {/* TEXTO SOBRE LA FOTO */}
            <div className="absolute bottom-5 left-5 right-5">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-200">
                Tu auto en buenas manos
              </p>

              <p className="mt-2 max-w-md text-lg font-semibold leading-relaxed text-white">
                Nosotros nos encargamos de mostrarlo, gestionarlo y acompañarte
                durante toda la venta.
              </p>
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* CONTENIDO */}
        {/* ========================= */}

        <div className="text-white">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
            Vendé sin complicaciones
          </span>

          <h2 className="max-w-xl text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            Nosotros lo vendemos por vos
          </h2>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-300 md:text-lg">
            Publicamos tu vehículo, gestionamos las consultas y te acompañamos
            durante toda la operación para que vendas de forma más simple,
            segura y profesional.
          </p>

          {/* ========================= */}
          {/* BENEFICIOS */}
          {/* ========================= */}

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {benefits.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  px-4
                  py-4
                  backdrop-blur
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-blue-400/30
                  hover:bg-white/10
                "
              >
                {/* ICONO */}
                <div
                  className="
                    flex
                    h-10
                    w-10
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#1f4e96]
                  "
                >
                  <Icon size={20} className="text-white" />
                </div>

                <span className="font-semibold text-white">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* ========================= */}
          {/* BOTONES */}
          {/* ========================= */}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            
            {/* CONSIGNAR */}
            <Link
              href="/consignacion"
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
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#163b71]
                hover:shadow-xl
              "
            >
              Consignar mi vehículo

              <ArrowRight size={18} />
            </Link>

            {/* ASESORAMIENTO */}
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
                backdrop-blur
                transition-all
                duration-300
                hover:bg-white
                hover:text-[#071224]
              "
            >
              Quiero asesoramiento
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}