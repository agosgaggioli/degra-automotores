'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const slides = [
  {
    id: 'slide1',
    title: 'Encontrá tu próximo vehículo',
    description: 'Gran variedad de autos usados listos para vos.',
    ctaLabel: 'Ver vehículos',
    ctaUrl: '/vehiculos',
    img: '/images/hero1.jpg',
    anim: 'zoomIn',
  },
  {
    id: 'slide2',
    title: 'Financiá tu próximo auto',
    description: 'Opciones de financiación pensadas para vos.',
    ctaLabel: 'Ver financiación',
    ctaUrl: '/financiacion',
    img: '/images/hero2.jpg',
    anim: 'fade',
  },
  {
    id: 'slide3',
    title: 'Tomamos tu usado',
    description: 'Consigná tu vehículo y vende sin preocupaciones.',
    ctaLabel: 'Consignar mi vehículo',
    ctaUrl: '/consignacion',
    img: '/images/hero3.jpg',
    anim: 'slideLeft',
  },
  {
    id: 'slide4',
    title: 'Promociones del mes',
    description: 'No pierdas nuestras mejores ofertas.',
    ctaLabel: 'Consultar',
    ctaUrl: '/financiacion',
    img: '/images/hero4.jpg',
    anim: 'slideRight',
  },
];

const animVariants = {
  initial: { opacity: 0, scale: 1 },
  zoomIn: { opacity: 1, scale: 1.05, transition: { duration: 2 } },
  fade: { opacity: 1, transition: { duration: 2 } },
  slideLeft: { x: [100, 0], opacity: [0, 1], transition: { duration: 1.5 } },
  slideRight: { x: [-100, 0], opacity: [0, 1], transition: { duration: 1.5 } },
};

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  useEffect(() => {
    const timer = setTimeout(() => setCurrent((cur) => (cur + 1) % length), 7000);
    return () => clearTimeout(timer);
  }, [current, length]);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {slides
          .filter((_, i) => i === current)
          .map(({ id, title, description, ctaLabel, ctaUrl, img, anim }) => (
            <motion.div
              key={id}
              className="absolute inset-0 flex flex-col md:flex-row items-center justify-center text-white px-6 md:px-20"
              variants={animVariants}
              initial="initial"
              animate={anim}
              exit={{ opacity: 0, transition: { duration: 1 } }}
              style={{ backgroundAttachment: 'fixed' }}
            >
              <Image
                src={img}
                alt={title}
                fill
                className="object-cover object-center -z-10"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-60 -z-5" />
              <div className="relative max-w-xl text-center md:text-left z-10">
                <h1 className="text-5xl font-extrabold mb-4">{title}</h1>
                <p className="mb-8 text-lg md:text-xl">{description}</p>
                <a
                  href={ctaUrl}
                  className="inline-block bg-bluePrimary hover:bg-blueSecondary px-8 py-4 rounded-lg font-bold transition"
                >
                  {ctaLabel}
                </a>
              </div>
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Slide ${idx + 1}`}
                    className={`w-4 h-4 rounded-full ${
                      idx === current ? 'bg-bluePrimary' : 'bg-white bg-opacity-50'
                    }`}
                    onClick={() => setCurrent(idx)}
                  />
                ))}
              </div>
              <button
                aria-label="Previous slide"
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-40 rounded-full z-20 hover:bg-opacity-70 transition"
                onClick={() => setCurrent(current === 0 ? length - 1 : current - 1)}
              >
                ‹
              </button>
              <button
                aria-label="Next slide"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-40 rounded-full z-20 hover:bg-opacity-70 transition"
                onClick={() => setCurrent((current + 1) % length)}
              >
                ›
              </button>
            </motion.div>
          ))}
      </AnimatePresence>
    </section>
  );
}
