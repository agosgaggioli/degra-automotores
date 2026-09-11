'use client';
import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-50 transition-colors duration-500 ${scrolled ? 'bg-bluePrimary shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <a href="/" className="text-white font-bold text-xl">Degra Automotores</a>

        {/* Menu Desktop */}
        <ul className="hidden md:flex space-x-8 text-white font-medium">
          <li><a href="/" className="hover:text-grayLight transition">Inicio</a></li>
          <li><a href="/vehiculos" className="hover:text-grayLight transition">Vehículos</a></li>
          <li><a href="/financiacion" className="hover:text-grayLight transition">Financiación</a></li>
          <li><a href="/consignacion" className="hover:text-grayLight transition">Consignación</a></li>
          <li><a href="/sobre-nosotros" className="hover:text-grayLight transition">Sobre Nosotros</a></li>
          <li><a href="/contacto" className="hover:text-grayLight transition">Contacto</a></li>
        </ul>

        {/* Menu Mobile */}
        <div className="md:hidden flex items-center">
          <a
            href="https://wa.me/5493512345678"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:text-green-600 mr-4"
            aria-label="WhatsApp"
          >
            {/* WhatsApp icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24" stroke="none">
              <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.37 0 0 5.37 0 12a11.96 11.96 0 001.84 6.49L0 24l5.56-1.78A11.95 11.95 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.17-3.48-8.52zM12 21.6a9.59 9.59 0 01-4.91-1.38l-.35-.21-3.3 1.05 1.06-3.21-.22-.34a9.52 9.52 0 01-1.5-5.14c0-5.28 4.28-9.56 9.56-9.56 2.55 0 4.94.99 6.73 2.78a9.42 9.42 0 012.8 6.78c0 5.28-4.29 9.56-9.58 9.56zm5.43-6.68c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.95 1.16-.17.2-.34.22-.64.08a8.83 8.83 0 01-2.58-1.59 9.91 9.91 0 01-1.85-2.29c-.2-.34 0-.52.15-.67.15-.16.3-.34.46-.51.15-.16.2-.26.3-.43.1-.17.05-.3-.02-.44-.06-.15-.67-1.62-.91-2.22-.24-.58-.48-.5-.66-.51-.17-.01-.37-.02-.57-.02-.2 0-.52.08-.8.4-.28.33-1.07 1.05-1.07 2.54 0 1.49 1.1 2.94 1.26 3.14.17.2 2.16 3.3 5.23 4.62.73.31 1.3.49 1.75.63.74.22 1.42.19 1.96.11.6-.09 1.75-.71 2-.14.25.56 1.75 2.54 2 2.72.25.18.4.3.57.24.17-.07.52-.18 1-.7.48-.6.66-1.2.74-1.33.07-.12.07-.21.05-.3-.03-.08-.27-.13-.57-.27z" />
            </svg>
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="text-white focus:outline-none"
          >
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-7 h-7">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <ul className="md:hidden bg-bluePrimary text-white p-4 space-y-4 font-semibold">
          <li><a href="/" className="block hover:text-grayLight transition" onClick={() => setMobileMenuOpen(false)}>Inicio</a></li>
          <li><a href="/vehiculos" className="block hover:text-grayLight transition" onClick={() => setMobileMenuOpen(false)}>Vehículos</a></li>
          <li><a href="/financiacion" className="block hover:text-grayLight transition" onClick={() => setMobileMenuOpen(false)}>Financiación</a></li>
          <li><a href="/consignacion" className="block hover:text-grayLight transition" onClick={() => setMobileMenuOpen(false)}>Consignación</a></li>
          <li><a href="/sobre-nosotros" className="block hover:text-grayLight transition" onClick={() => setMobileMenuOpen(false)}>Sobre Nosotros</a></li>
          <li><a href="/contacto" className="block hover:text-grayLight transition" onClick={() => setMobileMenuOpen(false)}>Contacto</a></li>
        </ul>
      )}
    </nav>
  )
}

export default Navbar;
