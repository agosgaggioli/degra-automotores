const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { supabase } = require('../config/supabase');

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

function signToken(admin) {
  return jwt.sign(
    { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

async function login(req, res, next) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }
    const { email, password } = parsed.data;

    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('active', true)
      .maybeSingle();

    if (error) throw error;

    if (!admin) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos.' });
    }

    const validPassword = await bcrypt.compare(password, admin.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos.' });
    }

    const token = signToken(admin);

    return res.json({
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const { data: admin, error } = await supabase
      .from('admins')
      .select('id, name, email, role, active, created_at')
      .eq('id', req.user.id)
      .maybeSingle();

    if (error) throw error;
    if (!admin) return res.status(404).json({ error: 'Usuario no encontrado.' });

    return res.json({ user: admin });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, me };
