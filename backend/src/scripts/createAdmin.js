/**
 * Crea (o actualiza la contraseña de) el primer usuario admin del backoffice.
 *
 * Uso:
 *   npm run create-admin
 *
 * Toma los datos de las variables de entorno ADMIN_NAME, ADMIN_EMAIL y
 * ADMIN_PASSWORD (definidas en backend/.env), o se pueden pasar por línea
 * de comando:
 *
 *   node src/scripts/createAdmin.js "Juan Pérez" juan@degraautomotores.com MiClaveSegura123
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { supabase } = require('../config/supabase');

async function main() {
  const [, , argName, argEmail, argPassword] = process.argv;

  const name = argName || process.env.ADMIN_NAME || 'Administrador';
  const email = (argEmail || process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const password = argPassword || process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Faltan ADMIN_EMAIL / ADMIN_PASSWORD (en .env o por argumento).');
    process.exit(1);
  }

  const password_hash = await bcrypt.hash(password, 10);

  const { data: existing } = await supabase.from('admins').select('id').eq('email', email).maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('admins')
      .update({ name, password_hash, active: true })
      .eq('id', existing.id);
    if (error) throw error;
    console.log(`✅ Usuario admin actualizado: ${email}`);
  } else {
    const { error } = await supabase
      .from('admins')
      .insert({ name, email, password_hash, role: 'admin', active: true });
    if (error) throw error;
    console.log(`✅ Usuario admin creado: ${email}`);
  }

  console.log('   Ya podés iniciar sesión en /admin/login con ese email y contraseña.');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error creando el admin:', err.message);
  process.exit(1);
});
