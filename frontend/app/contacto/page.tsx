'use client';

import React, { useState } from 'react';

import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle2,
  Clock,
} from 'lucide-react';

/*
  Ajustá esta ruta según dónde tengas guardado
  SellersCarousel.tsx
*/
import SellersCarousel from '../../components/SellersCarousel';
import { submitContact } from '../../lib/api';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [errors, setErrors] = useState<{
    [key: string]: string;
  }>({});

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }

  function validate() {
    const newErrors: {
      [key: string]: string;
    } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    }

    if (
      formData.email &&
      !/\S+@\S+\.\S+/.test(formData.email)
    ) {
      newErrors.email = 'Ingresá un email válido';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Escribinos tu consulta';
    }

    return newErrors;
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const validationErrors = validate();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      await submitContact({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      setSubmitted(true);

      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        form: err.message || 'No pudimos enviar tu consulta. Probá de nuevo en unos minutos.',
      }));
    } finally {
      setSubmitting(false);
    }
  }

  /*
    CAMBIAR POR LOS DATOS REALES DE DR
  */
  const whatsappNumber = '5493512345678';

  const whatsappMessage = encodeURIComponent(
    'Hola, quisiera realizar una consulta.'
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <main className="min-h-screen bg-[#071224]">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <section className="bg-[#071224] pb-12 pt-10 text-white">

        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">

          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7db4ff]">
            Contacto
          </span>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Estamos para ayudarte
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
            ¿Buscás un vehículo, querés financiarlo
            o tenés alguna consulta? Hablá
            directamente con nuestro equipo.
          </p>

        </div>

      </section>

      {/* ========================= */}
      {/* VENDEDORES */}
      {/* ========================= */}

      <section className="bg-white">

        <SellersCarousel />

      </section>

      {/* ========================= */}
      {/* CONTACTO GENERAL */}
      {/* ========================= */}

      <section className="bg-[#071224] py-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* TÍTULO */}

          <div className="mb-10 text-center">

            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7db4ff]">
              Contactanos
            </span>

            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              ¿Preferís dejarnos tu consulta?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-gray-300">
              Completá el formulario y nuestro
              equipo se va a comunicar con vos.
            </p>

          </div>

          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">

            {/* ========================= */}
            {/* INFORMACIÓN */}
            {/* ========================= */}

            <div className="space-y-4">

              {/* WHATSAPP */}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-5
                  backdrop-blur
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-[#1f4e96]
                  hover:bg-white/10
                "
              >

                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#1f4e96] text-white">
                  <MessageCircle size={23} />
                </div>

                <div>

                  <p className="text-sm text-gray-400">
                    WhatsApp
                  </p>

                  <p className="mt-0.5 font-semibold text-white">
                    Escribinos por WhatsApp
                  </p>

                </div>

              </a>

              {/* TELÉFONO */}

              <div
                className="
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-5
                  backdrop-blur
                "
              >

                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#1f4e96] text-white">
                  <Phone size={22} />
                </div>

                <div>

                  <p className="text-sm text-gray-400">
                    Teléfono
                  </p>

                  <p className="mt-0.5 font-semibold text-white">
                    +54 9 351 234 5678
                  </p>

                </div>

              </div>

              {/* EMAIL */}

              <div
                className="
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-5
                  backdrop-blur
                "
              >

                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#1f4e96] text-white">
                  <Mail size={22} />
                </div>

                <div>

                  <p className="text-sm text-gray-400">
                    Email
                  </p>

                  <p className="mt-0.5 font-semibold text-white">
                    contacto@drautomotores.com
                  </p>

                </div>

              </div>

              {/* UBICACIÓN */}

              <div
                className="
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-5
                  backdrop-blur
                "
              >

                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#1f4e96] text-white">
                  <MapPin size={22} />
                </div>

                <div>

                  <p className="text-sm text-gray-400">
                    Ubicación
                  </p>

                  <p className="mt-0.5 font-semibold text-white">
                    Córdoba, Argentina
                  </p>

                </div>

              </div>

              {/* HORARIOS */}

              <div
                className="
                  flex
                  items-start
                  gap-4
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-5
                  backdrop-blur
                "
              >

                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#1f4e96] text-white">
                  <Clock size={22} />
                </div>

                <div>

                  <p className="text-sm text-gray-400">
                    Horarios
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    Lunes a viernes
                  </p>

                  <p className="mt-1 text-sm text-gray-300">
                    08:30 a 18:30 hs
                  </p>

                  <p className="mt-3 font-semibold text-white">
                    Sábados
                  </p>

                  <p className="mt-1 text-sm text-gray-300">
                    09:00 a 13:00 hs
                  </p>

                </div>

              </div>

            </div>

            {/* ========================= */}
            {/* FORMULARIO */}
            {/* ========================= */}

            <div className="rounded-3xl bg-white p-6 shadow-2xl md:p-8">

              {submitted ? (

                /* MENSAJE DE ÉXITO */

                <div className="flex min-h-[480px] flex-col items-center justify-center text-center">

                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1f4e96]/10">

                    <CheckCircle2
                      size={32}
                      className="text-[#1f4e96]"
                    />

                  </div>

                  <h3 className="mt-5 text-2xl font-bold text-[#071224]">
                    ¡Consulta enviada!
                  </h3>

                  <p className="mt-3 max-w-sm text-gray-500">
                    Recibimos tu mensaje. Nuestro
                    equipo se va a comunicar con vos
                    a la brevedad.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setSubmitted(false)
                    }
                    className="
                      mt-6
                      rounded-xl
                      bg-[#071224]
                      px-6
                      py-3
                      font-semibold
                      text-white
                      transition
                      hover:bg-[#1f4e96]
                    "
                  >
                    Enviar otra consulta
                  </button>

                </div>

              ) : (

                <>

                  <div className="mb-7">

                    <h3 className="text-2xl font-bold text-[#071224]">
                      Envianos un mensaje
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Dejanos tus datos y contanos
                      cómo podemos ayudarte.
                    </p>

                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >

                    {/* NOMBRE */}

                    <ContactField
                      label="Nombre y apellido"
                      required
                      error={errors.name}
                    >

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ej. Juan Pérez"
                        className={inputClass(
                          !!errors.name
                        )}
                      />

                    </ContactField>

                    {/* TELÉFONO / EMAIL */}

                    <div className="grid gap-5 sm:grid-cols-2">

                      <ContactField
                        label="Teléfono"
                        required
                        error={errors.phone}
                      >

                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Ej. 351 1234567"
                          className={inputClass(
                            !!errors.phone
                          )}
                        />

                      </ContactField>

                      <ContactField
                        label="Email"
                        required
                        error={errors.email}
                      >

                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="ejemplo@email.com"
                          className={inputClass(
                            !!errors.email
                          )}
                        />

                      </ContactField>

                    </div>

                    {/* MOTIVO */}

                    <ContactField label="¿En qué podemos ayudarte?">

                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={inputClass(false)}
                      >

                        <option value="">
                          Seleccionar
                        </option>

                        <option value="vehiculo">
                          Consulta por un vehículo
                        </option>

                        <option value="financiacion">
                          Financiación
                        </option>

                        <option value="consignacion">
                          Consignación
                        </option>

                        <option value="permuta">
                          Entregar usado / Permuta
                        </option>

                        <option value="otra">
                          Otra consulta
                        </option>

                      </select>

                    </ContactField>

                    {/* CONSULTA */}

                    <ContactField
                      label="Mensaje"
                      required
                      error={errors.message}
                    >

                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Escribinos tu consulta..."
                        className={`${inputClass(
                          !!errors.message
                        )} resize-none`}
                      />

                    </ContactField>

                    {errors.form && (
                      <p className="text-sm font-medium text-red-600">
                        {errors.form}
                      </p>
                    )}

                    {/* BOTÓN */}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-[#071224]
                        px-6
                        py-3.5
                        font-semibold
                        text-white
                        shadow-md
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:bg-[#1f4e96]
                        hover:shadow-lg
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >

                      <Send size={18} />

                      {submitting
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

      {/* ========================= */}
      {/* CTA FINAL */}
      {/* ========================= */}

      <section className="border-t border-white/10 bg-[#071224] pb-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-[#1f4e96]
              px-6
              py-10
              text-center
              text-white
              shadow-2xl
              md:px-10
            "
          >

            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">

              <h2 className="text-2xl font-bold md:text-3xl">
                ¿Querés una respuesta más rápida?
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-blue-100">
                Escribinos directamente por WhatsApp
                y uno de nuestros vendedores te va a
                asesorar.
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-6
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-7
                  py-3.5
                  font-semibold
                  text-[#071224]
                  shadow-md
                  transition-all
                  hover:-translate-y-0.5
                  hover:shadow-lg
                "
              >

                <MessageCircle size={20} />

                Hablar por WhatsApp

              </a>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

/* ========================= */
/* CAMPO */
/* ========================= */

interface ContactFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function ContactField({
  label,
  required,
  error,
  children,
}: ContactFieldProps) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-gray-700">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

    </div>
  );
}

/* ========================= */
/* INPUT */
/* ========================= */

function inputClass(
  hasError: boolean
) {
  return `
    w-full
    rounded-xl
    border
    ${
      hasError
        ? 'border-red-500'
        : 'border-gray-200'
    }
    bg-gray-50
    px-4
    py-3
    text-sm
    text-gray-900
    outline-none
    transition
    placeholder:text-gray-400
    focus:bg-white
    ${
      hasError
        ? 'focus:border-red-500 focus:ring-2 focus:ring-red-100'
        : 'focus:border-[#1f4e96] focus:ring-2 focus:ring-[#1f4e96]/10'
    }
  `;
}