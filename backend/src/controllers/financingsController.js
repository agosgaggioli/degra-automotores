const { z } = require('zod');
const { supabase } = require('../config/supabase');
const { uploadFile, deleteFileByUrl } = require('../utils/storage');

const BUCKET = process.env.SUPABASE_FINANCING_BUCKET || 'financing-logos';

const financingSchema = z.object({
  type: z.enum(['general', 'brand']).default('general'),
  bank: z.string().min(1, 'El banco es obligatorio'),
  name: z.string().min(1, 'El nombre del plan es obligatorio'),
  cuotas: z.coerce.number().int().min(1, 'Las cuotas son obligatorias'),
  tasa: z.string().optional().nullable(),
  anticipo: z.string().optional().nullable(),
  beneficio: z.string().optional().nullable(),
  url: z.string().min(1).default('/contacto'),
  brand: z.string().optional().nullable(),
  status: z.enum(['published', 'draft']).default('published'),
});

// GET /api/financings (público) — solo publicadas
async function listPublic(req, res, next) {
  try {
    const { type = '', bank = '', brand = '' } = req.query;

    let query = supabase
      .from('financings')
      .select('*')
      .eq('status', 'published')
      .order('type', { ascending: true })
      .order('created_at', { ascending: false });

    if (type) query = query.eq('type', type);
    if (bank) query = query.eq('bank', bank);
    if (brand) query = query.eq('brand', brand);

    const { data, error } = await query;
    if (error) throw error;

    return res.json({ data });
  } catch (err) {
    next(err);
  }
}

// ============ ADMIN ============

// GET /api/admin/financings (protegido) — incluye borradores
async function listAdmin(req, res, next) {
  try {
    const { status = '', search = '' } = req.query;

    let query = supabase.from('financings').select('*').order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (search) {
      query = query.or(`name.ilike.%${search}%,bank.ilike.%${search}%,brand.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return res.json({ data });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/financings/:id (protegido)
async function getOneAdmin(req, res, next) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('financings').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Financiación no encontrada.' });
    return res.json({ data });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/financings (protegido, multipart opcional con "logo")
async function create(req, res, next) {
  try {
    const parsed = financingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }
    const payload = parsed.data;

    if (payload.type === 'brand' && !payload.brand) {
      return res.status(400).json({ error: 'Indicá la marca para una financiación por marca.' });
    }

    let logo = null;
    if (req.file) {
      logo = await uploadFile(BUCKET, req.file, 'logos');
    }

    const { data, error } = await supabase
      .from('financings')
      .insert({ ...payload, logo })
      .select('*')
      .single();

    if (error) throw error;
    return res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/financings/:id (protegido, multipart opcional con "logo")
async function update(req, res, next) {
  try {
    const { id } = req.params;
    const parsed = financingSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }
    const payload = parsed.data;

    const { data: existing, error: findErr } = await supabase
      .from('financings')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (findErr) throw findErr;
    if (!existing) return res.status(404).json({ error: 'Financiación no encontrada.' });

    let logo = existing.logo;
    if (req.file) {
      logo = await uploadFile(BUCKET, req.file, 'logos');
      if (existing.logo) await deleteFileByUrl(BUCKET, existing.logo);
    }

    const { data, error } = await supabase
      .from('financings')
      .update({ ...payload, logo })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return res.json({ data });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/financings/:id (protegido)
async function remove(req, res, next) {
  try {
    const { id } = req.params;

    const { data: existing } = await supabase.from('financings').select('logo').eq('id', id).maybeSingle();

    const { error } = await supabase.from('financings').delete().eq('id', id);
    if (error) throw error;

    if (existing?.logo) await deleteFileByUrl(BUCKET, existing.logo);

    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { listPublic, listAdmin, getOneAdmin, create, update, remove };