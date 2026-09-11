'use client';

import React from 'react';
import { CheckCircle, User, CreditCard, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: <CheckCircle size={36} color="#1f4e96" />,
    title: 'Vehículos seleccionados',
    description: 'Autos rigurosamente inspeccionados para garantizar calidad.',
  },
  {
    icon: <User size={36} color="#1f4e96" />,
    title: 'Atención personalizada',
    description: 'Asesoramiento dedicado para que elijas el mejor vehículo.',
  },
  {
    icon: <CreditCard size={36} color="#1f4e96" />,
    title: 'Opciones de financiación',
    description: 'Planes flexibles que se adaptan a tu bolsillo.',
  },
  {
    icon: <ShieldCheck size={36} color="#1f4e96" />,
    title: 'Gestión segura',
    description: 'Trámites transparentes y procesos confiables.',
  },
];

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function WhyChooseUs() {
  return (
    <motion.section
      className="max-w-7xl mx-auto px-6 text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={container}
    >
      <h2 className="text-4xl font-bold mb-12 text-black">Comprar un auto debería ser simple.</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {benefits.map(({ icon, title, description }, i) => (
          <motion.div key={i} className="bg-white rounded-lg p-6 shadow-lg" variants={item}>
            <div className="mb-6 mx-auto w-max">{icon}</div>
            <h3 className="text-xl font-semibold mb-3 text-bluePrimary">{title}</h3>
            <p className="text-gray-700">{description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
