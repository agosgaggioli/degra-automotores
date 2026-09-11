'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import VehicleForm, { VehicleFormValues, vehicleToFormValues } from '../../../../../components/admin/VehicleForm';
import { fetchAdminVehicle, updateVehicle } from '../../../../../lib/api';

export default function EditVehiclePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id as string;

  const [initialValues, setInitialValues] = useState<VehicleFormValues | null>(null);
  const [images, setImages] = useState<{ id: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');

  function load() {
    fetchAdminVehicle(id)
      .then((res) => {
        setInitialValues(vehicleToFormValues(res.data as any));
        setImages(res.data.images);
      })
      .catch((err) => setLoadError(err.message || 'No pudimos cargar el vehículo.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSubmit(values: VehicleFormValues, newImages: File[]) {
    setSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([key, value]) => fd.append(key, String(value)));
      newImages.forEach((file) => fd.append('images', file));

      await updateVehicle(id, fd);
      router.push('/admin/vehiculos');
    } catch (err: any) {
      setError(err.message || 'No pudimos guardar los cambios.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Link href="/admin/vehiculos" className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#1f4e96]">
        <ArrowLeft size={16} />
        Volver a vehículos
      </Link>

      <h1 className="mt-3 text-2xl font-bold text-[#071224]">Editar vehículo</h1>
      <p className="mt-1 text-sm text-gray-500">Actualizá los datos o las fotos del vehículo.</p>

      <div className="mt-6 max-w-4xl">
        {loading ? (
          <p className="text-sm text-gray-500">Cargando...</p>
        ) : loadError ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{loadError}</p>
        ) : (
          initialValues && (
            <VehicleForm
              initialValues={initialValues}
              existingImages={images}
              vehicleId={id}
              submitting={submitting}
              submitLabel="Guardar cambios"
              error={error}
              onSubmit={handleSubmit}
              onImagesChanged={load}
            />
          )
        )}
      </div>
    </div>
  );
}
