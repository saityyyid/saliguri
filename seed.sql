-- Seed data for villa catalog
insert into villas (name, slug, description, price_per_night, capacity, base_capacity, max_capacity, extrabed_limit, floors, rooms, beds_description, facilities, status, sort_order)
values
  ('Villa 1', 'villa-1', 'Villa cozy 1 lantai dengan view tebing. Muat 2-5 orang dengan extra bed.', 600000, 2, 2, 5, 3, 1, 1, '1 Bed Besar (bisa +3 Extra Bed)', array['AC','TV','Water Heater','1 Toilet','WiFi','Sarapan 2'], 'active', 1),
  ('Villa 2', 'villa-2', 'Villa cozy 1 lantai dengan view tebing. Muat 2-5 orang dengan extra bed.', 600000, 2, 2, 5, 3, 1, 1, '1 Bed Besar (bisa +3 Extra Bed)', array['AC','TV','Water Heater','1 Toilet','WiFi','Sarapan 2'], 'active', 2),
  ('Villa 3', 'villa-3', 'Villa ekonomis 1 lantai dengan mezanin. Muat 2-6 orang dengan extra bed. Harga terjangkau.', 500000, 2, 2, 6, 4, 1, 1, '1 Bed Besar + Mezanin (bisa +4 Extra Bed)', array['AC','TV','Water Heater','1 Toilet','WiFi','Sarapan 2'], 'active', 3),
  ('Villa 4', 'villa-4', 'Villa ekonomis 1 lantai dengan mezanin. Muat 2-6 orang dengan extra bed. Harga terjangkau.', 500000, 2, 2, 6, 4, 1, 1, '1 Bed Besar + Mezanin (bisa +4 Extra Bed)', array['AC','TV','Water Heater','1 Toilet','WiFi','Sarapan 2'], 'active', 4),
  ('Villa 5', 'villa-5', 'Villa 2 lantai untuk keluarga. Muat 2-8 orang dengan extra bed. Lantai 2 luas untuk tambahan kasur.', 900000, 4, 2, 8, 6, 2, 2, 'L1: Bed Besar, L2: Area tambahan (bisa +6 Extra Bed)', array['AC','TV','Water Heater','1 Toilet','WiFi','Kipas','Sarapan 4'], 'active', 5),
  ('Villa 6', 'villa-6', 'Villa 2 lantai untuk keluarga. Muat 2-8 orang dengan extra bed. Lantai 2 luas untuk tambahan kasur.', 900000, 4, 2, 8, 6, 2, 2, 'L1: Bed Besar, L2: Area tambahan (bisa +6 Extra Bed)', array['AC','TV','Water Heater','1 Toilet','WiFi','Kipas','Sarapan 4'], 'active', 6),
  ('Villa 7', 'villa-7', 'Villa cozy 1 lantai dengan mezanin dan view tebing. Muat 2-7 orang dengan extra bed.', 600000, 2, 2, 7, 5, 1, 1, '1 Bed Besar + Mezanin (bisa +5 Extra Bed)', array['AC','TV','Water Heater','1 Toilet','WiFi','Sarapan 2'], 'active', 7),
  ('Villa 8', 'villa-8', 'Villa luas 2 lantai, 2 kamar mandi. Muat 4-9 orang dengan extra bed.', 1400000, 4, 4, 9, 5, 2, 2, '2 Bed Besar (L1 & L2), bisa +5 Extra Bed', array['AC','TV','Kipas','Water Heater','Toilet Dalam & Luar','WiFi','Sarapan 4'], 'active', 8),
  ('Villa 9', 'villa-9', 'Villa besar untuk grup. Dapur mini & ruang tamu. Muat 4-15 orang dengan extra bed.', 2200000, 6, 4, 15, 11, 2, 6, '2 Bed Besar + area luas (bisa +11 Extra Bed)', array['AC','Kipas','TV','Kulkas','Dispenser','WiFi','Dapur Mini','Sofa','2 KM','Sarapan 6'], 'active', 9),
  ('Villa 10', 'villa-10', 'Villa premium terbesar. Pemandangan terbaik. Muat 6-20 orang dengan extra bed.', 3300000, 6, 6, 20, 14, 2, 3, '3 Bed Besar + area luas (bisa +14 Extra Bed)', array['2 AC','TV','Kulkas','Dispenser','WiFi','Dapur Mini','Sofa','3 KM','Sarapan 6'], 'active', 10),
  ('Aula', 'aula', 'Aula acara serbaguna 8m×16m dengan sound system, panggung, dan mushola.', 0, 90, 90, 90, 0, 1, 0, '-', array['8m×16m','Meja Kursi','Panggung','Podium','Sound System','Infocus','Mushola','3 Toilet'], 'active', 11);

-- Default admin user
-- Supabase Auth user creation must be performed in the Supabase dashboard or via the admin API.
-- Example command using Supabase CLI or admin API:
-- select auth.admin.create_user(email := 'admin@saliguri.com', password := 'saliguri2024', email_confirm := true);
