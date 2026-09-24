'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import FinancingForm, {
  FinancingFormValues,
  financingToFormValues,
} from '../../../../../components/admin/FinancingForm';
import { fetchAdminFinancing, updateFinancing } from '../../../../../lib/api';

export default function EditFinancingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id as string;

  const [initialValues, setInitialValues] = useState<FinancingFormValues | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchAdminFinancing(id)
      .then((res) => {
        setInitialValues(financingToFormValues(res.data));
        setLogo(res.data.logo);
      })
      .catch((err) => setLoadError(err.message || 'No pudimos cargar la financiación.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(values: FinancingFormValues, logoFile: File | null) {
    setSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([key, value]) => fd.append(key, String(value)));
      if (logoFile) fd.append('logo', logoFile);

      await updateFinancing(id, fd);
      router.push('/admin/financiaciones');
    } catch (err: any) {
      setError(err.message || 'No pudimos guardar los cambios.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Link
        href="/admin/financiaciones"
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#1f4e96]"
      >
        <ArrowLeft size={16} />
        Volver a financiaciones
      </Link>

      <h1 className="mt-3 text-2xl font-bold text-[#071224]">Editar financiación</h1>

      <div className="mt-6 max-w-3xl">
        {loading ? (
          <p className="text-sm text-gray-500">Cargando...</p>
        ) : loadError ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{loadError}</p>
        ) : (
          initialValues && (
            <FinancingForm
              initialValues={initialValues}
              existingLogo={logo}
              submitting={submitting}
              submitLabel="Guardar cambios"
              error={error}
              onSubmit={handleSubmit}
            />
          )
        )}
      </div>
    </div>
  );
}