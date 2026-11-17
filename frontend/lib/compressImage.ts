/**
 * Achica y comprime una imagen en el navegador antes de subirla.
 * Una foto de celular de 4-6 MB queda en unos 150-400 KB, sin perder calidad visible.
 *
 * - Lado más largo: como máximo `maxSize` px (por defecto 1600).
 * - Formato WebP con calidad `quality` (por defecto 0.8).
 * - Si algo falla o el resultado pesa más que el original, devuelve el original.
 */
export async function compressImage(file: File, maxSize = 1600, quality = 0.8): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, '') + '.webp';
    return new File([blob], name, { type: 'image/webp', lastModified: Date.now() });
  } catch {
    return file;
  }
}

export async function compressImages(files: File[], maxSize?: number, quality?: number): Promise<File[]> {
  const result: File[] = [];
  for (const file of files) {
    // eslint-disable-next-line no-await-in-loop
    result.push(await compressImage(file, maxSize, quality));
  }
  return result;
}
