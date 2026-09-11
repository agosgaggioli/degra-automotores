const { v4: uuidv4 } = require('uuid');
const { supabase } = require('../config/supabase');

/**
 * Sube un archivo (buffer de multer) a un bucket de Supabase Storage
 * y devuelve la URL pública.
 */
async function uploadFile(bucket, file, folder = '') {
  const ext = (file.originalname.split('.').pop() || 'jpg').toLowerCase();
  const path = `${folder ? `${folder}/` : ''}${uuidv4()}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    const err = new Error(`Error subiendo imagen a Supabase Storage: ${error.message}`);
    err.status = 500;
    throw err;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

async function uploadFiles(bucket, files = [], folder = '') {
  const urls = [];
  for (const file of files) {
    // eslint-disable-next-line no-await-in-loop
    const url = await uploadFile(bucket, file, folder);
    urls.push(url);
  }
  return urls;
}

async function deleteFileByUrl(bucket, publicUrl) {
  try {
    const marker = `/object/public/${bucket}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return;
    const path = publicUrl.substring(idx + marker.length);
    await supabase.storage.from(bucket).remove([path]);
  } catch (err) {
    console.warn('No se pudo borrar el archivo de storage:', err.message);
  }
}

module.exports = { uploadFile, uploadFiles, deleteFileByUrl };
