'use client';

import React from 'react';
import Link from 'next/link';

import {
  Instagram,
  MessageCircle,
  MapPin,
  Clock3,
  ArrowUpRight,
  CarFront,
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#050d1a] text-white">

      {/* =====================================
          CONTENIDO PRINCIPAL
      ===================================== */}

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.9fr_1fr]">

          {/* =================================
              MARCA
          ================================= */}

          <div>

            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1f4e96]">
                <CarFront size={20} />
              </div>

              <div>
                <p className="text-base font-bold tracking-tight">
                  Degra Automotores
                </p>

                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  Tu próximo vehículo
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">
              Encontrá el vehículo que estás buscando
              con atención personalizada y distintas
              alternativas de financiación.
            </p>

            {/* REDES */}

            <div className="mt-5 flex items-center gap-2">

              <a
                href="https://instagram.com/drautomotores"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Degra Automotores"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-white/10
                  bg-white/[0.03]
                  text-slate-400
                  transition
                  hover:border-[#1f4e96]
                  hover:bg-[#1f4e96]
                  hover:text-white
                "
              >
                <Instagram size={16} />
              </a>

              <a
                href="https://wa.me/5493512345678"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp de Degra Automotores"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-white/10
                  bg-white/[0.03]
                  text-slate-400
                  transition
                  hover:border-[#1f4e96]
                  hover:bg-[#1f4e96]
                  hover:text-white
                "
              >
                <MessageCircle size={16} />
              </a>

            </div>

          </div>

          {/* =================================
              NAVEGACIÓN
          ================================= */}

          <div>

            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white">
              Navegación
            </h3>

            <nav className="mt-5 flex flex-col gap-3">

              <FooterLink href="/">
                Inicio
              </FooterLink>

              <FooterLink href="/vehiculos">
                Vehículos
              </FooterLink>

              <FooterLink href="/financiacion">
                Financiación
              </FooterLink>

              <FooterLink href="/consignacion">
                Consignación
              </FooterLink>

              <FooterLink href="/sobre-nosotros">
                Sobre nosotros
              </FooterLink>

              <FooterLink href="/contacto">
                Contacto
              </FooterLink>

            </nav>

          </div>

          {/* =================================
              SUCURSALES
          ================================= */}

          <div>

            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white">
              Sucursales
            </h3>

            <div className="mt-5 space-y-5">

              {/* CANALS */}

              <div className="flex gap-3">

                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-blue-400"
                />

                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Canals
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Córdoba, Argentina
                  </p>
                </div>

              </div>

              {/* CÓRDOBA */}

              <div className="flex gap-3">

                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-blue-400"
                />

                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Córdoba
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Córdoba Capital, Argentina
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* =================================
              HORARIOS / CONTACTO
          ================================= */}

          <div>

            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white">
              Atención
            </h3>

            <div className="mt-5 flex gap-3">

              <Clock3
                size={16}
                className="mt-0.5 shrink-0 text-blue-400"
              />

              <div>
                <p className="text-sm font-medium text-slate-200">
                  Horarios
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Lunes a viernes
                  <br />
                  9:00 a 19:00
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Sábados
                  <br />
                  9:00 a 13:00
                </p>
              </div>

            </div>

            <Link
              href="/contacto"
              className="
                mt-5
                inline-flex
                items-center
                gap-1.5
                text-xs
                font-semibold
                text-blue-300
                transition
                hover:text-white
              "
            >
              Contactanos

              <ArrowUpRight size={13} />
            </Link>

          </div>

        </div>

      </div>

      {/* =====================================
          BARRA INFERIOR
      ===================================== */}

      <div className="border-t border-white/10">

        <div className="
          mx-auto
          flex
          max-w-7xl
          flex-col
          gap-3
          px-4
          py-5
          sm:px-6
          md:flex-row
          md:items-center
          md:justify-between
          lg:px-8
        ">

          <p className="text-[11px] text-slate-500">
            © {currentYear} Degra Automotores.
            Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4">

            <Link
              href="/admin/login"
              className="text-[11px] text-slate-600 transition hover:text-slate-400"
            >
              Acceso administrativo
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;


/* =========================================
   LINK FOOTER
========================================= */

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink = ({
  href,
  children,
}: FooterLinkProps) => {
  return (
    <Link
      href={href}
      className="
        group
        flex
        w-fit
        items-center
        gap-1
        text-sm
        text-slate-400
        transition
        hover:text-white
      "
    >
      {children}

      <ArrowUpRight
        size={11}
        className="
          opacity-0
          transition
          group-hover:translate-x-0.5
          group-hover:-translate-y-0.5
          group-hover:opacity-100
        "
      />
    </Link>
  );
};