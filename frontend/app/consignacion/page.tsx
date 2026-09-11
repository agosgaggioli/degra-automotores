'use client';

import React, { useState } from 'react';

import {
  User,
  CarFront,
  ImagePlus,
  CheckCircle2,
  Send,
  X,
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

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
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

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    const availableSlots =
      MAX_IMAGES - formData.images.length;

    if (availableSlots <= 0) {
      setErrors((prev) => ({
        ...prev,
        images: `Solo podés subir hasta ${MAX_IMAGES} imágenes.`,
      }));

      e.target.value = '';
      return;
    }

    const filesToAdd = selectedFiles.slice(
      0,
      availableSlots
    );

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...filesToAdd],
    }));

    if (selectedFiles.length > availableSlots) {
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
        (_, imageIndex) => imageIndex !== index
      ),
    }));

    setErrors((prev) => ({
      ...prev,
      images: '',
    }));
  }

  function validate() {
    const newErrors: {
      [key: string]: string;
    } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es obligatorio';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es obligatorio';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    }

    if (
      formData.email &&
      !/\S+@\S+\.\S+/.test(formData.email)
    ) {
      newErrors.email = 'Ingresá un correo válido';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'La marca es obligatoria';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'El modelo es obligatorio';
    }

    if (!formData.year.trim()) {
      newErrors.year = 'El año es obligatorio';
    }

    if (formData.images.length > MAX_IMAGES) {
      newErrors.images = `Solo podés subir hasta ${MAX_IMAGES} imágenes.`;
    }

    return newErrors;
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('firstName', formData.firstName);
      fd.append('lastName', formData.lastName);
      fd.append('phone', formData.phone);
      fd.append('email', formData.email);
      fd.append('city', formData.city);
      fd.append('brand', formData.brand);
      fd.append('model', formData.model);
      fd.append('version', formData.version);
      fd.append('year', formData.year);
      fd.append('mileage', formData.mileage);
      fd.append('licensePlate', formData.licensePlate);
      fd.append('color', formData.color);
      fd.append('fuel', formData.fuel);
      fd.append('transmission', formData.transmission);
      fd.append('expectedPrice', formData.expectedPrice);
      fd.append('observations', formData.observations);
      formData.images.forEach((image) => fd.append('images', image));

      await submitConsignment(fd);

      setSubmitted(true);
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        form: err.message || 'No pudimos enviar tu solicitud. Probá de nuevo en unos minutos.',
      }));
    } finally {
      setSubmitting(false);
    }
  }

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

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#071224] px-4 py-20">
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white p-8 text-center shadow-xl md:p-12">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1f4e96]/10">
            <CheckCircle2
              size={32}
              className="text-[#1f4e96]"
            />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-[#071224]">
            ¡Solicitud recibida!
          </h1>

          <p className="mt-3 leading-relaxed text-gray-600">
            Recibimos los datos de tu vehículo.
            Nuestro equipo va a revisar la información
            y se pondrá en contacto con vos.
          </p>

          <button
            type="button"
            onClick={resetForm}
            className="
              mt-7
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
            Enviar otra consignación
          </button>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#071224]">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <section className="bg-[#071224] pb-16 pt-10 text-white">

        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">

          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7db4ff]">
            Consignación
          </span>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Nosotros vendemos tu vehículo por vos
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-gray-200 md:text-lg">
            Completá los datos de tu vehículo y nuestro equipo
            se va a comunicar con vos para evaluar la unidad y
            acompañarte durante todo el proceso.
          </p>

        </div>

      </section>

      {/* ========================= */}
      {/* FORMULARIO */}
      {/* ========================= */}

      <section className="bg-[#071224] pb-16">

        <div className="mx-auto max-w-5xl px-4 sm:px-6">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* ========================= */}
            {/* DATOS PERSONALES */}
            {/* ========================= */}

            <section className="rounded-3xl border border-white/10 bg-white p-6 shadow-xl md:p-8">

              <SectionTitle
                icon={<User size={22} />}
                title="Datos personales"
                description="Contanos cómo podemos contactarte."
              />

              <div className="mt-7 grid gap-5 md:grid-cols-2">

                <FormField
                  label="Nombre"
                  required
                  error={errors.firstName}
                >
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Ej. Juan"
                    className={inputClass(
                      !!errors.firstName
                    )}
                  />
                </FormField>

                <FormField
                  label="Apellido"
                  required
                  error={errors.lastName}
                >
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Ej. Pérez"
                    className={inputClass(
                      !!errors.lastName
                    )}
                  />
                </FormField>

                <FormField
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
                </FormField>

                <FormField
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
                </FormField>

                <div className="md:col-span-2">

                  <FormField label="Localidad">

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Ej. Córdoba"
                      className={inputClass(false)}
                    />

                  </FormField>

                </div>

              </div>

            </section>

            {/* ========================= */}
            {/* DATOS DEL VEHÍCULO */}
            {/* ========================= */}

            <section className="rounded-3xl border border-white/10 bg-white p-6 shadow-xl md:p-8">

              <SectionTitle
                icon={<CarFront size={22} />}
                title="Datos del vehículo"
                description="Completá la información principal de la unidad."
              />

              <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                <FormField
                  label="Marca"
                  required
                  error={errors.brand}
                >
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Ej. Toyota"
                    className={inputClass(
                      !!errors.brand
                    )}
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
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="Ej. Hilux"
                    className={inputClass(
                      !!errors.model
                    )}
                  />
                </FormField>

                <FormField label="Versión">
                  <input
                    type="text"
                    name="version"
                    value={formData.version}
                    onChange={handleChange}
                    placeholder="Ej. SRX 2.8"
                    className={inputClass(false)}
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
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="Ej. 2023"
                    min={1950}
                    max={new Date().getFullYear() + 1}
                    className={inputClass(
                      !!errors.year
                    )}
                  />
                </FormField>

                <FormField label="Kilometraje">
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    placeholder="Ej. 45000"
                    min={0}
                    className={inputClass(false)}
                  />
                </FormField>

                <FormField label="Dominio / Patente">
                  <input
                    type="text"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleChange}
                    placeholder="Ej. AB123CD"
                    className={inputClass(false)}
                  />
                </FormField>

                <FormField label="Color">
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="Ej. Gris"
                    className={inputClass(false)}
                  />
                </FormField>

                <FormField label="Combustible">

                  <select
                    name="fuel"
                    value={formData.fuel}
                    onChange={handleChange}
                    className={inputClass(false)}
                  >

                    <option value="">
                      Seleccionar
                    </option>

                    {fuels.map((fuel) => (
                      <option
                        key={fuel}
                        value={fuel}
                      >
                        {fuel}
                      </option>
                    ))}

                  </select>

                </FormField>

                <FormField label="Transmisión">

                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    className={inputClass(false)}
                  >

                    <option value="">
                      Seleccionar
                    </option>

                    {transmissions.map(
                      (transmission) => (
                        <option
                          key={transmission}
                          value={transmission}
                        >
                          {transmission}
                        </option>
                      )
                    )}

                  </select>

                </FormField>

              </div>

            </section>

            {/* ========================= */}
            {/* INFORMACIÓN ADICIONAL */}
            {/* ========================= */}

            <section className="rounded-3xl border border-white/10 bg-white p-6 shadow-xl md:p-8">

              <h2 className="text-xl font-bold text-[#071224]">
                Información adicional
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Estos datos nos ayudan a tener una primera referencia
                de tu vehículo.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">

                <FormField label="Precio pretendido">

                  <input
                    type="number"
                    name="expectedPrice"
                    value={formData.expectedPrice}
                    onChange={handleChange}
                    placeholder="Ej. 25000000"
                    min={0}
                    className={inputClass(false)}
                  />

                </FormField>

                <FormField label="Observaciones">

                  <textarea
                    name="observations"
                    value={formData.observations}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Contanos cualquier detalle que consideres importante..."
                    className={`${inputClass(
                      false
                    )} resize-none`}
                  />

                </FormField>

              </div>

            </section>

            {/* ========================= */}
            {/* IMÁGENES */}
            {/* ========================= */}

            <section className="rounded-3xl border border-white/10 bg-white p-6 shadow-xl md:p-8">

              <SectionTitle
                icon={<ImagePlus size={22} />}
                title="Imágenes del vehículo"
                description="Podés cargar hasta 5 imágenes de la unidad."
              />

              <div className="mt-6">

                <label
                  className={`
                    flex
                    min-h-[150px]
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    border-2
                    border-dashed
                    px-6
                    py-8
                    text-center
                    transition
                    ${
                      formData.images.length >= MAX_IMAGES
                        ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-60'
                        : 'cursor-pointer border-gray-300 bg-gray-50 hover:border-[#1f4e96] hover:bg-[#1f4e96]/5'
                    }
                  `}
                >

                  <ImagePlus
                    size={30}
                    className="text-[#1f4e96]"
                  />

                  <span className="mt-3 font-semibold text-[#071224]">
                    {formData.images.length >= MAX_IMAGES
                      ? 'Llegaste al máximo de imágenes'
                      : 'Seleccionar imágenes'}
                  </span>

                  <span className="mt-1 text-sm text-gray-500">
                    JPG, PNG o WEBP • máximo 5 imágenes
                  </span>

                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    disabled={
                      formData.images.length >= MAX_IMAGES
                    }
                    className="hidden"
                  />

                </label>

                <div className="mt-3 flex items-center justify-between">

                  <p className="text-sm text-gray-500">
                    {formData.images.length} de{' '}
                    {MAX_IMAGES} imágenes seleccionadas
                  </p>

                  {formData.images.length > 0 &&
                    formData.images.length < MAX_IMAGES && (
                      <p className="text-sm font-semibold text-[#1f4e96]">
                        {MAX_IMAGES -
                          formData.images.length}{' '}
                        disponibles
                      </p>
                    )}

                </div>

                {errors.images && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {errors.images}
                  </p>
                )}

                {formData.images.length > 0 && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

                    {formData.images.map(
                      (image, index) => (
                        <div
                          key={`${image.name}-${index}`}
                          className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3"
                        >

                          <div className="flex h-24 items-center justify-center rounded-lg bg-gray-100 px-2">

                            <p className="line-clamp-2 break-all text-center text-xs font-medium text-gray-600">
                              {image.name}
                            </p>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeImage(index)
                            }
                            className="
                              absolute
                              right-1.5
                              top-1.5
                              flex
                              h-7
                              w-7
                              items-center
                              justify-center
                              rounded-full
                              bg-[#071224]
                              text-white
                              shadow
                              transition
                              hover:bg-red-600
                            "
                          >
                            <X size={15} />
                          </button>

                          <p className="mt-2 text-center text-xs font-semibold text-[#1f4e96]">
                            Foto {index + 1}
                          </p>

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>

            </section>

            {/* ========================= */}
            {/* BOTÓN */}
            {/* ========================= */}

            {errors.form && (
              <p className="text-center text-sm font-medium text-red-500">
                {errors.form}
              </p>
            )}

            <div className="flex justify-center pb-6 pt-4">

              <button
                type="submit"
                disabled={submitting}
                className="
                  inline-flex
                  min-w-[230px]
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#1f4e96]
                  px-8
                  py-3.5
                  font-semibold
                  text-white
                  shadow-lg
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#163b71]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                <Send size={18} />

                {submitting
                  ? 'Enviando...'
                  : 'Enviar solicitud'}

              </button>

            </div>

          </form>

        </div>

      </section>

    </main>
  );
}

/* ========================= */
/* SECTION TITLE */
/* ========================= */

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

      <div
        className="
          flex
          h-11
          w-11
          flex-shrink-0
          items-center
          justify-center
          rounded-xl
          bg-[#1f4e96]/10
          text-[#1f4e96]
        "
      >
        {icon}
      </div>

      <div>

        <h2 className="text-xl font-bold text-[#071224]">
          {title}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>

      </div>

    </div>
  );
}

/* ========================= */
/* FORM FIELD */
/* ========================= */

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
/* INPUT STYLE */
/* ========================= */

function inputClass(hasError: boolean) {
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