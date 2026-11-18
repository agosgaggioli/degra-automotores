'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface Props {
  title: string;
  text?: string;
  className?: string;
}

/**
 * Botón "Compartir":
 * - En el celular abre el menú nativo de compartir (WhatsApp, Instagram, etc.).
 * - Si el navegador no lo soporta (compu), copia el link al portapapeles.
 * Comparte siempre la URL actual, o sea, el link de esa unidad.
 */
export default function ShareButton({ title, text, className = '' }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyToClipboard(url: string) {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Respaldo para navegadores viejos
      const input = document.createElement('textarea');
      input.value = url;
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err: any) {
        // Si la persona cerró el menú, no hacemos nada
        if (err?.name === 'AbortError') return;
      }
    }

    await copyToClipboard(url);
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-live="polite"
      className={`flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/15 text-xs font-semibold text-white transition hover:border-[#3169b7] hover:bg-[#1f4e96]/20 ${className}`}
    >
      {copied ? <Check size={15} className="text-green-400" /> : <Share2 size={15} />}
      {copied ? '¡Link copiado!' : 'Compartir'}
    </button>
  );
}
