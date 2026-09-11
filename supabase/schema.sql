-- =========================================================
-- DEGRA AUTOMOTORES - Esquema de base de datos (Supabase/Postgres)
-- =========================================================
-- Ejecutar este archivo completo en: Supabase Dashboard > SQL Editor > New query
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- ADMINS (usuarios del backoffice)
-- ---------------------------------------------------------
create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  role text not null default 'admin', -- admin | vendedor
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- VEHICLES (vehículos publicados / stock)
-- ---------------------------------------------------------
create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  brand text not null,
  model text not null,
  version text,
  year int not null,
  mileage int not null default 0,
  price numeric(14,2) not null default 0,
  currency text not null default 'ARS',
  transmission text,
  fuel text,
  color text,
  license_plate text,
  description text,
  status text not null default 'published', -- published | draft | sold
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_vehicles_status on vehicles (status);
create index if not exists idx_vehicles_brand on vehicles (brand);
create index if not exists idx_vehicles_featured on vehicles (featured);

-- ---------------------------------------------------------
-- VEHICLE IMAGES
-- ---------------------------------------------------------
create table if not exists vehicle_images (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  url text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_vehicle_images_vehicle_id on vehicle_images (vehicle_id);

-- ---------------------------------------------------------
-- CONSIGNMENTS (consignaciones enviadas desde el formulario público)
-- ---------------------------------------------------------
create table if not exists consignments (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text not null,
  city text,
  brand text not null,
  model text not null,
  version text,
  year int,
  mileage int,
  license_plate text,
  color text,
  fuel text,
  transmission text,
  expected_price numeric(14,2),
  observations text,
  status text not null default 'pending', -- pending | contacted | evaluated | accepted | rejected
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_consignments_status on consignments (status);

create table if not exists consignment_images (
  id uuid primary key default gen_random_uuid(),
  consignment_id uuid not null references consignments(id) on delete cascade,
  url text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_consignment_images_consignment_id on consignment_images (consignment_id);

-- ---------------------------------------------------------
-- CONTACT MESSAGES (consultas del formulario de contacto)
-- ---------------------------------------------------------
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'new', -- new | read | answered
  vehicle_id uuid references vehicles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_contact_messages_status on contact_messages (status);

-- ---------------------------------------------------------
-- TRIGGER genérico para updated_at
-- ---------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_admins_updated_at on admins;
create trigger trg_admins_updated_at before update on admins
  for each row execute procedure set_updated_at();

drop trigger if exists trg_vehicles_updated_at on vehicles;
create trigger trg_vehicles_updated_at before update on vehicles
  for each row execute procedure set_updated_at();

drop trigger if exists trg_consignments_updated_at on consignments;
create trigger trg_consignments_updated_at before update on consignments
  for each row execute procedure set_updated_at();

drop trigger if exists trg_contact_messages_updated_at on contact_messages;
create trigger trg_contact_messages_updated_at before update on contact_messages
  for each row execute procedure set_updated_at();

-- ---------------------------------------------------------
-- ROW LEVEL SECURITY
-- Todo el acceso (público y admin) pasa por el backend Node,
-- que usa la Service Role Key (bypassea RLS). Por eso dejamos
-- RLS activado pero sin policies para el rol "anon": nadie puede
-- leer/escribir estas tablas directo desde el navegador.
-- ---------------------------------------------------------
alter table admins enable row level security;
alter table vehicles enable row level security;
alter table vehicle_images enable row level security;
alter table consignments enable row level security;
alter table consignment_images enable row level security;
alter table contact_messages enable row level security;

-- (Opcional) Si en el futuro querés leer vehículos publicados
-- directo desde el frontend con la anon key, podés descomentar:
--
-- create policy "public_read_published_vehicles" on vehicles
--   for select using (status = 'published');
--
-- create policy "public_read_vehicle_images" on vehicle_images
--   for select using (
--     exists (select 1 from vehicles v where v.id = vehicle_id and v.status = 'published')
--   );

-- ---------------------------------------------------------
-- STORAGE BUCKETS
-- Crear manualmente en Supabase Dashboard > Storage (o correr esto
-- si tu proyecto tiene la extensión de storage habilitada por SQL):
-- Bucket "vehicles" (público) y "consignments" (público, solo lectura).
-- El backend sube los archivos con la service role key.
-- ---------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('vehicles', 'vehicles', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('consignments', 'consignments', true)
on conflict (id) do nothing;
