'use client';

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import Image from "next/image";

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
  slug: string;
  createdAt: string; // Para ordenar
}

// Ejemplo de últimos vehículos ingresados, ordenados por createdAt DESC
const newArrivals: Vehicle[] = [
  {
    id: "nv1",
    brand: "Chevrolet",
    model: "S10",
    version: "LTZ",
    year: 2023,
    mileage: 15000,
    price: 6200000,
    currency: "ARS",
    transmission: "Automática",
    fuel: "Diésel",
    img: "/images/vehicles/s10.jpg",
    slug: "chevrolet-s10-ltz-2023",
    createdAt: "2024-08-20T12:00:00Z",
  },
  {
    id: "nv2",
    brand: "Renault",
    model: "Duster",
    version: "Confort",
    year: 2024,
    mileage: 5000,
    price: 4300000,
    currency: "ARS",
    transmission: "Manual",
    fuel: "Nafta",
    img: "/images/vehicles/duster.jpg",
    slug: "renault-duster-confort-2024",
    createdAt: "2024-08-18T08:30:00Z",
  },
  {
    id: "nv3",
    brand: "Fiat",
    model: "Toro",
    version: "Volcano",
    year: 2023,
    mileage: 12000,
    price: 5500000,
    currency: "ARS",
    transmission: "Automática",
    fuel: "Nafta",
    img: "/images/vehicles/toro.jpg",
    slug: "fiat-toro-volcano-2023",
    createdAt: "2024-08-19T10:15:00Z",
  },
  // Hasta 8 vehículos...
];

const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency }).format(price);
};

export default function NewArrivalsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ containScroll: "trimSnaps", loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", onSelect);
      onSelect();
    }
  }, [emblaApi, onSelect]);

  // Autoplay cada 7 segundos
  useEffect(() => {
    if (!emblaApi) return;
    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, 7000);
    return () => clearInterval(timer);
  }, [emblaApi]);

  return (
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-4xl font-bold mb-4 text-center text-black">Recién ingresados</h2>
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex gap-8">
          {newArrivals.map((vehicle, index) => {
            const isSelected = index === selectedIndex;
            return (
              <motion.div
                key={vehicle.id}
                className={`embla__slide bg-white rounded-lg shadow-md cursor-pointer relative transform transition-transform duration-300 ${
                  isSelected ? "scale-105 shadow-xl" : "scale-95 opacity-80"
                }`}
                whileHover={{ scale: 1.07, y: -6 }}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <a href={`/vehiculos/${vehicle.slug}`} aria-label={`Ver vehículo ${vehicle.brand} ${vehicle.model}`}>
                  <div className="relative w-full h-56 overflow-hidden rounded-t-lg">
                    <Image
                      src={vehicle.img}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      fill
                      className="object-cover object-center transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={index < 3}
                    />
                  </div>
                  <div className="p-4 text-black">
                    <h3 className="text-xl font-semibold mb-1">{vehicle.brand} {vehicle.model}</h3>
                    <p className="text-sm mb-1">{vehicle.version} • {vehicle.year}</p>
                    <p className="text-sm mb-1">{vehicle.mileage.toLocaleString()} km</p>
                    <p className="text-lg font-bold mb-2">{formatPrice(vehicle.price, vehicle.currency)}</p>
                    <p className="text-sm">{vehicle.transmission} • {vehicle.fuel}</p>
                  </div>
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="text-center mt-8">
        <a
          href="/vehiculos"
          className="inline-block bg-blueSecondary hover:bg-bluePrimary text-white px-8 py-3 rounded font-bold transition"
        >
          Ver todo el catálogo
        </a>
      </div>
    </div>
  );
}
