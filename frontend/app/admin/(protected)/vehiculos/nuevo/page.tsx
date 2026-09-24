'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import Link from 'next/link';

import {
  ArrowLeft,
  CarFront,
} from 'lucide-react';

import VehicleForm, {
  VehicleFormValues,
  vehicleToFormValues,
} from '../../../../../components/admin/VehicleForm';

import {
  createVehicle,
} from '../../../../../lib/api';

/* =========================================
   COMPONENTE
========================================= */

export default function NewVehiclePage() {
  const router = useRouter();

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState('');

  /* =========================================
     SUBMIT
  ========================================= */

  async function handleSubmit(
    values: VehicleFormValues,
    newImages: File[],
  ) {
    setSubmitting(true);

    setError('');

    try {
      const fd = new FormData();

      Object.entries(values).forEach(
        ([key, value]) =>
          fd.append(
            key,
            String(value),
          ),
      );

      newImages.forEach((file) =>
        fd.append(
          'images',
          file,
        ),
      );

      const { data } =
        await createVehicle(fd);

      router.push(
        `/admin/vehiculos/${data.id}`,
      );
    } catch (err: any) {
      setError(
        err.message ||
          'No pudimos crear el vehículo.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="min-h-full">

      <div className="w-full max-w-5xl">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="flex items-center justify-between gap-4">

          <div>

            <div className="flex items-center gap-1.5 text-[#1f4e96]">

              <CarFront size={13} />

              <span className="text-[9px] font-bold uppercase tracking-[0.12em]">
                Inventario
              </span>

            </div>

            <h1 className="mt-1 text-lg font-semibold tracking-tight text-[#071224]">
              Cargar vehículo
            </h1>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Completá los datos y subí las fotos del vehículo.
            </p>

          </div>

          {/* VOLVER */}

          <Link
            href="/admin/vehiculos"
            className="
              inline-flex
              h-8
              shrink-0
              items-center
              gap-1.5
              rounded-lg
              border
              border-slate-200
              bg-white
              px-2.5
              text-[10px]
              font-semibold
              text-slate-500
              transition
              hover:border-[#1f4e96]/30
              hover:bg-slate-50
              hover:text-[#1f4e96]
            "
          >
            <ArrowLeft size={12} />

            Volver
          </Link>

        </div>

        {/* =====================================
            FORMULARIO
        ===================================== */}

        <div className="mt-3">

          <VehicleForm
            initialValues={vehicleToFormValues(null)}
            submitting={submitting}
            submitLabel="Publicar vehículo"
            error={error}
            onSubmit={handleSubmit}
          />

        </div>

      </div>

    </div>
  );
}