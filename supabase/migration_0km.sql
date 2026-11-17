-- =========================================================
-- MÓDULO 0KM
-- Agrega la columna "condition" a vehicles:
--   'used' = usado (se muestra en /vehiculos)
--   'new'  = 0km   (se muestra en /0km)
-- Todos los vehículos existentes quedan como 'used'.
-- Ejecutar en Supabase > SQL Editor > New query
-- =========================================================
alter table vehicles
  add column if not exists condition text not null default 'used';

alter table vehicles drop constraint if exists vehicles_condition_check;
alter table vehicles
  add constraint vehicles_condition_check check (condition in ('used', 'new'));

create index if not exists idx_vehicles_condition on vehicles (condition);
