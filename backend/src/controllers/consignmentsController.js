const { z } = require('zod');
const { supabase } = require('../config/supabase');
const { uploadFiles, deleteFileByUrl } = require('../utils/storage');

const BUCKET = process.env.SUPABASE_CONSIGNMENTS_BUCKET || 'consignments';

const consignmentSchema = z.object({
  firstName: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
  phone: z.string().min(1, 'El teléfono es obligatorio'),
  email: z.string().email('Ingresá un email válido'),
  city: z.string().optional().nullable(),
  brand: z.string().min(1, 'La marca es obligatoria'),
  model: z.string().min(1, 'El modelo es obligatorio'),
  version: z.string().optional().nullable(),
  year: z.coerce.number().int().optional().nullable(),
  mileage: z.coerce.number().int().optional().nullable(),
  licensePlate: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  fuel: z.string().optional().nullable(),
  transmission: z.string().optional().nullable(),
  expectedPrice: z.coerce.number().optional().nullable(),
  observations: z.string().optional().nullable(),
});

// POST /api/consignments (público, multipart con hasta 5 "images")
async function create(req, res, next) {
  try {
    const parsed = consignmentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }
    const d = parsed.data;

    const { data: consignment, error } = await supabase
      .from('consignments')
      .insert({
        first_name: d.firstName,
        last_name: d.lastName,
        phone: d.phone,
        email: d.email,
        city: d.city || null,
        brand: d.brand,
        model: d.model,
        version: d.version || null,
        year: d.year || null,
        mileage: d.mileage || null,
        license_plate: d.licensePlate || null,
        color: d.color || null,
        fuel: d.fuel || null,
        transmission: d.transmission || null,
        expected_price: d.expectedPrice || null,
        observations: d.observations || null,
      })
      .select('*')
      .single();

    if (error) throw error;

    const files = (req.files || []).slice(0, 5);
    if (files.length) {
      const urls = await uploadFiles(BUCKET, files, consignment.id);
      const rows = urls.map((url) => ({ consignment_id: consignment.id, url }));
      const { error: imgErr } = await supabase.from('consignment_images').insert(rows);
      if (imgErr) throw imgErr;
    }

    return res.status(201).json({
      data: consignment,
      message: 'Recibimos los datos de tu vehículo. Nuestro equipo se pondrá en contacto con vos.',
    });
  } catch (err) {
    next(err);
  }
}

// ============ ADMIN ============

// GET /api/admin/consignments (protegido)
async function list(req, res, next) {
  try {
    const { status = '', search = '', page = '1', pageSize = '20' } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const size = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100);
    const from = (pageNum - 1) * size;
    const to = from + size - 1;

    let query = supabase
      .from('consignments')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,brand.ilike.%${search}%,model.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    const { data: rows, error, count } = await query.range(from, to);
    if (error) throw error;

    const ids = rows.map((r) => r.id);
    let imagesByConsignment = {};
    if (ids.length) {
      const { data: images, error: imgErr } = await supabase
        .from('consignment_images')
        .select('*')
        .in('consignment_id', ids);
      if (imgErr) throw imgErr;
      imagesByConsignment = images.reduce((acc, img) => {
        acc[img.consignment_id] = acc[img.consignment_id] || [];
        acc[img.consignment_id].push(img.url);
        return acc;
      }, {});
    }

    return res.json({
      data: rows.map((r) => ({ ...r, images: imagesByConsignment[r.id] || [] })),
      pagination: { page: pageNum, pageSize: size, total: count || 0, totalPages: Math.ceil((count || 0) / size) },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/consignments/:id (protegido)
async function getOne(req, res, next) {
  try {
    const { id } = req.params;
    const { data: consignment, error } = await supabase
      .from('consignments')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    if (!consignment) return res.status(404).json({ error: 'Consignación no encontrada.' });

    const { data: images } = await supabase.from('consignment_images').select('url').eq('consignment_id', id);

    return res.json({ data: { ...consignment, images: (images || []).map((i) => i.url) } });
  } catch (err) {
    next(err);
  }
}

const updateSchema = z.object({
  status: z.enum(['pending', 'contacted', 'evaluated', 'accepted', 'rejected']).optional(),
  internal_notes: z.string().optional().nullable(),
});

// PATCH /api/admin/consignments/:id (protegido)
async function update(req, res, next) {
  try {
    const { id } = req.params;
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { data, error } = await supabase
      .from('consignments')
      .update(parsed.data)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return res.json({ data });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/consignments/:id (protegido)
async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const { data: images } = await supabase.from('consignment_images').select('url').eq('consignment_id', id);

    const { error } = await supabase.from('consignments').delete().eq('id', id);
    if (error) throw error;

    if (images && images.length) {
      await Promise.all(images.map((img) => deleteFileByUrl(BUCKET, img.url)));
    }

    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, getOne, update, remove };
