const { z } = require('zod');
const { supabase } = require('../config/supabase');

const contactSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  phone: z.string().min(1, 'El teléfono es obligatorio'),
  email: z.string().email('Ingresá un email válido'),
  subject: z.string().optional().nullable(),
  message: z.string().min(1, 'Escribinos tu consulta'),
  vehicleId: z.string().uuid().optional().nullable(),
});

// POST /api/contact (público)
async function create(req, res, next) {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }
    const d = parsed.data;

    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name: d.name,
        phone: d.phone,
        email: d.email,
        subject: d.subject || null,
        message: d.message,
        vehicle_id: d.vehicleId || null,
      })
      .select('*')
      .single();

    if (error) throw error;

    return res.status(201).json({
      data,
      message: 'Recibimos tu mensaje. Nuestro equipo se va a comunicar con vos a la brevedad.',
    });
  } catch (err) {
    next(err);
  }
}

// ============ ADMIN ============

// GET /api/admin/contact (protegido)
async function list(req, res, next) {
  try {
    const { status = '', search = '', page = '1', pageSize = '20' } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const size = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100);
    const from = (pageNum - 1) * size;
    const to = from + size - 1;

    let query = supabase
      .from('contact_messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,message.ilike.%${search}%`);
    }

    const { data, error, count } = await query.range(from, to);
    if (error) throw error;

    return res.json({
      data,
      pagination: { page: pageNum, pageSize: size, total: count || 0, totalPages: Math.ceil((count || 0) / size) },
    });
  } catch (err) {
    next(err);
  }
}

const updateSchema = z.object({
  status: z.enum(['new', 'read', 'answered']).optional(),
});

// PATCH /api/admin/contact/:id (protegido)
async function update(req, res, next) {
  try {
    const { id } = req.params;
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { data, error } = await supabase
      .from('contact_messages')
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

// DELETE /api/admin/contact/:id (protegido)
async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) throw error;
    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, update, remove };
