-- =========================================================
-- DEGRA AUTOMOTORES - Datos de ejemplo (opcional)
-- Ejecutar después de schema.sql si querés tener stock de
-- prueba para ver el sitio funcionando.
-- =========================================================

insert into vehicles (slug, brand, model, version, year, mileage, price, currency, transmission, fuel, color, status, featured)
values
  ('toyota-hilux-srx-2023', 'Toyota', 'Hilux', 'SRX', 2023, 35000, 6500000, 'ARS', 'Manual', 'Diésel', 'Gris', 'published', true),
  ('ford-ranger-xlt-2022', 'Ford', 'Ranger', 'XLT', 2022, 18000, 5900000, 'ARS', 'Automática', 'Nafta', 'Blanco', 'published', true),
  ('volkswagen-amarok-trendline-2021', 'Volkswagen', 'Amarok', 'Trendline', 2021, 40000, 5300000, 'ARS', 'Manual', 'Diésel', 'Negro', 'published', false),
  ('chevrolet-s10-ltz-2020', 'Chevrolet', 'S10', 'LTZ', 2020, 65000, 4700000, 'ARS', 'Automática', 'Diésel', 'Gris', 'published', false),
  ('toyota-corolla-xei-2022', 'Toyota', 'Corolla', 'XEI', 2022, 28000, 3900000, 'ARS', 'Automática', 'Nafta', 'Blanco', 'published', true),
  ('volkswagen-vento-highline-2019', 'Volkswagen', 'Vento', 'Highline', 2019, 79000, 3500000, 'ARS', 'Automática', 'Nafta', 'Negro', 'published', false)
on conflict (slug) do nothing;

insert into vehicle_images (vehicle_id, url, position)
select id, '/images/vehicles/onix.jpeg', 0 from vehicles
on conflict do nothing;
