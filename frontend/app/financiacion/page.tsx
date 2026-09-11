'use client';

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  Search,
  SlidersHorizontal,
  X,
  CreditCard,
  Building2,
  CarFront,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  BadgePercent,
} from 'lucide-react';

interface Financing {
  id: string;
  type: 'general' | 'brand';
  bank: string;
  logo: string;
  name: string;
  cuotas: number;
  tasa: string;
  anticipo: string;
  beneficio: string;
  url: string;
  brand?: string;
}

/* ========================= */
/* DATOS DE EJEMPLO */
/* ========================= */

const financings: Financing[] = [
  {
    id: 'fin1',
    type: 'general',
    bank: 'Banco Nación',
    logo: '/images/bancoNacion.png',
    name: 'Plan Nación 24 Cuotas',
    cuotas: 24,
    tasa: '18%',
    anticipo: '30%',
    beneficio:
      'Tasa fija y cuotas sin sorpresas.',
    url: '/contacto',
  },
  {
    id: 'fin2',
    type: 'general',
    bank: 'Santander',
    logo: '/images/bancoSantander.png',
    name: 'Santander Flex',
    cuotas: 36,
    tasa: '20%',
    anticipo: '25%',
    beneficio:
      'Financiación flexible con aprobación rápida.',
    url: '/contacto',
  },
  {
    id: 'fin3',
    type: 'general',
    bank: 'Banco Galicia',
    logo: '/images/bancoGalicia.png',
    name: 'Galicia Auto Fácil',
    cuotas: 30,
    tasa: '22%',
    anticipo: '35%',
    beneficio:
      'Pago anticipado sin costos extra.',
    url: '/contacto',
  },

  {
    id: 'fin4',
    type: 'brand',
    bank: 'Banco Nación',
    logo: '/images/bancoNacion.png',
    name: 'Toyota Plan Especial',
    cuotas: 48,
    tasa: '19%',
    anticipo: '30%',
    beneficio:
      'Financiación especial para unidades Toyota seleccionadas.',
    brand: 'Toyota',
    url: '/contacto',
  },
  {
    id: 'fin5',
    type: 'brand',
    bank: 'Santander',
    logo: '/images/bancoSantander.png',
    name: 'Ford Santander',
    cuotas: 36,
    tasa: '17%',
    anticipo: '25%',
    beneficio:
      'Condiciones preferenciales para vehículos Ford.',
    brand: 'Ford',
    url: '/contacto',
  },
  {
    id: 'fin6',
    type: 'brand',
    bank: 'Banco Galicia',
    logo: '/images/bancoGalicia.png',
    name: 'Volkswagen Galicia',
    cuotas: 48,
    tasa: '21%',
    anticipo: '35%',
    beneficio:
      'Plan exclusivo para unidades Volkswagen seleccionadas.',
    brand: 'Volkswagen',
    url: '/contacto',
  },
  {
    id: 'fin7',
    type: 'brand',
    bank: 'Banco Nación',
    logo: '/images/bancoNacion.png',
    name: 'Chevrolet Nación',
    cuotas: 24,
    tasa: '18%',
    anticipo: '30%',
    beneficio:
      'Financiación especial para Chevrolet.',
    brand: 'Chevrolet',
    url: '/contacto',
  },
  {
    id: 'fin8',
    type: 'brand',
    bank: 'Santander',
    logo: '/images/bancoSantander.png',
    name: 'Renault Santander',
    cuotas: 36,
    tasa: '20%',
    anticipo: '25%',
    beneficio:
      'Alternativa flexible para unidades Renault.',
    brand: 'Renault',
    url: '/contacto',
  },
];

const ITEMS_PER_PAGE = 6;

type FinancingType =
  | 'all'
  | 'general'
  | 'brand';

