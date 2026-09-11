import React from 'react';

const Footer = () => (
  <footer className="bg-blueSecondary text-white py-8 mt-16">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      <div>
        <h3 className="font-bold text-lg mb-2">Degra Automotores</h3>
        <p>Córdoba, Argentina</p>
        <p>Tel: +54 9 351 234 5678</p>
        <p>Dirección: Av. Principal 1234</p>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Links</h4>
        <ul>
          <li><a href="/" className="hover:underline">Inicio</a></li>
          <li><a href="/vehiculos" className="hover:underline">Vehículos</a></li>
          <li><a href="/financiacion" className="hover:underline">Financiación</a></li>
          <li><a href="/consignacion" className="hover:underline">Consignación</a></li>
          <li><a href="/sobre-nosotros" className="hover:underline">Sobre Nosotros</a></li>
          <li><a href="/contacto" className="hover:underline">Contacto</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Redes Sociales</h4>
        <ul>
          <li><a href="https://instagram.com/drautomotores" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a></li>
          <li><a href="https://wa.me/5493512345678" target="_blank" rel="noopener noreferrer" className="hover:underline">WhatsApp</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Horario</h4>
        <p>Lunes a Viernes: 9am - 7pm</p>
        <p>Sábados: 9am - 1pm</p>
      </div>
    </div>
    <div className="text-center mt-6 text-sm text-gray-300">
      &copy; {new Date().getFullYear()} Degra Automotores. Todos los derechos reservados.
      {' · '}
      <a href="/admin/login" className="text-gray-400 hover:underline">Acceso backoffice</a>
    </div>
  </footer>
);

export default Footer;
