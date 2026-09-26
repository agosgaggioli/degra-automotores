'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ImagePlus } from 'lucide-react';
import { Vehicle, deleteVehicleImage } from '../../lib/api';

export interface VehicleFormValues {
  brand: string;
  model: string;
  version: string;
  year: string;
  mileage: string;
  price: string;
  currency: string;
  transmission: string;
  fuel: string;
  color: string;
  license_plate: string;
  description: string;
  status: 'published' | 'draft' | 'sold';
  featured: boolean;
}

const FUELS = ['Nafta', 'Diésel', 'GNC', 'Eléctrico', 'Híbrido'];
const TRANSMISSIONS = ['Manual', 'Automática', 'Secuencial'];

export function vehicleToFormValues(v?: Vehicle | null): VehicleFormValues {
  return {
    brand: v?.brand || '',
    model: v?.model || '',
    version: v?.version || '',
    year: v ? String(v.year) : '',
    mileage: v ? String(v.mileage) : '0',
    price: v ? String(v.price) : '',
    currency: v?.currency || 'ARS',
    transmission: v?.transmission || '',
    fuel: v?.fuel || '',
    color: v?.color || '',
    license_plate: v?.license_plate || '',
    description: v?.description || '',
    status: v?.status || 'published',
    featured: v?.featured || false,
  };
}

interface Props {
  initialValues: VehicleFormValues;
  existingImages?: { id: string; url: string }[];
  vehicleId?: string;
  submitting: boolean;
  submitLabel: string;
  error?: string;
  onSubmit: (values: VehicleFormValues, newImages: File[]) => void;
  onImagesChanged?: () => void;
}

export default function VehicleForm({
  initialValues,
  existingImages = [],
  vehicleId,
  submitting,
  submitLabel,
  error,
  onSubmit,
  onImagesChanged,
}: Props) {
  const [values, setValues] = useState<VehicleFormValues>(initialValues);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [images, setImages] = useState(existingImages);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Cada vez que se usa el selector de archivos, cambiamos esta "key" para que
  // React vuelva a crear el <input type="file"> desde cero. Esto evita un bug
  // conocido de los navegadores donde, al reutilizar el mismo input, la segunda
  // (o siguiente) selección de imágenes no dispara el evento onChange y las
  // fotos nuevas no se agregan.
  const [fileInputKey, setFileInputKey] = useState(0);

  // Genera (y limpia) una URL de previsualización por cada foto nueva,
  // para que se vea la imagen real en vez del nombre del archivo.
  useEffect(() => {
    const urls = newImages.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImages]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target as HTMLInputElement;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const selected = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...selected]);
    // Forzamos que el input se recree (ver comentario en fileInputKey) para
    // que la próxima vez que se abra el selector de archivos funcione bien,
    // incluso si es la segunda, tercera o décima vez.
    setFileInputKey((k) => k + 1);
  }

  function removeNewImage(idx: number) {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
  }

  async function removeExistingImage(imageId: string) {
    if (!vehicleId) return;
    if (!confirm('¿Eliminar esta imagen del vehículo?')) return;
    setRemovingId(imageId);
    try {
      await deleteVehicleImage(vehicleId, imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      onImagesChanged?.();
    } catch (err: any) {
      alert(err.message || 'No pudimos eliminar la imagen.');
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values, newImages);
      }}
      className="space-y-6"
    >
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold text-[#071224]">Datos del vehículo</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Marca" required>
            <input name="brand" value={values.brand} onChange={handleChange} required className={inputClass} />
          </Field>
          <Field label="Modelo" required>
            <input name="model" value={values.model} onChange={handleChange} required className={inputClass} />
          </Field>
          <Field label="Versión">
            <input name="version" value={values.version} onChange={handleChange} className={inputClass} />
          </Field>
          <Field label="Año" required>
            <input
              type="number"
              name="year"
              value={values.year}
              onChange={handleChange}
              required
              min={1950}
              max={new Date().getFullYear() + 1}
              className={inputClass}
            />
          </Field>
          <Field label="Kilometraje">
            <input type="number" name="mileage" value={values.mileage} onChange={handleChange} min={0} className={inputClass} />
          </Field>
          <Field label="Patente / Dominio">
            <input name="license_plate" value={values.license_plate} onChange={handleChange} className={inputClass} />
          </Field>
          <Field label="Color">
            <input name="color" value={values.color} onChange={handleChange} className={inputClass} />
          </Field>
          <Field label="Combustible">
            <select name="fuel" value={values.fuel} onChange={handleChange} className={inputClass}>
              <option value="">Seleccionar</option>
              {FUELS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Transmisión">
            <select name="transmission" value={values.transmission} onChange={handleChange} className={inputClass}>
              <option value="">Seleccionar</option>
              {TRANSMISSIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold text-[#071224]">Precio y publicación</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Precio" required>
            <input type="number" name="price" value={values.price} onChange={handleChange} required min={0} className={inputClass} />
          </Field>
          <Field label="Moneda">
            <select name="currency" value={values.currency} onChange={handleChange} className={inputClass}>
              <option value="ARS">ARS</option>
              <option value="USD">USD</option>
            </select>
          </Field>
          <Field label="Estado">
            <select name="status" value={values.status} onChange={handleChange} className={inputClass}>
              <option value="published">Publicado</option>
              <option value="draft">Borrador</option>
              <option value="sold">Vendido</option>
            </select>
          </Field>
          <div className="flex items-center gap-2 pt-7">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={values.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-[#1f4e96]"
            />
            <label htmlFor="featured" className="text-sm font-semibold text-gray-700">
              Destacado en portada
            </label>
          </div>
        </div>

        <div className="mt-5">
          <Field label="Descripción">
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold text-[#071224]">Imágenes</h2>

        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {images.map((img) => (
              <div key={img.id} className="relative h-24 overflow-hidden rounded-xl border border-gray-200">
                <Image src={img.url} alt="" fill className="object-cover" sizes="120px" />
                <button
                  type="button"
                  disabled={removingId === img.id}
                  onClick={() => removeExistingImage(img.id)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-600"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="mt-4 flex min-h-[110px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-6 text-center transition hover:border-[#1f4e96] hover:bg-[#1f4e96]/5">
          <ImagePlus size={24} className="text-[#1f4e96]" />
          <span className="mt-2 text-sm font-semibold text-[#071224]">Agregar imágenes</span>
          <span className="text-xs text-gray-500">JPG, PNG o WEBP</span>
          <input
            key={fileInputKey}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFiles}
            className="hidden"
          />
        </label>

        {newImages.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {newImages.map((file, idx) => (
              <div key={idx} className="relative h-24 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                {newImagePreviews[idx] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={newImagePreviews[idx]}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                )}
                <span className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-1.5 py-0.5 text-[9px] font-medium text-white">
                  Nueva
                </span>
                <button
                  type="button"
                  onClick={() => removeNewImage(idx)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-600"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-[#071224] px-6 py-3.5 font-semibold text-white transition hover:bg-[#1f4e96] disabled:cursor-not-allowed disabled:opacity-60"
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