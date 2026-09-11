'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

import { fetchVehicleBySlug, submitContact, Vehicle } from '../../../lib/api';

const FALLBACK_IMG = '/images/vehicles/onix.jpeg';

export default function VehicleDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchVehicleBySlug(slug)
      .then((res) => setVehicle(res.data))
      .catch((err) => setError(err.message || 'No pudimos cargar este vehículo.'))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (vehicle) {
      setFormData((prev) => ({
        ...prev,
        message: `Hola, me interesa el ${vehicle.brand} ${vehicle.model} ${vehicle.version || ''} ${vehicle.year}. ¿Sigue disponible?`,
      }));
    }
  }, [vehicle]);

  const formatPrice = (price: number, currency: string) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: currency || 'ARS', maximumFractionDigits: 0 }).format(
      price
    );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setFormError('Completá nombre, teléfono y email para poder contactarte.');
      return;
    }

    setSending(true);
    try {
      await submitContact({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        subject: 'vehiculo',
        message: formData.message,
      });
      setSent(true);
    } catch (err: any) {
      setFormError(err.message || 'No pudimos enviar tu consulta. Probá de nuevo.');
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#071224] text-white">
        Cargando vehículo...
      </main>
    );
  }

  if (error || !vehicle) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#071224] px-4 text-center text-white">
        <p className="text-lg font-semibold">{error || 'Vehículo no encontrado.'}</p>
        <button
          type="button"
          onClick={() => router.push('/vehiculos')}
          className="rounded-xl bg-[#1f4e96] px-6 py-3 font-semibold text-white transition hover:bg-[#163b71]"
        >
          Volver al catálogo
        </button>
      </main>
    );
  }

  const images = vehicle.images?.length ? vehicle.images : [FALLBACK_IMG];

  return (
    <main className="min-h-screen bg-[#f3f4f6]">
      <section className="bg-[#071224] pb-8 pt-8 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => router.push('/vehiculos')}
            className="flex items-center gap-2 text-sm font-semibold text-blue-300 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Volver al catálogo
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          {/* GALERÍA */}
          <div>
            <div className="relative h-[360px] w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm md:h-[460px]">
              <Image
                src={images[activeImage]}
                alt={`${vehicle.brand} ${vehicle.model}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveImage((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#071224] shadow transition hover:bg-white"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#071224] shadow transition hover:bg-white"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              <span className="absolute bottom-4 right-4 rounded-lg bg-black/60 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur">
                {vehicle.year}
              </span>
            </div>

            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={img + idx}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={`relative h-16 overflow-hidden rounded-xl border-2 transition ${
                      activeImage === idx ? 'border-[#1f4e96]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="100px" />
                  </button>
                ))}
              </div>
            )}

            {/* CARACTERÍSTICAS */}
            <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-bold text-[#071224]">Características</h2>
              <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
                <Feature icon={<CalendarDays size={20} />} label="Año" value={String(vehicle.year)} />
                <Feature icon={<Gauge size={20} />} label="Kilometraje" value={`${vehicle.mileage?.toLocaleString('es-AR')} km`} />
                <Feature icon={<Settings2 size={20} />} label="Transmisión" value={vehicle.transmission || '-'} />
                <Feature icon={<Fuel size={20} />} label="Combustible" value={vehicle.fuel || '-'} />
                <Feature icon={<Palette size={20} />} label="Color" value={vehicle.color || '-'} />
              </div>

              {vehicle.description && (
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-gray-400">Descripción</h3>
                  <p className="mt-2 whitespace-pre-line text-gray-700">{vehicle.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* FICHA + CONTACTO */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1f4e96]">{vehicle.brand}</p>
              <h1 className="mt-1 text-3xl font-bold text-[#071224]">{vehicle.model}</h1>
              <p className="mt-1 text-gray-500">{vehicle.version}</p>

              <p className="mt-6 text-xs uppercase tracking-wide text-gray-400">Precio</p>
              <p className="mt-1 text-3xl font-extrabold text-[#071224]">{formatPrice(vehicle.price, vehicle.currency)}</p>

              <a
                href={`https://wa.me/5493512345678?text=${encodeURIComponent(
                  `Hola! Me interesa el ${vehicle.brand} ${vehicle.model} ${vehicle.version || ''} ${vehicle.year}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3.5 font-semibold text-white transition hover:bg-green-700"
              >
                <MessageCircle size={19} />
                Consultar por WhatsApp
              </a>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
              {sent ? (
                <div className="py-6 text-center">
                  <p className="text-lg font-bold text-[#071224]">¡Consulta enviada!</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Nuestro equipo se va a comunicar con vos a la brevedad.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-[#071224]">Consultar por este vehículo</h2>
                  <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                    <input
                      type="text"
                      placeholder="Nombre y apellido"
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#1f4e96] focus:bg-white"
                    />
                    <input
                      type="tel"
                      placeholder="Teléfono"
                      value={formData.phone}
                      onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#1f4e96] focus:bg-white"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#1f4e96] focus:bg-white"
                    />
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                      className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#1f4e96] focus:bg-white"
                    />

                    {formError && <p className="text-sm font-medium text-red-600">{formError}</p>}

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full rounded-xl bg-[#071224] px-4 py-3 font-semibold text-white transition hover:bg-[#1f4e96] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {sending ? 'Enviando...' : 'Enviar consulta'}
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

function Feature({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-gray-50 py-4 text-center">
      <div className="text-[#1f4e96]">{icon}</div>
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-gray-800">{value}</span>
    </div>
  );
}
