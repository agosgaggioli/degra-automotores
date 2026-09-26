'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Menu,
  X,
  MessageCircle,
  ArrowRight,
  CarFront,
} from 'lucide-react';

/* =========================================
   NAVEGACIÓN
========================================= */

const navigation = [
  {
    label: 'Inicio',
    href: '/',
  },
  {
    label: 'Vehículos',
    href: '/vehiculos',
  },
  {
    label: 'Financiación',
    href: '/financiacion',
  },
  {
    label: 'Consignación',
    href: '/consignacion',
  },
  {
    label: 'Sobre nosotros',
    href: '/sobre-nosotros',
  },
];

/* =========================================
   NAVBAR
========================================= */

export default function Navbar() {
  const pathname = usePathname();

  const [scrolled, setScrolled] =
    useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  /* =========================================
     SCROLL
  ========================================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener(
      'scroll',
      handleScroll,
      { passive: true },
    );

    return () =>
      window.removeEventListener(
        'scroll',
        handleScroll,
      );
  }, []);

  /* =========================================
     CERRAR MENÚ AL CAMBIAR DE PÁGINA
  ========================================= */

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  /* =========================================
     BLOQUEAR SCROLL CON MENÚ MOBILE
  ========================================= */

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow =
        'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  /* =========================================
     LINK ACTIVO
  ========================================= */

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }

    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`
          fixed
          left-0
          right-0
          top-0
          z-50
          transition-all
          duration-300
          ${
            scrolled || mobileMenuOpen
              ? `
                border-b
                border-white/10
                bg-[#071224]/95
                shadow-[0_8px_30px_rgba(0,0,0,0.18)]
                backdrop-blur-xl
              `
              : `
                border-b
                border-transparent
                bg-[#071224]/40
                backdrop-blur-sm
              `
          }
        `}
      >
        <div className="
          mx-auto
          flex
          h-[72px]
          max-w-7xl
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-8
        ">

          {/* =================================
              MARCA
          ================================= */}

          <Link
            href="/"
            className="
              group
              flex
              shrink-0
              items-center
              gap-2.5
            "
            aria-label="Degra Automotores - Inicio"
          >
            <div className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              bg-[#1f4e96]
              text-white
              transition
              duration-300
              group-hover:bg-[#295eaa]
            ">
              <CarFront size={18} />
            </div>

            <div className="leading-none">

              <p className="
                text-sm
                font-bold
                tracking-tight
                text-white
                sm:text-[15px]
              ">
                Degra Automotores
              </p>

              <p className="
                mt-1
                hidden
                text-[8px]
                font-medium
                uppercase
                tracking-[0.18em]
                text-slate-500
                sm:block
              ">
                Tu próximo vehículo
              </p>

            </div>
          </Link>

          {/* =================================
              DESKTOP NAVIGATION
          ================================= */}

          <nav
            className="
              hidden
              items-center
              lg:flex
            "
            aria-label="Navegación principal"
          >
            <div className="
              flex
              items-center
              rounded-xl
              border
              border-white/[0.07]
              bg-white/[0.025]
              p-1
            ">

              {navigation.map((item) => {
                const active =
                  isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      relative
                      flex
                      h-8
                      items-center
                      rounded-lg
                      px-3
                      text-[12px]
                      font-medium
                      transition-all
                      duration-200
                      ${
                        active
                          ? `
                            bg-white/[0.08]
                            text-white
                          `
                          : `
                            text-slate-400
                            hover:bg-white/[0.04]
                            hover:text-white
                          `
                      }
                    `}
                  >
                    {item.label}

                    {active && (
                      <span className="
                        absolute
                        bottom-[3px]
                        left-1/2
                        h-[2px]
                        w-3
                        -translate-x-1/2
                        rounded-full
                        bg-blue-400
                      " />
                    )}

                  </Link>
                );
              })}

            </div>
          </nav>

          {/* =================================
              ACCIONES DESKTOP
          ================================= */}

          <div className="
            hidden
            items-center
            gap-2
            lg:flex
          ">

            {/* WHATSAPP */}

            <a
              href="https://wa.me/3463406181"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar por WhatsApp"
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
                hover:border-[#3169b7]
                hover:bg-[#1f4e96]
                hover:text-white
              "
            >
              <MessageCircle size={16} />
            </a>

            {/* CONTACTO */}

            <Link
              href="/contacto"
              className="
                flex
                h-9
                items-center
                justify-center
                gap-1.5
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
              Contactanos

              <ArrowRight size={13} />
            </Link>

          </div>

          {/* =================================
              MOBILE ACTIONS
          ================================= */}

          <div className="
            flex
            items-center
            gap-2
            lg:hidden
          ">

            <a
              href="https://wa.me/5493512345678"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar por WhatsApp"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-white/10
                bg-white/[0.04]
                text-slate-300
                transition
                hover:bg-[#1f4e96]
                hover:text-white
              "
            >
              <MessageCircle size={16} />
            </a>

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  (prev) => !prev,
                )
              }
              aria-label={
                mobileMenuOpen
                  ? 'Cerrar menú'
                  : 'Abrir menú'
              }
              aria-expanded={
                mobileMenuOpen
              }
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-white/10
                bg-white/[0.04]
                text-white
                transition
                hover:bg-white/[0.08]
              "
            >
              {mobileMenuOpen ? (
                <X size={18} />
              ) : (
                <Menu size={18} />
              )}
            </button>

          </div>

        </div>

        {/* =================================
            MOBILE MENU
        ================================= */}

        <div
          className={`
            overflow-hidden
            border-white/10
            bg-[#071224]
            transition-all
            duration-300
            lg:hidden
            ${
              mobileMenuOpen
                ? `
                  max-h-[520px]
                  border-t
                  opacity-100
                `
                : `
                  max-h-0
                  border-t-0
                  opacity-0
                `
            }
          `}
        >
          <div className="
            mx-auto
            max-w-7xl
            px-4
            pb-5
            pt-3
            sm:px-6
          ">

            {/* LINKS */}

            <nav
              className="space-y-1"
              aria-label="Navegación móvil"
            >
              {navigation.map((item) => {
                const active =
                  isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex
                      h-11
                      items-center
                      justify-between
                      rounded-lg
                      px-3
                      text-sm
                      font-medium
                      transition
                      ${
                        active
                          ? `
                            bg-[#1f4e96]/15
                            text-white
                          `
                          : `
                            text-slate-400
                            hover:bg-white/[0.04]
                            hover:text-white
                          `
                      }
                    `}
                  >
                    <span className="flex items-center gap-3">

                      {active && (
                        <span className="
                          h-1.5
                          w-1.5
                          rounded-full
                          bg-blue-400
                        " />
                      )}

                      {item.label}

                    </span>

                    <ArrowRight
                      size={13}
                      className={
                        active
                          ? 'text-blue-300'
                          : 'text-slate-600'
                      }
                    />

                  </Link>
                );
              })}
            </nav>

            {/* SEPARADOR */}

            <div className="my-3 h-px bg-white/10" />

            {/* CONTACTO */}

            <Link
              href="/contacto"
              className="
                flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-[#1f4e96]
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#295eaa]
              "
            >
              Contactanos

              <ArrowRight size={14} />
            </Link>

            <p className="
              mt-3
              text-center
              text-[10px]
              text-slate-600
            ">
              Degra Automotores · Córdoba
            </p>

          </div>
        </div>

      </header>

      {/* =====================================
          OVERLAY MOBILE
      ===================================== */}

      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() =>
            setMobileMenuOpen(false)
          }
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

    </>
  );
}