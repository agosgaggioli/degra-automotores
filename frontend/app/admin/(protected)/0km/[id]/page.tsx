'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

import VehicleForm, {
  VehicleFormValues,
  vehicleToFormValues,
} from '../../../../../components/admin/VehicleForm';
import { fetchAdminVehicle, updateVehicle } from '../../../../../lib/api';

export default function EditZeroKmPage() {
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
        setInitialValues(vehicleToFormValues(res.data as any, 'new'));
        setImages(res.data.images);
      })
      .catch((err) => setLoadError(err.message || 'No pudimos cargar el 0km.'))
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
      Object.entries({ ...values, condition: 'new' }).forEach(([key, value]) => fd.append(key, String(value)));
      newImages.forEach((file) => fd.append('images', file));
      await updateVehicle(id, fd);
      router.push('/admin/0km');
    } catch (err: any) {
      setError(err.message || 'No pudimos guardar los cambios.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-full">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[#1f4e96]">
              <Sparkles size={13} />
              <span className="text-[9px] font-bold uppercase tracking-[0.12em]">Inventario</span>
            </div>
            <h1 className="mt-1 text-lg font-semibold tracking-tight text-[#071224]">Editar 0km</h1>
            <p className="mt-0.5 text-[11px] text-slate-500">Actualizá los datos o las fotos del modelo.</p>
          </div>

          <Link
            href="/admin/0km"
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[10px] font-semibold text-slate-500 transition hover:border-[#1f4e96]/30 hover:text-[#1f4e96]"
          >
            <ArrowLeft size={12} />
            Volver
          </Link>
        </div>

        <div className="mt-3">
          {loading ? (
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-5 text-center">
              <p className="text-[11px] text-slate-400">Cargando 0km...</p>
            </div>
          ) : loadError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700">{loadError}</div>
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
    </div>
  );
}
