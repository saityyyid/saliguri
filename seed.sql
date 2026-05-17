-- Seed data for villa catalog
insert into villas (name, slug, description, price_per_night, capacity, floors, rooms, beds_description, facilities, status, sort_order)
values
  ('Villa 1', 'villa-1', 'Villa sederhana untuk 2 orang dengan AC, TV, dan sarapan.', 600000, 2, 1, 1, '1 Bed Besar', array['AC','TV','Water Heater','1 Toilet','WiFi','Sarapan 2'], 'active', 1),
  ('Villa 2', 'villa-2', 'Villa nyaman untuk 2 orang dengan fasilitas lengkap dan sarapan.', 600000, 2, 1, 1, '1 Bed Besar', array['AC','TV','Water Heater','1 Toilet','WiFi','Sarapan 2'], 'active', 2),
  ('Villa 3', 'villa-3', 'Villa cozy 2 orang dengan AC, TV, dan WiFi.', 500000, 2, 1, 1, '1 Bed Besar', array['AC','TV','Water Heater','1 Toilet','WiFi','Sarapan 2'], 'active', 3),
  ('Villa 4', 'villa-4', 'Villa kecil untuk 2 orang dengan semua fasilitas dasar.', 500000, 2, 1, 1, '1 Bed Besar', array['AC','TV','Water Heater','1 Toilet','WiFi','Sarapan 2'], 'active', 4),
  ('Villa 5', 'villa-5', 'Villa 2 lantai untuk keluarga dengan 4 sarapan.', 900000, 4, 2, 2, 'L1: Bed 180x200cm, L2: Single', array['AC','TV','Water Heater','1 Toilet','WiFi','Kipas','Sarapan 4'], 'active', 5),
  ('Villa 6', 'villa-6', 'Villa dua lantai dengan fasilitas lengkap dan pemandangan taman.', 900000, 4, 2, 2, 'L1: Bed 180x200cm, L2: Single', array['AC','TV','Water Heater','1 Toilet','WiFi','Kipas','Sarapan 4'], 'active', 6),
  ('Villa 7', 'villa-7', 'Villa private untuk pasangan dengan sarapan 2 orang.', 600000, 2, 1, 1, '1 Bed Besar', array['AC','TV','Water Heater','1 Toilet','WiFi','Sarapan 2'], 'active', 7),
  ('Villa 8', 'villa-8', 'Villa 2 lantai dengan 2 bed besar dan sarapan 4 orang.', 1400000, 4, 2, 2, 'L1: Bed Besar, L2: Bed Besar', array['AC','TV','Kipas','Water Heater','Toilet Dalam & Luar','WiFi','Sarapan 4'], 'active', 8),
  ('Villa 9', 'villa-9', 'Villa besar untuk 6 orang dengan dapur mini dan sarapan 6 orang.', 2200000, 6, 2, 6, 'L1: Bed Besar, L2: 4 Bed Besar + 2 Single', array['AC','Kipas','TV','Kulkas','Dispenser','WiFi','Dapur Mini','Sofa','2 KM','Sarapan 6'], 'active', 9),
  ('Villa 10', 'villa-10', 'Villa mewah dengan 3 kamar tidur, 3 kamar mandi, dan sarapan 6 orang.', 3300000, 6, 2, 3, 'L1: Bed Besar, L2: 1 Bed Besar + 2 Single', array['2 AC','TV','Kulkas','Dispenser','WiFi','Dapur Mini','Sofa','3 KM','Sarapan 6'], 'active', 10),
  ('Aula', 'aula', 'Aula acara serbaguna 8m×16m dengan sound system, panggung, dan mushola.', 0, 90, 1, 0, '-', array['8m×16m','Meja Kursi','Panggung','Podium','Sound System','Infocus','Mushola','3 Toilet'], 'active', 11);

-- Default admin user
-- Supabase Auth user creation must be performed in the Supabase dashboard or via the admin API.
-- Example command using Supabase CLI or admin API:
-- select auth.admin.create_user(email := 'admin@saliguri.com', password := 'saliguri2024', email_confirm := true);
