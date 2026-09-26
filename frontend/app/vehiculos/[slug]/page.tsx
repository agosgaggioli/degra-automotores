'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import Image from 'next/image';

import {
  Gauge,
  Fuel,
  Settings2,
  Palette,
  CalendarDays,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

import {
  fetchVehicleBySlug,
  submitContact,
  Vehicle,
} from '../../../lib/api';

const FALLBACK_IMG =
  '/images/vehicles/onix.jpeg';

export default function VehicleDetailPage() {
  const params =
    useParams<{ slug: string }>();

  const router = useRouter();

  const slug =
    params?.slug as string;

  const [vehicle, setVehicle] =
    useState<Vehicle | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [
    activeImage,
    setActiveImage,
  ] = useState(0);

  const [formData, setFormData] =
    useState({
      name: '',
      phone: '',
      email: '',
      message: '',
    });

  const [sending, setSending] =
    useState(false);

  const [sent, setSent] =
    useState(false);

  const [
    formError,
    setFormError,
  ] = useState('');

  /* =========================================
     CARGAR VEHÍCULO
  ========================================= */

  useEffect(() => {
    if (!slug) return;

    setLoading(true);

    fetchVehicleBySlug(slug)
      .then((res) =>
        setVehicle(res.data),
      )
      .catch((err) =>
        setError(
          err.message ||
            'No pudimos cargar este vehículo.',
        ),
      )
      .finally(() =>
        setLoading(false),
      );
  }, [slug]);

  /* =========================================
     MENSAJE PREDETERMINADO
  ========================================= */

  useEffect(() => {
    if (vehicle) {
      setFormData((prev) => ({
        ...prev,
        message: `Hola, me interesa el ${vehicle.brand} ${vehicle.model} ${
          vehicle.version || ''
        } ${vehicle.year}. ¿Sigue disponible?`,
      }));
    }
  }, [vehicle]);

  /* =========================================
     PRECIO
  ========================================= */

  const formatPrice = (
    price: number,
    currency: string,
  ) =>
    new Intl.NumberFormat(
      'es-AR',
      {
        style: 'currency',
        currency:
          currency || 'ARS',
        maximumFractionDigits: 0,
      },
    ).format(price);

  /* =========================================
     CONSULTA
  ========================================= */

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    setFormError('');

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim()
    ) {
      setFormError(
        'Completá nombre, teléfono y email para poder contactarte.',
      );

      return;
    }

    setSending(true);

    try {
      await submitContact({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        subject: 'vehiculo',
        message:
          formData.message,
      });

      setSent(true);
    } catch (err: any) {
      setFormError(
        err.message ||
          'No pudimos enviar tu consulta. Probá de nuevo.',
      );
    } finally {
      setSending(false);
    }
  }

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#071224] text-white">

        <div className="text-center">

          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-blue-400" />

          <p className="mt-3 text-xs text-slate-400">
            Cargando vehículo...
          </p>

        </div>

      </main>
    );
  }

  /* =========================================
     ERROR
  ========================================= */

  if (error || !vehicle) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#071224] px-4 text-center text-white">

        <p className="text-base font-semibold">
          {error ||
            'Vehículo no encontrado.'}
        </p>

        <button
          type="button"
          onClick={() =>
            router.push(
              '/vehiculos',
            )
          }
          className="h-9 rounded-lg bg-[#1f4e96] px-4 text-xs font-semibold text-white transition hover:bg-[#295eaa]"
        >
          Volver al catálogo
        </button>

      </main>
    );
  }

  const images =
    vehicle.images?.length
      ? vehicle.images
      : [FALLBACK_IMG];

  return (
    <main className="min-h-screen bg-[#071224] text-white">

      {/* =====================================
          CABECERA
      ===================================== */}

      <section className="relative overflow-hidden pt-24">

        <div className="pointer-events-none absolute -right-52 -top-52 h-[500px] w-[500px] rounded-full bg-[#1f4e96]/15 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">

          <button
            type="button"
            onClick={() =>
              router.push(
                '/vehiculos',
              )
            }
            className="
              inline-flex
              h-8
              items-center
              gap-1.5
              rounded-lg
              border
              border-white/10
              bg-white/[0.03]
              px-3
              text-[11px]
              font-semibold
              text-slate-400
              transition
              hover:border-[#3169b7]/60
              hover:text-white
            "
          >
            <ArrowLeft
              size={13}
            />

            Volver al catálogo
          </button>

        </div>

      </section>

      {/* =====================================
          CONTENIDO
      ===================================== */}

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-5 sm:px-6 lg:px-8">

        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,0.95fr)_minmax(340px,0.7fr)]">

          {/* =================================
              COLUMNA IZQUIERDA
          ================================= */}

          <div className="min-w-0">

            {/* ===============================
                GALERÍA PRINCIPAL 4:5
            =============================== */}

            <div className="mx-auto w-full max-w-[540px] lg:mx-0">

              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/10 bg-[#0c192d]">

                <Image
                  src={
                    images[
                      activeImage
                    ]
                  }
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="
                    (max-width: 640px) 100vw,
                    (max-width: 1024px) 70vw,
                    540px
                  "
                />

                {/* DEGRADADO */}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

                {/* FLECHA IZQUIERDA */}

                {images.length >
                  1 && (

                  <button
                    type="button"
                    aria-label="Imagen anterior"
                    onClick={() =>
                      setActiveImage(
                        (i) =>
                          (i -
                            1 +
                            images.length) %
                          images.length,
                      )
                    }
                    className="
                      absolute
                      left-3
                      top-1/2
                      flex
                      h-8
                      w-8
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/15
                      bg-[#071224]/80
                      text-white
                      backdrop-blur
                      transition
                      hover:bg-[#071224]
                    "
                  >
                    <ChevronLeft
                      size={16}
                    />
                  </button>

                )}

                {/* FLECHA DERECHA */}

                {images.length >
                  1 && (

                  <button
                    type="button"
                    aria-label="Imagen siguiente"
                    onClick={() =>
                      setActiveImage(
                        (i) =>
                          (i + 1) %
                          images.length,
                      )
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      flex
                      h-8
                      w-8
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/15
                      bg-[#071224]/80
                      text-white
                      backdrop-blur
                      transition
                      hover:bg-[#071224]
                    "
                  >
                    <ChevronRight
                      size={16}
                    />
                  </button>

                )}

                {/* AÑO */}

                <span className="absolute bottom-3 right-3 rounded-md border border-white/15 bg-[#071224]/85 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
                  {vehicle.year}
                </span>

                {/* CONTADOR */}

                {images.length >
                  1 && (

                  <span className="absolute bottom-3 left-3 rounded-md border border-white/15 bg-[#071224]/85 px-2 py-1 text-[9px] font-medium text-slate-300 backdrop-blur">
                    {activeImage +
                      1}{' '}
                    /{' '}
                    {
                      images.length
                    }
                  </span>

                )}

              </div>

              {/* ===============================
                  MINIATURAS 4:5
              =============================== */}

              {images.length >
                1 && (

                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">

                  {images.map(
                    (
                      img,
                      idx,
                    ) => (

                      <button
                        key={
                          img +
                          idx
                        }
                        type="button"
                        onClick={() =>
                          setActiveImage(
                            idx,
                          )
                        }
                        aria-label={`Ver imagen ${
                          idx +
                          1
                        }`}
                        className={`
                          relative
                          aspect-[4/5]
                          w-[62px]
                          shrink-0
                          overflow-hidden
                          rounded-lg
                          border
                          transition
                          ${
                            activeImage ===
                            idx
                              ? 'border-[#3169b7] ring-1 ring-[#3169b7]/40'
                              : 'border-white/10 opacity-60 hover:border-white/30 hover:opacity-100'
                          }
                        `}
                      >

                        <Image
                          src={
                            img
                          }
                          alt=""
                          fill
                          className="object-cover object-center"
                          sizes="62px"
                        />

                      </button>

                    ),
                  )}

                </div>

              )}

            </div>

            {/* =================================
                CARACTERÍSTICAS
            ================================= */}

            <div className="mt-5 rounded-xl border border-white/10 bg-[#0c192d] p-4">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-blue-300">
                    Ficha técnica
                  </p>

                  <h2 className="mt-1 text-base font-semibold text-white">
                    Características
                  </h2>

                </div>

              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">

                <Feature
                  icon={
                    <CalendarDays
                      size={15}
                    />
                  }
                  label="Año"
                  value={String(
                    vehicle.year,
                  )}
                />

                <Feature
                  icon={
                    <Gauge
                      size={15}
                    />
                  }
                  label="Kilometraje"
                  value={`${vehicle.mileage?.toLocaleString(
                    'es-AR',
                  )} km`}
                />

                <Feature
                  icon={
                    <Settings2
                      size={15}
                    />
                  }
                  label="Transmisión"
                  value={
                    vehicle.transmission ||
                    '-'
                  }
                />

                <Feature
                  icon={
                    <Fuel
                      size={15}
                    />
                  }
                  label="Combustible"
                  value={
                    vehicle.fuel ||
                    '-'
                  }
                />

                <Feature
                  icon={
                    <Palette
                      size={15}
                    />
                  }
                  label="Color"
                  value={
                    vehicle.color ||
                    '-'
                  }
                />

              </div>

              {/* DESCRIPCIÓN */}

              {vehicle.description && (

                <div className="mt-4 border-t border-white/10 pt-4">

                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Descripción
                  </p>

                  <p className="mt-2 whitespace-pre-line text-xs leading-5 text-slate-300">
                    {
                      vehicle.description
                    }
                  </p>

                </div>

              )}

            </div>

          </div>

          {/* =================================
              COLUMNA DERECHA
          ================================= */}

          <div className="space-y-4 lg:sticky lg:top-24">

            {/* =================================
                DATOS VEHÍCULO
            ================================= */}

            <div className="rounded-xl border border-white/10 bg-[#0c192d] p-5">

              {/* MARCA */}

              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300">
                {vehicle.brand}
              </p>

              {/* MODELO */}

              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                {vehicle.model}
              </h1>

              {/* VERSIÓN */}

              {vehicle.version && (

                <p className="mt-1 text-xs text-slate-400">
                  {
                    vehicle.version
                  }
                </p>

              )}

              {/* DIVISOR */}

              <div className="my-4 h-px bg-white/10" />

              {/* PRECIO */}

              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Precio
              </p>

              <p className="mt-1 text-2xl font-bold tracking-tight text-white">
                {formatPrice(
                  vehicle.price,
                  vehicle.currency,
                )}
              </p>

              {/* WHATSAPP */}

              <a
                href={`https://wa.me/3463406181?text=${encodeURIComponent(
                  `Hola! Me interesa el ${vehicle.brand} ${vehicle.model} ${
                    vehicle.version ||
                    ''
                  } ${vehicle.year}.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-5
                  flex
                  h-10
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-green-600
                  text-xs
                  font-semibold
                  text-white
                  transition
                  hover:bg-green-700
                "
              >
                <MessageCircle
                  size={15}
                />

                Consultar por WhatsApp
              </a>

            </div>

            {/* =================================
                FORMULARIO
            ================================= */}

            <div className="rounded-xl border border-white/10 bg-[#0c192d] p-5">

              {sent ? (

                <div className="py-5 text-center">

                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-blue-400/10 text-blue-300">

                    <MessageCircle
                      size={16}
                    />

                  </div>

                  <p className="mt-3 text-sm font-semibold text-white">
                    ¡Consulta enviada!
                  </p>

                  <p className="mx-auto mt-1.5 max-w-xs text-[11px] leading-5 text-slate-400">
                    Nuestro equipo se va a comunicar con vos a la brevedad.
                  </p>

                </div>

              ) : (

                <>

                  <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-blue-300">
                    Contacto
                  </p>

                  <h2 className="mt-1 text-base font-semibold text-white">
                    Consultar por este vehículo
                  </h2>

                  <p className="mt-1 text-[11px] leading-4 text-slate-500">
                    Dejanos tus datos y nos comunicamos con vos.
                  </p>

                  <form
                    onSubmit={
                      handleSubmit
                    }
                    className="mt-4 space-y-2.5"
                  >

                    {/* NOMBRE */}

                    <input
                      type="text"
                      placeholder="Nombre y apellido"
                      value={
                        formData.name
                      }
                      onChange={(
                        e,
                      ) =>
                        setFormData(
                          (p) => ({
                            ...p,
                            name: e
                              .target
                              .value,
                          }),
                        )
                      }
                      className="
                        h-9
                        w-full
                        rounded-lg
                        border
                        border-white/10
                        bg-[#071224]
                        px-3
                        text-xs
                        text-white
                        outline-none
                        transition
                        placeholder:text-slate-600
                        hover:border-white/20
                        focus:border-[#3169b7]
                        focus:ring-2
                        focus:ring-[#3169b7]/20
                      "
                    />

                    {/* TELÉFONO + EMAIL */}

                    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">

                      <input
                        type="tel"
                        placeholder="Teléfono"
                        value={
                          formData.phone
                        }
                        onChange={(
                          e,
                        ) =>
                          setFormData(
                            (p) => ({
                              ...p,
                              phone:
                                e
                                  .target
                                  .value,
                            }),
                          )
                        }
                        className="
                          h-9
                          w-full
                          rounded-lg
                          border
                          border-white/10
                          bg-[#071224]
                          px-3
                          text-xs
                          text-white
                          outline-none
                          transition
                          placeholder:text-slate-600
                          hover:border-white/20
                          focus:border-[#3169b7]
                          focus:ring-2
                          focus:ring-[#3169b7]/20
                        "
                      />

                      <input
                        type="email"
                        placeholder="Email"
                        value={
                          formData.email
                        }
                        onChange={(
                          e,
                        ) =>
                          setFormData(
                            (p) => ({
                              ...p,
                              email:
                                e
                                  .target
                                  .value,
                            }),
                          )
                        }
                        className="
                          h-9
                          w-full
                          rounded-lg
                          border
                          border-white/10
                          bg-[#071224]
                          px-3
                          text-xs
                          text-white
                          outline-none
                          transition
                          placeholder:text-slate-600
                          hover:border-white/20
                          focus:border-[#3169b7]
                          focus:ring-2
                          focus:ring-[#3169b7]/20
                        "
                      />

                    </div>

                    {/* MENSAJE */}

                    <textarea
                      rows={3}
                      value={
                        formData.message
                      }
                      onChange={(
                        e,
                      ) =>
                        setFormData(
                          (p) => ({
                            ...p,
                            message:
                              e.target
                                .value,
                          }),
                        )
                      }
                      className="
                        w-full
                        resize-none
                        rounded-lg
                        border
                        border-white/10
                        bg-[#071224]
                        px-3
                        py-2.5
                        text-xs
                        leading-5
                        text-white
                        outline-none
                        transition
                        placeholder:text-slate-600
                        hover:border-white/20
                        focus:border-[#3169b7]
                        focus:ring-2
                        focus:ring-[#3169b7]/20
                      "
                    />

                    {/* ERROR */}

                    {formError && (

                      <p className="text-[11px] font-medium text-red-400">
                        {formError}
                      </p>

                    )}

                    {/* ENVIAR */}

                    <button
                      type="submit"
                      disabled={
                        sending
                      }
                      className="
                        flex
                        h-9
                        w-full
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#1f4e96]
                        text-xs
                        font-semibold
                        text-white
                        transition
                        hover:bg-[#295eaa]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {sending
                        ? 'Enviando...'
                        : 'Enviar consulta'}
                    </button>

                  </form>

                </>

              )}

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

/* =========================================
   FEATURE
========================================= */

function Feature({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-white/10 bg-[#071224] px-3 py-3">

      <div className="flex items-center gap-2">

        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-400/10 text-blue-300">
          {icon}
        </div>

        <div className="min-w-0">

          <p className="text-[9px] text-slate-500">
            {label}
          </p>

          <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-200">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}