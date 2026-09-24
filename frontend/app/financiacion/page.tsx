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
  Landmark,
  WalletCards,
} from 'lucide-react';

import { fetchFinancings, Financing } from '../../lib/api';

/* =========================================
   TIPOS
========================================= */

type FinancingType =
  | 'all'
  | 'general'
  | 'brand';

/*
  8 opciones por página:
  desktop = 4 columnas x 2 filas
*/
const ITEMS_PER_PAGE = 8;

/* =========================================
   PAGE
========================================= */

export default function FinanciacionPage() {
  const [financings, setFinancings] = useState<Financing[]>([]);
  const [loadingFinancings, setLoadingFinancings] = useState(true);
  const [financingsError, setFinancingsError] = useState('');

  useEffect(() => {
    fetchFinancings()
      .then((res) => setFinancings(res.data))
      .catch((err) => setFinancingsError(err.message || 'No pudimos cargar las financiaciones.'))
      .finally(() => setLoadingFinancings(false));
  }, []);

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

  /* =========================================
     OPCIONES DISPONIBLES
  ========================================= */

  const banks = useMemo(() => {
    return Array.from(
      new Set(
        financings.map(
          (financing) => financing.bank,
        ),
      ),
    ).sort();
  }, [financings]);

  const brands = useMemo(() => {
    return Array.from(
      new Set(
        financings
          .map(
            (financing) =>
              financing.brand,
          )
          .filter(
            (
              brand,
            ): brand is string =>
              Boolean(brand),
          ),
      ),
    ).sort();
  }, [financings]);

  const cuotasOptions = useMemo(() => {
    return Array.from(
      new Set(
        financings.map(
          (financing) =>
            financing.cuotas,
        ),
      ),
    ).sort((a, b) => a - b);
  }, [financings]);

  /* =========================================
     FILTRADO
  ========================================= */

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
                normalizedSearch,
              ) ||
            financing.bank
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            financing.brand
              ?.toLowerCase()
              .includes(
                normalizedSearch,
              );

          const matchesType =
            selectedType === 'all' ||
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
                selectedCuotas,
              );

          return (
            matchesSearch &&
            matchesType &&
            matchesBank &&
            matchesBrand &&
            matchesCuotas
          );
        },
      );
    }, [
      financings,
      search,
      selectedType,
      selectedBank,
      selectedBrand,
      selectedCuotas,
    ]);

  /* =========================================
     PAGINACIÓN
  ========================================= */

  const pageCount = Math.max(
    Math.ceil(
      filteredFinancings.length /
        ITEMS_PER_PAGE,
    ),
    1,
  );

  const pagedFinancings =
    useMemo(() => {
      const start =
        (page - 1) *
        ITEMS_PER_PAGE;

      return filteredFinancings.slice(
        start,
        start +
          ITEMS_PER_PAGE,
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
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [
    page,
    pageCount,
  ]);

  /* =========================================
     LIMPIAR
  ========================================= */

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

  /* =========================================
     CAMBIAR TIPO
  ========================================= */

  const handleTypeChange = (
    type: FinancingType,
  ) => {
    setSelectedType(type);

    if (type === 'general') {
      setSelectedBrand('');
    }
  };

  /* =========================================
     CAMBIO PÁGINA
  ========================================= */

  const changePage = (
    pageNumber: number,
  ) => {
    if (
      pageNumber < 1 ||
      pageNumber > pageCount
    ) {
      return;
    }

    setPage(pageNumber);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <main className="min-h-screen bg-[#071224] text-white">

      {/* =====================================
          HERO
      ===================================== */}

      <section className="relative overflow-hidden border-b border-white/10">

        {/* iluminación fondo */}
        <div className="pointer-events-none absolute -right-40 -top-48 h-[480px] w-[480px] rounded-full bg-[#1f4e96]/20 blur-[130px]" />

        <div className="pointer-events-none absolute -left-40 top-20 h-[350px] w-[350px] rounded-full bg-[#163b71]/15 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-9 pt-28 sm:px-6 lg:px-8">

          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
            Financiación
          </span>

          <div className="mt-3 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div>
              <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Encontrá la financiación que mejor se adapte a vos
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Compará alternativas,
                bancos y beneficios para
                elegir la mejor opción para
                tu próximo vehículo.
              </p>
            </div>

            <Link
              href="/contacto"
              className="
                flex
                h-11
                w-fit
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-[#1f4e96]
                px-5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#295eaa]
              "
            >
              Quiero asesoramiento

              <ArrowRight size={16} />
            </Link>

          </div>

        </div>
      </section>

      {/* =====================================
          CONTENIDO
      ===================================== */}

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">

        {/* =================================
            TIPO FINANCIACIÓN
        ================================= */}

        <div className="mb-5">

          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-slate-500">
            Tipo de financiación
          </p>

          <div className="flex flex-wrap gap-2">

            <TypeButton
              active={
                selectedType === 'all'
              }
              icon={
                <CreditCard size={16} />
              }
              label="Todas"
              onClick={() =>
                handleTypeChange('all')
              }
            />

            <TypeButton
              active={
                selectedType ===
                'general'
              }
              icon={
                <Building2 size={16} />
              }
              label="Generales"
              onClick={() =>
                handleTypeChange(
                  'general',
                )
              }
            />

            <TypeButton
              active={
                selectedType === 'brand'
              }
              icon={
                <CarFront size={16} />
              }
              label="Por marca"
              onClick={() =>
                handleTypeChange(
                  'brand',
                )
              }
            />

          </div>
        </div>

        {/* =================================
            FILTROS
        ================================= */}

        <div className="mb-8 rounded-2xl border border-white/10 bg-[#0c192d] p-4 md:p-5">

          <div className="mb-4 flex items-center justify-between gap-4">

            <div className="flex items-center gap-2.5">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1f4e96]/15 text-blue-300">
                <SlidersHorizontal
                  size={16}
                />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Buscar financiación
                </h2>

                <p className="hidden text-[11px] text-slate-500 sm:block">
                  Filtrá las opciones disponibles
                </p>
              </div>

            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="
                  flex
                  items-center
                  gap-1
                  rounded-lg
                  px-2.5
                  py-1.5
                  text-xs
                  font-medium
                  text-slate-400
                  transition
                  hover:bg-white/5
                  hover:text-white
                "
              >
                <X size={14} />
                Limpiar
              </button>
            )}

          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">

            {/* BUSCADOR */}
            <div className="relative sm:col-span-2 lg:col-span-2">

              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value,
                  )
                }
                placeholder="Buscar plan, banco o marca..."
                className={inputClass}
              />

            </div>

            {/* BANCO */}
            <select
              value={selectedBank}
              onChange={(e) =>
                setSelectedBank(
                  e.target.value,
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
                  e.target.value,
                );

                if (e.target.value) {
                  setSelectedType(
                    'brand',
                  );
                }
              }}
              disabled={
                selectedType ===
                'general'
              }
              className={`${selectClass} disabled:cursor-not-allowed disabled:opacity-40`}
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
                ),
              )}
            </select>

            {/* CUOTAS */}
            <select
              value={selectedCuotas}
              onChange={(e) =>
                setSelectedCuotas(
                  e.target.value,
                )
              }
              className={selectClass}
            >
              <option value="">
                Cantidad de cuotas
              </option>

              {cuotasOptions.map(
                (cuotas) => (
                  <option
                    key={cuotas}
                    value={cuotas}
                  >
                    Hasta {cuotas} cuotas
                  </option>
                ),
              )}
            </select>

          </div>

        </div>

        {/* =================================
            CABECERA RESULTADOS
        ================================= */}

        <div className="mb-5 flex items-center justify-between">

          <p className="text-sm text-slate-400">
            <span className="font-semibold text-white">
              {filteredFinancings.length}
            </span>{' '}
            {filteredFinancings.length === 1
              ? 'opción disponible'
              : 'opciones disponibles'}
          </p>

        </div>

        {/* =================================
            RESULTADOS
        ================================= */}

        {loadingFinancings ? (

          <div className="rounded-2xl border border-white/10 bg-[#0c192d] px-6 py-16 text-center text-sm text-slate-400">
            Cargando financiaciones...
          </div>

        ) : financingsError ? (

          <div className="rounded-2xl border border-white/10 bg-[#0c192d] px-6 py-16 text-center text-sm text-red-400">
            {financingsError}
          </div>

        ) : pagedFinancings.length > 0 ? (

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {pagedFinancings.map(
              (financing) => (

                <article
                  key={financing.id}
                  className="
                    group
                    flex
                    h-full
                    flex-col
                    overflow-hidden
                    rounded-xl
                    border
                    border-white/10
                    bg-[#0c192d]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#3169b7]/70
                    hover:shadow-[0_18px_45px_-20px_rgba(0,0,0,0.8)]
                  "
                >

                  {/* CABECERA */}
                  <div className="relative flex h-[82px] items-center border-b border-white/10 bg-white px-4">

                    <div className="relative h-9 w-24">
                      {financing.logo ? (
                        <Image
                          src={financing.logo}
                          alt={financing.bank}
                          fill
                          className="object-contain object-left"
                          sizes="96px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#071224]">
                          <Building2 size={22} />
                        </div>
                      )}
                    </div>

                    {/* ETIQUETA */}
                    <span
                      className={`
                        absolute
                        right-3
                        top-3
                        rounded-md
                        px-2
                        py-1
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-wide
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

                  {/* CONTENIDO */}
                  <div className="flex flex-1 flex-col p-4">

                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-blue-300">
                      {financing.bank}
                    </p>

                    <h2 className="mt-1.5 text-base font-semibold leading-snug text-white">
                      {financing.name}
                    </h2>

                    <p className="mt-2 min-h-[40px] text-xs leading-5 text-slate-400">
                      {
                        financing.beneficio
                      }
                    </p>

                    {/* DATOS */}
                    <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-lg border border-white/10">

                      <FinancingData
                        label="Cuotas"
                        value={`${financing.cuotas}`}
                      />

                      <FinancingData
                        label="Tasa"
                        value={financing.tasa || '-'}
                      />

                      <FinancingData
                        label="Anticipo"
                        value={financing.anticipo || '-'}
                      />

                    </div>

                    {/* CONSULTA */}
                    <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-blue-300">

                      <BadgePercent
                        size={14}
                      />

                      Condiciones sujetas a aprobación

                    </div>

                    {/* BOTÓN */}
                    <Link
                      href={
                        financing.url
                      }
                      className="
                        mt-4
                        flex
                        h-9
                        w-full
                        items-center
                        justify-center
                        gap-1.5
                        rounded-lg
                        border
                        border-[#3169b7]
                        bg-transparent
                        px-4
                        text-xs
                        font-semibold
                        text-white
                        transition
                        hover:bg-[#1f4e96]
                      "
                    >
                      Consultar opción

                      <ArrowRight
                        size={13}
                      />
                    </Link>

                  </div>

                </article>

              ),
            )}

          </div>

        ) : (

          /* =================================
             SIN RESULTADOS
          ================================= */

          <div className="rounded-2xl border border-white/10 bg-[#0c192d] px-6 py-16 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1f4e96]/15 text-blue-300">
              <Search size={21} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-white">
              No encontramos opciones
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Probá modificando alguno de los filtros para ver otras alternativas disponibles.
            </p>

            <button
              type="button"
              onClick={
                clearFilters
              }
              className="
                mt-5
                rounded-lg
                bg-[#1f4e96]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#295eaa]
              "
            >
              Limpiar filtros
            </button>

          </div>

        )}

        {/* =================================
            PAGINACIÓN
        ================================= */}

        {filteredFinancings.length >
          ITEMS_PER_PAGE && (
          <nav
            className="mt-10 flex items-center justify-center gap-2"
            aria-label="Paginación de financiaciones"
          >

            <button
              type="button"
              aria-label="Página anterior"
              disabled={
                page === 1
              }
              onClick={() =>
                changePage(
                  page - 1,
                )
              }
              className={paginationButtonClass}
            >
              <ChevronLeft size={17} />
            </button>

            {Array.from(
              {
                length:
                  pageCount,
              },
              (_, index) =>
                index + 1,
            ).map(
              (pageNumber) => (

                <button
                  key={pageNumber}
                  type="button"
                  onClick={() =>
                    changePage(
                      pageNumber,
                    )
                  }
                  className={`
                    h-9
                    min-w-9
                    rounded-lg
                    px-2.5
                    text-xs
                    font-semibold
                    transition
                    ${
                      page ===
                      pageNumber
                        ? 'bg-[#1f4e96] text-white'
                        : 'border border-white/10 bg-[#0c192d] text-slate-400 hover:border-[#3169b7] hover:text-white'
                    }
                  `}
                >
                  {pageNumber}
                </button>

              ),
            )}

            <button
              type="button"
              aria-label="Página siguiente"
              disabled={
                page ===
                pageCount
              }
              onClick={() =>
                changePage(
                  page + 1,
                )
              }
              className={paginationButtonClass}
            >
              <ChevronRight size={17} />
            </button>

          </nav>
        )}

        {/* =================================
            BLOQUE FINAL
        ================================= */}

        <div className="mt-14 overflow-hidden rounded-2xl border border-white/10 bg-[#0c192d]">

          <div className="grid lg:grid-cols-[1.3fr_0.7fr]">

            <div className="p-6 sm:p-8">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1f4e96]/15 text-blue-300">
                <Landmark size={19} />
              </div>

              <h2 className="mt-4 text-xl font-semibold text-white sm:text-2xl">
                ¿No sabés qué financiación elegir?
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Nuestro equipo puede ayudarte a comparar alternativas según el vehículo que estés buscando y tus necesidades.
              </p>

              <Link
                href="/contacto"
                className="
                  mt-5
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-[#1f4e96]
                  px-5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#295eaa]
                "
              >
                Hablar con un asesor

                <ArrowRight size={15} />
              </Link>

            </div>

            <div className="hidden items-center justify-center border-l border-white/10 bg-white/[0.02] lg:flex">

              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-blue-300">
                <WalletCards size={40} />
              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

/* =========================================
   BOTÓN TIPO
========================================= */

interface TypeButtonProps {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function TypeButton({
  active,
  label,
  icon,
  onClick,
}: TypeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        h-9
        items-center
        gap-2
        rounded-lg
        border
        px-3.5
        text-xs
        font-semibold
        transition
        ${
          active
            ? 'border-[#1f4e96] bg-[#1f4e96] text-white'
            : 'border-white/10 bg-[#0c192d] text-slate-400 hover:border-white/20 hover:text-white'
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

/* =========================================
   DATOS CARD
========================================= */

interface FinancingDataProps {
  label: string;
  value: string;
}

function FinancingData({
  label,
  value,
}: FinancingDataProps) {
  return (
    <div className="border-r border-white/10 px-2 py-2.5 text-center last:border-r-0">

      <p className="text-[9px] uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-0.5 text-sm font-semibold text-white">
        {value}
      </p>

    </div>
  );
}

/* =========================================
   ESTILOS
========================================= */

const inputClass = `
  h-10
  w-full
  rounded-lg
  border
  border-white/10
  bg-[#071224]
  pl-9
  pr-3
  text-xs
  text-white
  outline-none
  transition
  placeholder:text-slate-600
  hover:border-white/20
  focus:border-[#3169b7]
  focus:ring-2
  focus:ring-[#3169b7]/15
`;

const selectClass = `
  h-10
  w-full
  rounded-lg
  border
  border-white/10
  bg-[#071224]
  px-3
  text-xs
  text-slate-300
  outline-none
  transition
  hover:border-white/20
  focus:border-[#3169b7]
  focus:ring-2
  focus:ring-[#3169b7]/15
`;

const paginationButtonClass = `
  flex
  h-9
  w-9
  items-center
  justify-center
  rounded-lg
  border
  border-white/10
  bg-[#0c192d]
  text-slate-400
  transition
  hover:border-[#3169b7]
  hover:text-white
  disabled:cursor-not-allowed
  disabled:opacity-30
`;