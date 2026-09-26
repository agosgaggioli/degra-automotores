const { z } = require('zod');
const slugify = require('slugify');
const { supabase } = require('../config/supabase');
const { uploadFiles, deleteFileByUrl } = require('../utils/storage');

const BUCKET = process.env.SUPABASE_VEHICLES_BUCKET || 'vehicles';

const vehicleSchema = z.object({
  brand: z.string().min(1, 'La marca es obligatoria'),
  model: z.string().min(1, 'El modelo es obligatorio'),
  version: z.string().optional().nullable(),
  year: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1),
  mileage: z.coerce.number().int().min(0).default(0),
  price: z.coerce.number().min(0),
  currency: z.string().default('ARS'),
  transmission: z.string().optional().nullable(),
  fuel: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  license_plate: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  status: z.enum(['published', 'draft', 'sold']).default('published'),
    featured: z
    .union([z.boolean(), z.string()])
    .transform((v) => v === true || v === 'true')
    .default(false),
});

async function buildUniqueSlug(brand, model, version, year, excludeId = null) {
  const base = slugify(`${brand}-${model}-${version || ''}-${year}`, { lower: true, strict: true });
  let slug = base;
  let counter = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let query = supabase.from('vehicles').select('id').eq('slug', slug);
    if (excludeId) query = query.neq('id', excludeId);
    const { data, error } = await query.maybeSingle();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return slug;
    counter += 1;
    slug = `${base}-${counter}`;
  }
}

function attachImages(vehicle, imagesByVehicle) {
  return {
    ...vehicle,
    images: (imagesByVehicle[vehicle.id] || []).map((img) => img.url),
  };
}

