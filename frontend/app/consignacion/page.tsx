'use client';

import React, { useState } from 'react';

import {
  User,
  CarFront,
  ImagePlus,
  CheckCircle2,
  Send,
  X,
  ShieldCheck,
  ClipboardCheck,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';

import { submitConsignment } from '../../lib/api';

export default function ConsignacionPage() {
  const MAX_IMAGES = 5;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: '',
    brand: '',
    model: '',
    version: '',
    year: '',
    mileage: '',
    licensePlate: '',
    color: '',
    fuel: '',
    transmission: '',
    expectedPrice: '',
    observations: '',
    images: [] as File[],
  });

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [errors, setErrors] = useState<{
    [key: string]: string;
  }>({});

  const fuels = [
    'Nafta',
    'Diésel',
    'GNC',
    'Eléctrico',
    'Híbrido',
  ];

  const transmissions = [
    'Manual',
    'Automática',
    'Secuencial',
  ];

  /* =========================================
     INPUTS
  ========================================= */

  function handleChange(
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >,
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

  /* =========================================
     IMÁGENES
  ========================================= */

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    if (!e.target.files) return;

    const selectedFiles = Array.from(
      e.target.files,
    );

    const availableSlots =
      MAX_IMAGES -
      formData.images.length;

    if (availableSlots <= 0) {
      setErrors((prev) => ({
        ...prev,
        images: `Solo podés subir hasta ${MAX_IMAGES} imágenes.`,
      }));

      e.target.value = '';
      return;
    }

    const filesToAdd =
      selectedFiles.slice(
        0,
        availableSlots,
      );

    setFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        ...filesToAdd,
      ],
    }));

    if (
      selectedFiles.length >
      availableSlots
    ) {
      setErrors((prev) => ({
        ...prev,
        images: `Podés cargar un máximo de ${MAX_IMAGES} imágenes.`,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        images: '',
      }));
    }

    e.target.value = '';
  }

  function removeImage(index: number) {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter(
        (_, imageIndex) =>
          imageIndex !== index,
      ),
    }));

    setErrors((prev) => ({
      ...prev,
      images: '',
    }));
  }

  /* =========================================
     VALIDACIÓN
  ========================================= */

  function validate() {
    const newErrors: {
      [key: string]: string;
    } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName =
        'El nombre es obligatorio';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName =
        'El apellido es obligatorio';
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        'El teléfono es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email =
        'El correo es obligatorio';
    }

    if (
      formData.email &&
      !/\S+@\S+\.\S+/.test(
        formData.email,
      )
    ) {
      newErrors.email =
        'Ingresá un correo válido';
    }

    if (!formData.brand.trim()) {
      newErrors.brand =
        'La marca es obligatoria';
    }

    if (!formData.model.trim()) {
      newErrors.model =
        'El modelo es obligatorio';
    }

    if (!formData.year.trim()) {
      newErrors.year =
        'El año es obligatorio';
    }

    if (
      formData.images.length >
      MAX_IMAGES
    ) {
      newErrors.images =
        `Solo podés subir hasta ${MAX_IMAGES} imágenes.`;
    }

    return newErrors;
  }

  /* =========================================
     SUBMIT
  ========================================= */

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    const validationErrors =
      validate();

    if (
      Object.keys(
        validationErrors,
      ).length > 0
    ) {
      setErrors(
        validationErrors,
      );

      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const fd = new FormData();

      fd.append(
        'firstName',
        formData.firstName,
      );

      fd.append(
        'lastName',
        formData.lastName,
      );

      fd.append(
        'phone',
        formData.phone,
      );

      fd.append(
        'email',
        formData.email,
      );

      fd.append(
        'city',
        formData.city,
      );

      fd.append(
        'brand',
        formData.brand,
      );

      fd.append(
        'model',
        formData.model,
      );

      fd.append(
        'version',
        formData.version,
      );

      fd.append(
        'year',
        formData.year,
      );

      fd.append(
        'mileage',
        formData.mileage,
      );

      fd.append(
        'licensePlate',
        formData.licensePlate,
      );

      fd.append(
        'color',
        formData.color,
      );

      fd.append(
        'fuel',
        formData.fuel,
      );

      fd.append(
        'transmission',
        formData.transmission,
      );

      fd.append(
        'expectedPrice',
        formData.expectedPrice,
      );

      fd.append(
        'observations',
        formData.observations,
      );

      formData.images.forEach(
        (image) =>
          fd.append(
            'images',
            image,
          ),
      );

      await submitConsignment(fd);

      setSubmitted(true);
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        form:
          err.message ||
          'No pudimos enviar tu solicitud. Probá de nuevo en unos minutos.',
      }));
    } finally {
      setSubmitting(false);
    }
  }

  /* =========================================
     RESET
  ========================================= */

  function resetForm() {
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      city: '',
      brand: '',
      model: '',
      version: '',
      year: '',
      mileage: '',
      licensePlate: '',
      color: '',
      fuel: '',
      transmission: '',
      expectedPrice: '',
      observations: '',
      images: [],
    });

    setErrors({});
    setSubmitted(false);
  }

  /* =========================================
     ÉXITO
  ========================================= */

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#071224] px-4 py-24">

        <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-[#0c192d] p-8 text-center shadow-2xl">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-400/10 text-blue-300">
            <CheckCircle2
              size={28}
            />
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-white">
            ¡Solicitud recibida!
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Recibimos los datos de tu vehículo.
            Nuestro equipo va a revisar la
            información y se pondrá en contacto
            con vos.
          </p>

          <button
            type="button"
            onClick={resetForm}
            className="
              mt-6
              inline-flex
              h-10
              items-center
              justify-center
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
            Enviar otra consignación
          </button>

        </div>

      </main>
    );
  }

  /* =========================================
     PAGE
  ========================================= */

  return (
    <main className="min-h-screen bg-[#071224] text-white">

      {/* =====================================
          HERO
      ===================================== */}

      <section className="relative overflow-hidden border-b border-white/10">

        <div className="pointer-events-none absolute -right-40 -top-48 h-[480px] w-[480px] rounded-full bg-[#1f4e96]/20 blur-[130px]" />

        <div className="pointer-events-none absolute -left-40 top-24 h-[350px] w-[350px] rounded-full bg-[#163b71]/15 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-9 pt-28 sm:px-6 lg:px-8">

          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
            Consignación
          </span>

          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Vendemos tu vehículo por vos
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Completá los datos de la unidad y
            nuestro equipo se va a comunicar
            con vos para evaluarla y acompañarte
            durante todo el proceso.
          </p>

        </div>

      </section>

      {/* =====================================
          CONTENIDO
      ===================================== */}

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">

          {/* =================================
              FORM
          ================================= */}

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-5"
          >

            {/* =================================
                DATOS PERSONALES
            ================================= */}

            <section className="rounded-2xl border border-white/10 bg-[#0c192d] p-5 md:p-6">

              <SectionTitle
                icon={
                  <User size={18} />
                }
                title="Datos de contacto"
                description="Información para poder comunicarnos con vos."
              />

              <div className="mt-5 grid gap-4 md:grid-cols-2">

                <FormField
                  label="Nombre"
                  required
                  error={
                    errors.firstName
                  }
                >
                  <input
                    type="text"
                    name="firstName"
                    value={
                      formData.firstName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Ej. Juan"
                    className={
                      inputClass(
                        !!errors.firstName,
                      )
                    }
                  />
                </FormField>

                <FormField
                  label="Apellido"
                  required
                  error={
                    errors.lastName
                  }
                >
                  <input
                    type="text"
                    name="lastName"
                    value={
                      formData.lastName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Ej. Pérez"
                    className={
                      inputClass(
                        !!errors.lastName,
                      )
                    }
                  />
                </FormField>

                <FormField
                  label="Teléfono"
                  required
                  error={
                    errors.phone
                  }
                >
                  <input
                    type="tel"
                    name="phone"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Ej. 351 1234567"
                    className={
                      inputClass(
                        !!errors.phone,
                      )
                    }
                  />
                </FormField>

                <FormField
                  label="Email"
                  required
                  error={
                    errors.email
                  }
                >
                  <input
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="ejemplo@email.com"
                    className={
                      inputClass(
                        !!errors.email,
                      )
                    }
                  />
                </FormField>

                <div className="md:col-span-2">

                  <FormField label="Localidad">

                    <input
                      type="text"
                      name="city"
                      value={
                        formData.city
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Ej. Córdoba"
                      className={
                        inputClass(false)
                      }
                    />

                  </FormField>

                </div>

              </div>

            </section>

            {/* =================================
                VEHÍCULO
            ================================= */}

            <section className="rounded-2xl border border-white/10 bg-[#0c192d] p-5 md:p-6">

              <SectionTitle
                icon={
                  <CarFront size={18} />
                }
                title="Datos del vehículo"
                description="Completá la información principal de la unidad."
              />

              <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                <FormField
                  label="Marca"
                  required
                  error={errors.brand}
                >
                  <input
                    type="text"
                    name="brand"
                    value={
                      formData.brand
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Ej. Toyota"
                    className={
                      inputClass(
                        !!errors.brand,
                      )
                    }
                  />
                </FormField>

                <FormField
                  label="Modelo"
                  required
                  error={errors.model}
                >
                  <input
                    type="text"
                    name="model"
                    value={
                      formData.model
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Ej. Hilux"
                    className={
                      inputClass(
                        !!errors.model,
                      )
                    }
                  />
                </FormField>

                <FormField label="Versión">
                  <input
                    type="text"
                    name="version"
                    value={
                      formData.version
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Ej. SRX 2.8"
                    className={
                      inputClass(false)
                    }
                  />
                </FormField>

                <FormField
                  label="Año"
                  required
                  error={errors.year}
                >
                  <input
                    type="number"
                    name="year"
                    value={
                      formData.year
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Ej. 2023"
                    min={1950}
                    max={
                      new Date().getFullYear() +
                      1
                    }
                    className={
                      inputClass(
                        !!errors.year,
                      )
                    }
                  />
                </FormField>

                <FormField label="Kilometraje">
                  <input
                    type="number"
                    name="mileage"
                    value={
                      formData.mileage
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Ej. 45000"
                    min={0}
                    className={
                      inputClass(false)
                    }
                  />
                </FormField>

                <FormField label="Dominio / Patente">
                  <input
                    type="text"
                    name="licensePlate"
                    value={
                      formData.licensePlate
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Ej. AB123CD"
                    className={
                      inputClass(false)
                    }
                  />
                </FormField>

                <FormField label="Color">
                  <input
                    type="text"
                    name="color"
                    value={
                      formData.color
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Ej. Gris"
                    className={
                      inputClass(false)
                    }
                  />
                </FormField>

                <FormField label="Combustible">
                  <select
                    name="fuel"
                    value={
                      formData.fuel
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      inputClass(false)
                    }
                  >
                    <option value="">
                      Seleccionar
                    </option>

                    {fuels.map(
                      (fuel) => (
                        <option
                          key={fuel}
                          value={fuel}
                        >
                          {fuel}
                        </option>
                      ),
                    )}
                  </select>
                </FormField>

                <FormField label="Transmisión">
                  <select
                    name="transmission"
                    value={
                      formData.transmission
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      inputClass(false)
                    }
                  >
                    <option value="">
                      Seleccionar
                    </option>

                    {transmissions.map(
                      (
                        transmission,
                      ) => (
                        <option
                          key={
                            transmission
                          }
                          value={
                            transmission
                          }
                        >
                          {
                            transmission
                          }
                        </option>
                      ),
                    )}
                  </select>
                </FormField>

                <FormField label="Precio pretendido">
                  <input
                    type="number"
                    name="expectedPrice"
                    value={
                      formData.expectedPrice
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Ej. 25000000"
                    min={0}
                    className={
                      inputClass(false)
                    }
                  />
                </FormField>

                <div className="md:col-span-2 lg:col-span-2">

                  <FormField label="Observaciones">
                    <textarea
                      name="observations"
                      value={
                        formData.observations
                      }
                      onChange={
                        handleChange
                      }
                      rows={3}
                      placeholder="Contanos cualquier detalle que consideres importante..."
                      className={`${inputClass(
                        false,
                      )} min-h-[90px] resize-none`}
                    />
                  </FormField>

                </div>

              </div>

              {/* =============================
                  IMÁGENES
              ============================= */}

              <div className="mt-6 border-t border-white/10 pt-5">

                <div className="flex items-center gap-2">

                  <ImagePlus
                    size={17}
                    className="text-blue-300"
                  />

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Imágenes del vehículo
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Podés cargar hasta 5 imágenes.
                    </p>
                  </div>

                </div>

                <div className="mt-4">

                  <label
                    className={`
                      flex
                      min-h-[105px]
                      cursor-pointer
                      flex-col
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-dashed
                      px-5
                      py-5
                      text-center
                      transition
                      ${
                        formData.images.length >=
                        MAX_IMAGES
                          ? 'cursor-not-allowed border-white/10 bg-white/[0.02] opacity-50'
                          : 'border-white/15 bg-[#071224] hover:border-[#3169b7] hover:bg-[#0a172b]'
                      }
                    `}
                  >

                    <ImagePlus
                      size={23}
                      className="text-blue-300"
                    />

                    <span className="mt-2 text-sm font-medium text-slate-300">
                      {formData.images.length >=
                      MAX_IMAGES
                        ? 'Llegaste al máximo de imágenes'
                        : 'Seleccionar imágenes'}
                    </span>

                    <span className="mt-1 text-[11px] text-slate-600">
                      JPG, PNG o WEBP
                    </span>

                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={
                        handleFileChange
                      }
                      disabled={
                        formData.images.length >=
                        MAX_IMAGES
                      }
                      className="hidden"
                    />

                  </label>

                  {errors.images && (
                    <p className="mt-2 text-xs font-medium text-red-400">
                      {errors.images}
                    </p>
                  )}

                  {formData.images.length >
                    0 && (
                    <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

                      {formData.images.map(
                        (
                          image,
                          index,
                        ) => (
                          <div
                            key={`${image.name}-${index}`}
                            className="relative rounded-lg border border-white/10 bg-[#071224] p-2.5"
                          >

                            <div className="flex h-16 items-center justify-center rounded-md bg-white/[0.03] px-2">

                              <p className="line-clamp-2 break-all text-center text-[10px] text-slate-400">
                                {
                                  image.name
                                }
                              </p>

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeImage(
                                  index,
                                )
                              }
                              className="
                                absolute
                                right-1
                                top-1
                                flex
                                h-6
                                w-6
                                items-center
                                justify-center
                                rounded-full
                                bg-[#071224]
                                text-slate-400
                                transition
                                hover:bg-red-600
                                hover:text-white
                              "
                            >
                              <X size={13} />
                            </button>

                            <p className="mt-1.5 text-center text-[10px] font-medium text-blue-300">
                              Foto {index + 1}
                            </p>

                          </div>
                        ),
                      )}

                    </div>
                  )}

                  <p className="mt-3 text-[11px] text-slate-600">
                    {
                      formData.images.length
                    }{' '}
                    de {MAX_IMAGES} imágenes
                    seleccionadas
                  </p>

                </div>

              </div>

            </section>

            {/* ERROR GENERAL */}

            {errors.form && (
              <div className="rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {errors.form}
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={submitting}
              className="
                flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-[#1f4e96]
                px-6
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#295eaa]
                disabled:cursor-not-allowed
                disabled:opacity-60
                md:w-fit
              "
            >
              <Send size={16} />

              {submitting
                ? 'Enviando...'
                : 'Enviar solicitud'}

              {!submitting && (
                <ArrowRight
                  size={14}
                />
              )}

            </button>

          </form>

          {/* =================================
              ASIDE
          ================================= */}

          <aside className="h-fit lg:sticky lg:top-24">

            <div className="rounded-2xl border border-white/10 bg-[#0c192d] p-5">

              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-300">
                ¿Cómo funciona?
              </p>

              <div className="mt-5 space-y-5">

                <ProcessItem
                  number="01"
                  icon={
                    <ClipboardCheck
                      size={16}
                    />
                  }
                  title="Enviás los datos"
                  description="Completás la información básica de tu vehículo."
                />

                <ProcessItem
                  number="02"
                  icon={
                    <CarFront
                      size={16}
                    />
                  }
                  title="Evaluamos la unidad"
                  description="Nuestro equipo revisa la información y se contacta con vos."
                />

                <ProcessItem
                  number="03"
                  icon={
                    <MessageCircle
                      size={16}
                    />
                  }
                  title="Coordinamos la venta"
                  description="Te acompañamos durante todo el proceso de consignación."
                />

              </div>

              <div className="mt-6 border-t border-white/10 pt-5">

                <div className="flex gap-3">

                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-300"
                  />

                  <p className="text-xs leading-5 text-slate-500">
                    Cargar tus datos no implica
                    ningún compromiso. Nuestro
                    equipo primero evalúa la unidad
                    y luego coordina con vos los
                    próximos pasos.
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </section>

    </main>
  );
}

/* =========================================
   SECTION TITLE
========================================= */

interface SectionTitleProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function SectionTitle({
  icon,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="flex items-start gap-3">

      <div className="
        flex
        h-9
        w-9
        shrink-0
        items-center
        justify-center
        rounded-lg
        bg-[#1f4e96]/15
        text-blue-300
      ">
        {icon}
      </div>

      <div>
        <h2 className="text-base font-semibold text-white">
          {title}
        </h2>

        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>
      </div>

    </div>
  );
}

/* =========================================
   FORM FIELD
========================================= */

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function FormField({
  label,
  required,
  error,
  children,
}: FormFieldProps) {
  return (
    <div>

      <label className="mb-1.5 block text-xs font-medium text-slate-300">

        {label}

        {required && (
          <span className="ml-1 text-red-400">
            *
          </span>
        )}

      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-400">
          {error}
        </p>
      )}

    </div>
  );
}

/* =========================================
   PROCESS ITEM
========================================= */

interface ProcessItemProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ProcessItem({
  number,
  icon,
  title,
  description,
}: ProcessItemProps) {
  return (
    <div className="flex gap-3">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1f4e96]/15 text-blue-300">
        {icon}
      </div>

      <div>

        <div className="flex items-center gap-2">

          <span className="text-[9px] font-bold tracking-wider text-slate-600">
            {number}
          </span>

          <h3 className="text-sm font-medium text-slate-200">
            {title}
          </h3>

        </div>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
}

/* =========================================
   INPUT STYLE
========================================= */

function inputClass(
  hasError: boolean,
) {
  return `
    h-10
    w-full
    rounded-lg
    border
    ${
      hasError
        ? 'border-red-400'
        : 'border-white/10'
    }
    bg-[#071224]
    px-3
    text-xs
    text-white
    outline-none
    transition
    placeholder:text-slate-600
    hover:border-white/20
    focus:bg-[#071224]
    ${
      hasError
        ? 'focus:border-red-400 focus:ring-2 focus:ring-red-400/10'
        : 'focus:border-[#3169b7] focus:ring-2 focus:ring-[#3169b7]/15'
    }
  `;
}