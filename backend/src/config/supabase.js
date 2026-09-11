const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // No tiramos el proceso para que el server pueda levantar igual y mostrar
  // un error claro en cada request, pero avisamos fuerte en consola.
  console.error(
    '\n[CONFIG] Faltan SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY en el .env del backend.\n' +
    'Copiá backend/.env.example a backend/.env y completá los valores de tu proyecto Supabase.\n'
  );
}

const supabase = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_ROLE_KEY || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

module.exports = { supabase };