// GET /api/vehicles (público) - filtros: brand, transmission, fuel, yearMin, yearMax, search, page, pageSize
async function listPublic(req, res, next) {
  try {
    const {
      search = '',
      brand = '',
      transmission = '',
      fuel = '',
      yearMin,
      yearMax,
      featured,
      page = '1',
      pageSize = '12',
    } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const size = Math.min(Math.max(parseInt(pageSize, 10) || 12, 1), 50);
    const from = (pageNum - 1) * size;
    const to = from + size - 1;

    let query = supabase
      .from('vehicles')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (brand) query = query.eq('brand', brand);
    if (transmission) query = query.eq('transmission', transmission);
    if (fuel) query = query.eq('fuel', fuel);
    if (yearMin) query = query.gte('year', Number(yearMin));
    if (yearMax) query = query.lte('year', Number(yearMax));
    if (featured === 'true') query = query.eq('featured', true);
    if (search) {
      query = query.or(
        `brand.ilike.%${search}%,model.ilike.%${search}%,version.ilike.%${search}%,color.ilike.%${search}%`
      );
    }

    const { data: vehicles, error, count } = await query.range(from, to);
    if (error) throw error;

    const ids = vehicles.map((v) => v.id);
    let imagesByVehicle = {};
    if (ids.length) {
      const { data: images, error: imgErr } = await supabase
        .from('vehicle_images')
        .select('*')
        .in('vehicle_id', ids)
        .order('position', { ascending: true });
      if (imgErr) throw imgErr;
      imagesByVehicle = images.reduce((acc, img) => {
        acc[img.vehicle_id] = acc[img.vehicle_id] || [];
        acc[img.vehicle_id].push(img);
        return acc;
      }, {});
    }

    return res.json({
      data: vehicles.map((v) => attachImages(v, imagesByVehicle)),
      pagination: {
        page: pageNum,
        pageSize: size,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / size),
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/vehicles/filters (público) - valores disponibles para los selects del catálogo
async function getFilters(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('brand, transmission, fuel')
      .eq('status', 'published');
    if (error) throw error;

    const uniq = (arr) => Array.from(new Set(arr.filter(Boolean))).sort();

    return res.json({
      brands: uniq(data.map((v) => v.brand)),
      transmissions: uniq(data.map((v) => v.transmission)),
      fuels: uniq(data.map((v) => v.fuel)),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/vehicles/:slug (público)
async function getBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) throw error;
    if (!vehicle) return res.status(404).json({ error: 'Vehículo no encontrado.' });

    const { data: images, error: imgErr } = await supabase
      .from('vehicle_images')
      .select('*')
      .eq('vehicle_id', vehicle.id)
      .order('position', { ascending: true });
    if (imgErr) throw imgErr;

    return res.json({ data: { ...vehicle, images: images.map((i) => i.url) } });
  } catch (err) {
    next(err);
  }
}

// ================= ADMIN =================

// GET /api/admin/vehicles (protegido) - incluye drafts y vendidos
async function listAdmin(req, res, next) {
  try {
    const { status = '', search = '', page = '1', pageSize = '20' } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const size = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100);
    const from = (pageNum - 1) * size;
    const to = from + size - 1;

    let query = supabase
      .from('vehicles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (search) {
      query = query.or(`brand.ilike.%${search}%,model.ilike.%${search}%,version.ilike.%${search}%`);
    }

    const { data: vehicles, error, count } = await query.range(from, to);
    if (error) throw error;

    const ids = vehicles.map((v) => v.id);
    let imagesByVehicle = {};
    if (ids.length) {
      const { data: images, error: imgErr } = await supabase
        .from('vehicle_images')
        .select('*')
        .in('vehicle_id', ids)
        .order('position', { ascending: true });
      if (imgErr) throw imgErr;
      imagesByVehicle = images.reduce((acc, img) => {
        acc[img.vehicle_id] = acc[img.vehicle_id] || [];
        acc[img.vehicle_id].push(img);
        return acc;
      }, {});
    }

    return res.json({
      data: vehicles.map((v) => attachImages(v, imagesByVehicle)),
      pagination: { page: pageNum, pageSize: size, total: count || 0, totalPages: Math.ceil((count || 0) / size) },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/vehicles/:id (protegido)
async function getOneAdmin(req, res, next) {
  try {
    const { id } = req.params;
    const { data: vehicle, error } = await supabase.from('vehicles').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!vehicle) return res.status(404).json({ error: 'Vehículo no encontrado.' });

    const { data: images, error: imgErr } = await supabase
      .from('vehicle_images')
      .select('*')
      .eq('vehicle_id', id)
      .order('position', { ascending: true });
    if (imgErr) throw imgErr;

    return res.json({ data: { ...vehicle, images: images.map((i) => ({ id: i.id, url: i.url })) } });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/vehicles (protegido, multipart con "images")
async function create(req, res, next) {
  try {
    const parsed = vehicleSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }
    const payload = parsed.data;

    const slug = await buildUniqueSlug(payload.brand, payload.model, payload.version, payload.year);

    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .insert({ ...payload, slug })
      .select('*')
      .single();

    if (error) throw error;

    const files = req.files || [];
    if (files.length) {
      const urls = await uploadFiles(BUCKET, files, vehicle.id);
      const rows = urls.map((url, i) => ({ vehicle_id: vehicle.id, url, position: i }));
      const { error: imgErr } = await supabase.from('vehicle_images').insert(rows);
      if (imgErr) throw imgErr;
    }

    return res.status(201).json({ data: vehicle });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/vehicles/:id (protegido, multipart opcional con "images" para agregar más fotos)
async function update(req, res, next) {
  try {
    const { id } = req.params;
    const parsed = vehicleSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }
    const payload = parsed.data;

    const { data: existing, error: findErr } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (findErr) throw findErr;
    if (!existing) return res.status(404).json({ error: 'Vehículo no encontrado.' });

    let slug = existing.slug;
    const brandChanged = payload.brand && payload.brand !== existing.brand;
    const modelChanged = payload.model && payload.model !== existing.model;
    const yearChanged = payload.year && Number(payload.year) !== existing.year;
    if (brandChanged || modelChanged || yearChanged) {
      slug = await buildUniqueSlug(
        payload.brand || existing.brand,
        payload.model || existing.model,
        payload.version ?? existing.version,
        payload.year || existing.year,
        id
      );
    }

    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .update({ ...payload, slug })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    const files = req.files || [];
    if (files.length) {
      const { count } = await supabase
        .from('vehicle_images')
        .select('id', { count: 'exact', head: true })
        .eq('vehicle_id', id);

      const urls = await uploadFiles(BUCKET, files, id);
      const rows = urls.map((url, i) => ({ vehicle_id: id, url, position: (count || 0) + i }));
      const { error: imgErr } = await supabase.from('vehicle_images').insert(rows);
      if (imgErr) throw imgErr;
    }

    return res.json({ data: vehicle });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/vehicles/:id (protegido)
async function remove(req, res, next) {
  try {
    const { id } = req.params;

    const { data: images } = await supabase.from('vehicle_images').select('url').eq('vehicle_id', id);

    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (error) throw error;

    if (images && images.length) {
      await Promise.all(images.map((img) => deleteFileByUrl(BUCKET, img.url)));
    }

    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/vehicles/:id/images/:imageId (protegido)
async function removeImage(req, res, next) {
  try {
    const { imageId } = req.params;

    const { data: image, error: findErr } = await supabase
      .from('vehicle_images')
      .select('*')
      .eq('id', imageId)
      .maybeSingle();
    if (findErr) throw findErr;
    if (!image) return res.status(404).json({ error: 'Imagen no encontrada.' });

    const { error } = await supabase.from('vehicle_images').delete().eq('id', imageId);
    if (error) throw error;

    await deleteFileByUrl(BUCKET, image.url);

    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listPublic,
  getFilters,
  getBySlug,
  listAdmin,
  getOneAdmin,
  create,
  update,
  remove,
  removeImage,
};