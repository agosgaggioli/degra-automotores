'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import VehicleForm, { VehicleFormValues, vehicleToFormValues } from '../../../../../components/admin/VehicleForm';
import { createVehicle } from '../../../../../lib/api';

export default function NewVehiclePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(values: VehicleFormValues, newImages: File[]) {
    setSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([key, value]) => fd.append(key, String(value)));
      newImages.forEach((file) => fd.append('images', file));

      const { data } = await createVehicle(fd);
      router.push(`/admin/vehiculos/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'No pudimos crear el vehículo.');
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

      <h1 className="mt-3 text-2xl font-bold text-[#071224]">Cargar vehículo</h1>
      <p className="mt-1 text-sm text-gray-500">Completá los datos y subí las fotos del vehículo.</p>

      <div className="mt-6 max-w-4xl">
        <VehicleForm
          initialValues={vehicleToFormValues(null)}
          submitting={submitting}
          submitLabel="Publicar vehículo"
          error={error}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
