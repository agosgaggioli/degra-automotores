'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import FinancingForm, {
  FinancingFormValues,
  financingToFormValues,
} from '../../../../../components/admin/FinancingForm';
import { createFinancing } from '../../../../../lib/api';

export default function NewFinancingPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(values: FinancingFormValues, logoFile: File | null) {
    setSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([key, value]) => fd.append(key, String(value)));
      if (logoFile) fd.append('logo', logoFile);

      await createFinancing(fd);
      router.push('/admin/financiaciones');
    } catch (err: any) {
      setError(err.message || 'No pudimos crear la financiación.');
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

      <h1 className="mt-3 text-2xl font-bold text-[#071224]">Cargar financiación</h1>
      <p className="mt-1 text-sm text-gray-500">Se va a mostrar en la página pública de Financiación.</p>

      <div className="mt-6 max-w-3xl">
        <FinancingForm
          initialValues={financingToFormValues(null)}
          submitting={submitting}
          submitLabel="Publicar financiación"
          error={error}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}