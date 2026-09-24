'use client';

import React from 'react';

import {
  CheckCircle2,
  User,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';

import { motion } from 'framer-motion';

/* =========================================
   BENEFICIOS
========================================= */

const benefits = [
  {
    icon: CheckCircle2,
    title: 'Vehículos seleccionados',
    description:
      'Unidades inspeccionadas para ofrecerte calidad y confianza.',
  },
  {
    icon: User,
    title: 'Atención personalizada',
    description:
      'Te acompañamos para encontrar el vehículo indicado para vos.',
  },
  {
    icon: CreditCard,
    title: 'Opciones de financiación',
    description:
      'Alternativas pensadas para facilitar la compra de tu próximo vehículo.',
  },
  {
    icon: ShieldCheck,
    title: 'Gestión segura',
    description:
      'Procesos claros y acompañamiento durante toda la operación.',
  },
];

/* =========================================
   ANIMACIONES
========================================= */

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
    },
  },
};

/* =========================================
   COMPONENT
========================================= */

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-[#071224] py-12">

      {/* LUZ SUTIL */}

      <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-[#1f4e96]/[0.07] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =====================================
            ENCABEZADO
        ===================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 0.35,
          }}
          className="mb-8"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
            ¿Por qué elegirnos?
          </span>

          <h2 className="mt-2 max-w-xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Comprar un auto debería ser simple.
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Te acompañamos durante todo el proceso para
            que puedas elegir con tranquilidad.
          </p>
        </motion.div>

        {/* =====================================
            BENEFICIOS
        ===================================== */}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="
            grid
            overflow-hidden
            rounded-xl
            border
            border-white/10
            bg-[#0c192d]
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {benefits.map(
            (
              {
                icon: Icon,
                title,
                description,
              },
              index,
            ) => (
              <motion.div
                key={title}
                variants={item}
                className={`
                  group
                  relative
                  p-5
                  transition-colors
                  duration-300
                  hover:bg-white/[0.025]

                  ${
                    index !== benefits.length - 1
                      ? 'border-b border-white/10 lg:border-b-0 lg:border-r'
                      : ''
                  }

                  ${
                    index === 1
                      ? 'sm:border-b sm:border-r-0 lg:border-b-0 lg:border-r'
                      : ''
                  }

                  ${
                    index === 0 || index === 2
                      ? 'sm:border-r'
                      : ''
                  }
                `}
              >

                {/* ICONO */}

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-[#3169b7]/25
                    bg-[#1f4e96]/10
                    text-blue-300
                    transition
                    duration-300
                    group-hover:border-[#3169b7]/50
                    group-hover:bg-[#1f4e96]/15
                  "
                >
                  <Icon
                    size={17}
                    strokeWidth={1.8}
                  />
                </div>

                {/* TEXTO */}

                <h3 className="mt-4 text-sm font-semibold text-white">
                  {title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {description}
                </p>

              </motion.div>
            ),
          )}
        </motion.div>

      </div>
    </section>
  );
}