export default function FinanciacionPage() {
  const [search, setSearch] =
    useState('');

  const [selectedType, setSelectedType] =
    useState<FinancingType>('all');

  const [selectedBank, setSelectedBank] =
    useState('');

  const [selectedBrand, setSelectedBrand] =
    useState('');

  const [selectedCuotas, setSelectedCuotas] =
    useState('');

  const [page, setPage] =
    useState(1);

  /* ========================= */
  /* OPCIONES */
  /* ========================= */

  const banks = useMemo(() => {
    return Array.from(
      new Set(
        financings.map(
          (financing) =>
            financing.bank
        )
      )
    ).sort();
  }, []);

  const brands = useMemo(() => {
    return Array.from(
      new Set(
        financings
          .map(
            (financing) =>
              financing.brand
          )
          .filter(
            (
              brand
            ): brand is string =>
              !!brand
          )
      )
    ).sort();
  }, []);

  const cuotasOptions =
    useMemo(() => {
      return Array.from(
        new Set(
          financings.map(
            (financing) =>
              financing.cuotas
          )
        )
      ).sort((a, b) => a - b);
    }, []);

  /* ========================= */
  /* FILTROS */
  /* ========================= */

  const filteredFinancings =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return financings.filter(
        (financing) => {
          const matchesSearch =
            !normalizedSearch ||
            financing.name
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            financing.bank
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            financing.brand
              ?.toLowerCase()
              .includes(
                normalizedSearch
              );

          const matchesType =
            selectedType ===
              'all' ||
            financing.type ===
              selectedType;

          const matchesBank =
            !selectedBank ||
            financing.bank ===
              selectedBank;

          const matchesBrand =
            !selectedBrand ||
            financing.brand ===
              selectedBrand;

          const matchesCuotas =
            !selectedCuotas ||
            financing.cuotas ===
              Number(
                selectedCuotas
              );

          return (
            matchesSearch &&
            matchesType &&
            matchesBank &&
            matchesBrand &&
            matchesCuotas
          );
        }
      );
    }, [
      search,
      selectedType,
      selectedBank,
      selectedBrand,
      selectedCuotas,
    ]);

  /* ========================= */
  /* PAGINACIÓN */
  /* ========================= */

  const pageCount = Math.ceil(
    filteredFinancings.length /
      ITEMS_PER_PAGE
  );

  const pagedFinancings =
    useMemo(() => {
      const start =
        (page - 1) *
        ITEMS_PER_PAGE;

      return filteredFinancings.slice(
        start,
        start +
          ITEMS_PER_PAGE
      );
    }, [
      filteredFinancings,
      page,
    ]);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    selectedType,
    selectedBank,
    selectedBrand,
    selectedCuotas,
  ]);

  useEffect(() => {
    if (
      pageCount > 0 &&
      page > pageCount
    ) {
      setPage(pageCount);
    }
  }, [
    page,
    pageCount,
  ]);

  /* ========================= */
  /* LIMPIAR */
  /* ========================= */

  const clearFilters = () => {
    setSearch('');
    setSelectedType('all');
    setSelectedBank('');
    setSelectedBrand('');
    setSelectedCuotas('');
    setPage(1);
  };

  const hasActiveFilters =
    search !== '' ||
    selectedType !== 'all' ||
    selectedBank !== '' ||
    selectedBrand !== '' ||
    selectedCuotas !== '';

  return (
    <main className="min-h-screen bg-[#071224]">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <section className="bg-[#071224] pb-12 pt-10 text-white">

        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">

          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7db4ff]">
            Financiación
          </span>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Elegí cómo financiar
            tu próximo vehículo
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-gray-300 md:text-lg">
            Conocé nuestras
            alternativas generales y
            beneficios exclusivos por
            marca.
          </p>

        </div>

      </section>

      {/* ========================= */}
      {/* TIPO FINANCIACIÓN */}
      {/* ========================= */}

      <section className="bg-[#071224] pb-8">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-4 md:grid-cols-3">

            {/* TODAS */}

            <button
              type="button"
              onClick={() =>
                setSelectedType(
                  'all'
                )
              }
              className={`
                flex
                items-center
                gap-4
                rounded-2xl
                border
                p-5
                text-left
                transition-all
                ${
                  selectedType ===
                  'all'
                    ? 'border-[#1f4e96] bg-[#1f4e96] text-white shadow-xl'
                    : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                }
              `}
            >

              <div
                className={`
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  ${
                    selectedType ===
                    'all'
                      ? 'bg-white/15'
                      : 'bg-[#1f4e96]'
                  }
                `}
              >
                <CreditCard
                  size={23}
                />
              </div>

              <div>
                <p className="font-bold">
                  Todas
                </p>

                <p className="mt-1 text-sm opacity-75">
                  Ver todas las
                  opciones
                </p>
              </div>

            </button>

            {/* GENERALES */}

            <button
              type="button"
              onClick={() => {
                setSelectedType(
                  'general'
                );

                setSelectedBrand('');
              }}
              className={`
                flex
                items-center
                gap-4
                rounded-2xl
                border
                p-5
                text-left
                transition-all
                ${
                  selectedType ===
                  'general'
                    ? 'border-[#1f4e96] bg-[#1f4e96] text-white shadow-xl'
                    : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                }
              `}
            >

              <div
                className={`
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  ${
                    selectedType ===
                    'general'
                      ? 'bg-white/15'
                      : 'bg-[#1f4e96]'
                  }
                `}
              >
                <Building2
                  size={23}
                />
              </div>

              <div>
                <p className="font-bold">
                  Generales
                </p>

                <p className="mt-1 text-sm opacity-75">
                  Opciones disponibles
                  para distintas unidades
                </p>
              </div>

            </button>

            {/* POR MARCA */}

            <button
              type="button"
              onClick={() =>
                setSelectedType(
                  'brand'
                )
              }
              className={`
                flex
                items-center
                gap-4
                rounded-2xl
                border
                p-5
                text-left
                transition-all
                ${
                  selectedType ===
                  'brand'
                    ? 'border-[#1f4e96] bg-[#1f4e96] text-white shadow-xl'
                    : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                }
              `}
            >

              <div
                className={`
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  ${
                    selectedType ===
                    'brand'
                      ? 'bg-white/15'
                      : 'bg-[#1f4e96]'
                  }
                `}
              >
                <CarFront
                  size={23}
                />
              </div>

              <div>
                <p className="font-bold">
                  Por marca
                </p>

                <p className="mt-1 text-sm opacity-75">
                  Beneficios exclusivos
                  según la marca
                </p>
              </div>

            </button>

          </div>

        </div>

      </section>

      {/* ========================= */}
      {/* FILTROS */}
      {/* ========================= */}

      <section className="bg-[#071224] pb-8">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="rounded-3xl bg-white p-5 shadow-xl md:p-6">

            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f4e96]/10 text-[#1f4e96]">

                  <SlidersHorizontal
                    size={20}
                  />

                </div>

                <div>

                  <h2 className="font-bold text-[#071224]">
                    Buscar financiación
                  </h2>

                  <p className="text-xs text-gray-500">
                    Filtrá las opciones
                    según lo que necesitás.
                  </p>

                </div>

              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-sm
                    font-semibold
                    text-gray-500
                    transition
                    hover:text-[#1f4e96]
                  "
                >
                  <X size={17} />
                  Limpiar filtros
                </button>
              )}

            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              {/* BUSCADOR */}

              <div className="relative sm:col-span-2 lg:col-span-1">

                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Buscar plan, banco o marca..."
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    pl-10
                    pr-4
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-[#1f4e96]
                    focus:bg-white
                    focus:ring-2
                    focus:ring-[#1f4e96]/10
                  "
                />

              </div>

              {/* BANCO */}

              <select
                value={selectedBank}
                onChange={(e) =>
                  setSelectedBank(
                    e.target.value
                  )
                }
                className={selectClass}
              >
                <option value="">
                  Todos los bancos
                </option>

                {banks.map((bank) => (
                  <option
                    key={bank}
                    value={bank}
                  >
                    {bank}
                  </option>
                ))}

              </select>

              {/* MARCA */}

              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(
                    e.target.value
                  );

                  if (
                    e.target.value
                  ) {
                    setSelectedType(
                      'brand'
                    );
                  }
                }}
                disabled={
                  selectedType ===
                  'general'
                }
                className={`${selectClass} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400`}
              >

                <option value="">
                  Todas las marcas
                </option>

                {brands.map(
                  (brand) => (
                    <option
                      key={brand}
                      value={brand}
                    >
                      {brand}
                    </option>
                  )
                )}

              </select>

              {/* CUOTAS */}

              <select
                value={
                  selectedCuotas
                }
                onChange={(e) =>
                  setSelectedCuotas(
                    e.target.value
                  )
                }
                className={selectClass}
              >

                <option value="">
                  Todas las cuotas
                </option>

                {cuotasOptions.map(
                  (cuotas) => (
                    <option
                      key={cuotas}
                      value={cuotas}
                    >
                      Hasta {cuotas}{' '}
                      cuotas
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

        </div>

      </section>

      {/* ========================= */}
      {/* RESULTADOS */}
      {/* ========================= */}

      <section className="bg-[#071224] pb-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-300">

                <span className="font-bold text-white">
                  {
                    filteredFinancings.length
                  }
                </span>{' '}

                {filteredFinancings.length ===
                1
                  ? 'opción encontrada'
                  : 'opciones encontradas'}

              </p>

            </div>

          </div>

          {pagedFinancings.length >
          0 ? (

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {pagedFinancings.map(
                (financing) => (

                  <article
                    key={
                      financing.id
                    }
                    className="
                      group
                      flex
                      h-full
                      flex-col
                      overflow-hidden
                      rounded-3xl
                      border
                      border-white/10
                      bg-white
                      shadow-lg
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-2xl
                    "
                  >

                    {/* CABECERA */}

                    <div className="relative border-b border-gray-100 bg-gray-50 px-6 py-6">

                      {/* TIPO */}

                      <div className="absolute right-4 top-4">

                        <span
                          className={`
                            rounded-full
                            px-3
                            py-1.5
                            text-xs
                            font-bold
                            ${
                              financing.type ===
                              'general'
                                ? 'bg-[#071224] text-white'
                                : 'bg-[#1f4e96] text-white'
                            }
                          `}
                        >
                          {financing.type ===
                          'general'
                            ? 'General'
                            : financing.brand}
                        </span>

                      </div>

                      {/* LOGO */}

                      <div className="relative h-16 w-40">

                        <Image
                          src={
                            financing.logo
                          }
                          alt={
                            financing.bank
                          }
                          fill
                          className="object-contain object-left"
                          sizes="160px"
                        />

                      </div>

                    </div>

                    {/* CONTENIDO */}

                    <div className="flex flex-1 flex-col p-6">

                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1f4e96]">
                        {
                          financing.bank
                        }
                      </p>

                      <h2 className="mt-2 text-xl font-bold text-[#071224]">
                        {
                          financing.name
                        }
                      </h2>

                      <p className="mt-3 min-h-[44px] text-sm leading-relaxed text-gray-500">
                        {
                          financing.beneficio
                        }
                      </p>

                      {/* DATOS */}

                      <div className="mt-6 grid grid-cols-3 gap-2">

                        <FinancingData
                          label="Cuotas"
                          value={`${financing.cuotas}`}
                        />

                        <FinancingData
                          label="Tasa"
                          value={
                            financing.tasa
                          }
                        />

                        <FinancingData
                          label="Anticipo"
                          value={
                            financing.anticipo
                          }
                        />

                      </div>

                      {/* BENEFICIO */}

                      <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#1f4e96]/5 px-4 py-3 text-sm font-semibold text-[#163b71]">

                        <BadgePercent
                          size={18}
                        />

                        Consultá condiciones
                        disponibles

                      </div>

                      {/* BOTÓN */}

                      <Link
                        href={
                          financing.url
                        }
                        className="
                          mt-6
                          flex
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          bg-[#071224]
                          px-5
                          py-3
                          text-sm
                          font-semibold
                          text-white
                          transition
                          group-hover:bg-[#1f4e96]
                        "
                      >
                        Consultar financiación

                        <ArrowRight
                          size={17}
                        />

                      </Link>

                    </div>

                  </article>

                )
              )}

            </div>

          ) : (

            /* SIN RESULTADOS */

            <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-xl">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1f4e96]/10 text-[#1f4e96]">

                <Search
                  size={25}
                />

              </div>

              <h3 className="mt-4 text-xl font-bold text-[#071224]">
                No encontramos opciones
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                Probá cambiando alguno
                de los filtros o
                limpiándolos para ver
                todas las alternativas.
              </p>

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="
                  mt-5
                  rounded-xl
                  bg-[#071224]
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#1f4e96]
                "
              >
                Limpiar filtros
              </button>

            </div>

          )}

          {/* ========================= */}
          {/* PAGINACIÓN */}
          {/* ========================= */}

          {pageCount > 1 && (

            <nav className="mt-12 flex items-center justify-center gap-2">

              <button
                type="button"
                disabled={
                  page === 1
                }
                onClick={() =>
                  setPage(
                    (
                      previous
                    ) =>
                      Math.max(
                        previous -
                          1,
                        1
                      )
                  )
                }
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-white
                  text-[#071224]
                  transition
                  hover:text-[#1f4e96]
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
              >
                <ChevronLeft
                  size={19}
                />
              </button>

              {Array.from(
                {
                  length:
                    pageCount,
                },
                (
                  _,
                  index
                ) =>
                  index + 1
              ).map(
                (
                  pageNumber
                ) => (

                  <button
                    key={
                      pageNumber
                    }
                    type="button"
                    onClick={() =>
                      setPage(
                        pageNumber
                      )
                    }
                    className={`
                      h-10
                      min-w-10
                      rounded-xl
                      px-3
                      text-sm
                      font-semibold
                      transition
                      ${
                        page ===
                        pageNumber
                          ? 'bg-[#1f4e96] text-white shadow-md'
                          : 'bg-white text-[#071224] hover:text-[#1f4e96]'
                      }
                    `}
                  >
                    {
                      pageNumber
                    }
                  </button>

                )
              )}

              <button
                type="button"
                disabled={
                  page ===
                  pageCount
                }
                onClick={() =>
                  setPage(
                    (
                      previous
                    ) =>
                      Math.min(
                        previous +
                          1,
                        pageCount
                      )
                  )
                }
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-white
                  text-[#071224]
                  transition
                  hover:text-[#1f4e96]
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
              >
                <ChevronRight
                  size={19}
                />
              </button>

            </nav>

          )}

        </div>

      </section>

    </main>
  );
}

/* ========================= */
/* DATOS CARD */
/* ========================= */

interface FinancingDataProps {
  label: string;
  value: string;
}

function FinancingData({
  label,
  value,
}: FinancingDataProps) {
  return (
    <div className="rounded-xl bg-[#f3f4f6] px-3 py-3 text-center">

      <p className="text-xs text-gray-400">
        {label}
      </p>

      <p className="mt-1 font-bold text-[#071224]">
        {value}
      </p>

    </div>
  );
}

/* ========================= */
/* SELECT STYLE */
/* ========================= */

const selectClass = `
  h-11
  w-full
  rounded-xl
  border
  border-gray-200
  bg-gray-50
  px-3
  text-sm
  text-gray-700
  outline-none
  transition
  focus:border-[#1f4e96]
  focus:bg-white
  focus:ring-2
  focus:ring-[#1f4e96]/10
`;