import React from 'react';

const Hero = () => (
  <section
    className="relative h-screen flex flex-col justify-center items-center text-white text-center px-6"
    style={{
      backgroundImage: "url('/images/hero-car-background.jpg')",
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
  >
    <div className="absolute inset-0 bg-black bg-opacity-60"></div>
    <div className="relative z-10 max-w-4xl">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">Bienvenido a Degra Automotores</h1>
      <p className="text-lg md:text-2xl mb-8 drop-shadow-md">Tu concesionaria de confianza en vehículos usados</p>
      <div className="flex justify-center gap-6 flex-wrap">
        <a href="/vehiculos" className="bg-bluePrimary hover:bg-blueSecondary text-white font-semibold py-3 px-8 rounded-lg transition">Ver vehículos</a>
        <a href="/financiacion" className="bg-transparent border border-white hover:bg-white hover:text-bluePrimary text-white font-semibold py-3 px-8 rounded-lg transition">Consultar financiación</a>
        <a href="/consignacion" className="bg-blueSecondary hover:bg-bluePrimary text-white font-semibold py-3 px-8 rounded-lg transition">Consigná tu vehículo</a>
      </div>
    </div>
  </section>
);

export default Hero;
