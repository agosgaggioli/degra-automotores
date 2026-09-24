'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ImagePlus, X } from 'lucide-react';
import { Financing } from '../../lib/api';

export interface FinancingFormValues {
  type: 'general' | 'brand';
  bank: string;
  name: string;
  cuotas: string;
  tasa: string;
  anticipo: string;
  beneficio: string;
  url: string;
  brand: string;
  status: 'published' | 'draft';
}

export function financingToFormValues(f?: Financing | null): FinancingFormValues {
  return {
    type: f?.type || 'general',
    bank: f?.bank || '',
    name: f?.name || '',
    cuotas: f ? String(f.cuotas) : '',
    tasa: f?.tasa || '',
    anticipo: f?.anticipo || '',
    beneficio: f?.beneficio || '',
    url: f?.url || '/contacto',
    brand: f?.brand || '',
    status: f?.status || 'published',
  };
}

interface Props {
  initialValues: FinancingFormValues;
  existingLogo?: string | null;
  submitting: boolean;
  submitLabel: string;
  error?: string;
  onSubmit: (values: FinancingFormValues, logoFile: File | null) => void;
}

export default function FinancingForm({
  initialValues,
  existingLogo,
  submitting,
  submitLabel,
  error,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<FinancingFormValues>(initialValues);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(existingLogo || null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    e.target.value = '';
  }

  function removeLogo() {
    setLogoFile(null);
    setLogoPreview(null);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values, logoFile);
      }}
      className="space-y-6"
    >
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold text-[#071224]">Tipo de financiación</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label
            className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${
              values.type === 'general' ? 'border-[#1f4e96] bg-[#1f4e96]/5' : 'border-gray-200'
            }`}
          >
            <input
              type="radio"
              name="type"
              value="general"
              checked={values.type === 'general'}
              onChange={handleChange}
              className="h-4 w-4 accent-[#1f4e96]"
            />
            <div>
              <p className="font-semibold text-gray-900">General</p>
              <p className="text-xs text-gray-500">Disponible para cualquier vehículo</p>
            </div>
          </label>

          <label
            className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${
              values.type === 'brand' ? 'border-[#1f4e96] bg-[#1f4e96]/5' : 'border-gray-200'
            }`}
          >
            <input
              type="radio"
              name="type"
              value="brand"
              checked={values.type === 'brand'}
              onChange={handleChange}
              className="h-4 w-4 accent-[#1f4e96]"
            />
            <div>
              <p className="font-semibold text-gray-900">Por marca</p>
              <p className="text-xs text-gray-500">Beneficio exclusivo para una marca</p>
            </div>
          </label>
        </div>

        {values.type === 'brand' && (
          <div className="mt-4">
            <Field label="Marca" required>
              <input
                name="brand"
                value={values.brand}
                onChange={handleChange}
                required
                placeholder="Ej: Toyota"
                className={inputClass}
              />
            </Field>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold text-[#071224]">Datos del plan</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Banco / entidad" required>
            <input name="bank" value={values.bank} onChange={handleChange} required className={inputClass} />
          </Field>
          <Field label="Nombre del plan" required>
            <input name="name" value={values.name} onChange={handleChange} required className={inputClass} />
          </Field>
          <Field label="Cuotas" required>
            <input
              type="number"
              name="cuotas"
              value={values.cuotas}
              onChange={handleChange}
              required
              min={1}
              className={inputClass}
            />
          </Field>
          <Field label="Tasa">
            <input name="tasa" value={values.tasa} onChange={handleChange} placeholder="Ej: 18%" className={inputClass} />
          </Field>
          <Field label="Anticipo">
            <input
              name="anticipo"
              value={values.anticipo}
              onChange={handleChange}
              placeholder="Ej: 30%"
              className={inputClass}
            />
          </Field>
          <Field label="Estado">
            <select name="status" value={values.status} onChange={handleChange} className={inputClass}>
              <option value="published">Publicado</option>
              <option value="draft">Borrador</option>
            </select>
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Beneficio / descripción corta">
            <textarea
              name="beneficio"
              value={values.beneficio}
              onChange={handleChange}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Link del botón (a dónde lleva la card)">
            <input name="url" value={values.url} onChange={handleChange} placeholder="/contacto" className={inputClass} />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold text-[#071224]">Logo del banco</h2>
        <p className="mt-1 text-xs text-gray-500">Opcional. Si no subís uno, se muestra un ícono genérico.</p>

        {logoPreview ? (
          <div className="relative mt-4 h-20 w-40 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-2">
            <Image src={logoPreview} alt="" fill className="object-contain p-2" sizes="160px" />
            <button
              type="button"
              onClick={removeLogo}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-600"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <label className="mt-4 flex h-24 w-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center transition hover:border-[#1f4e96] hover:bg-[#1f4e96]/5">
            <ImagePlus size={20} className="text-[#1f4e96]" />
            <span className="mt-1 text-xs font-semibold text-[#071224]">Subir logo</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleLogoChange} className="hidden" />
          </label>
        )}
      </section>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-[#1f4e96] px-6 py-3.5 font-semibold text-white transition hover:bg-[#163b71] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Guardando...' : submitLabel}
      </button>
    </form>
  );
}

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-[#1f4e96] focus:bg-white focus:ring-2 focus:ring-[#1f4e96]/10';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}