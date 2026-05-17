-- Enable necessary extension for UUID generation
create extension if not exists pgcrypto;

-- Villas table
create table if not exists villas (
  id serial primary key,
  name text not null,
  slug text unique not null,
  description text,
  price_per_night integer not null default 0,
  capacity integer not null default 2,
  floors integer default 1,
  rooms integer default 1,
  beds_description text,
  facilities text[] default '{}',
  images text[] default '{}',
  status text default 'active' check (status in ('active','maintenance','inactive')),
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Bookings table
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text unique not null,
  villa_id integer references villas(id),
  guest_name text not null,
  guest_phone text not null,
  guest_email text,
  check_in date not null,
  check_out date not null,
  nights integer not null,
  guest_count integer not null default 1,
  villa_price integer not null,
  addon_total integer default 0,
  grand_total integer not null,
  dp_amount integer not null,
  status text default 'pending' check (status in ('pending','confirmed','checked_in','checked_out','cancelled')),
  payment_proof_url text,
  payment_status text default 'unpaid' check (payment_status in ('unpaid','dp_paid','paid')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Booking addons
create table if not exists booking_addons (
  id serial primary key,
  booking_id uuid references bookings(id) on delete cascade,
  addon_name text not null,
  quantity integer not null default 1,
  price_per_unit integer not null,
  total_price integer not null
);

-- Blocked dates
create table if not exists blocked_dates (
  id serial primary key,
  villa_id integer references villas(id),
  block_date date not null,
  reason text,
  unique(villa_id, block_date)
);

-- RLS Policies
alter table villas enable row level security;
create policy "Public active villas" on villas for select using (status = 'active');
create policy "Admin full access villas" on villas for all using (auth.jwt() ->> 'email' = 'admin@saliguri.com') with check (auth.jwt() ->> 'email' = 'admin@saliguri.com');

alter table bookings enable row level security;
create policy "Public insert booking" on bookings for insert with check (true);
create policy "Admin full access bookings" on bookings for all using (auth.jwt() ->> 'email' = 'admin@saliguri.com') with check (auth.jwt() ->> 'email' = 'admin@saliguri.com');

alter table blocked_dates enable row level security;
create policy "Public select blocked dates" on blocked_dates for select using (true);
create policy "Admin manage blocked dates" on blocked_dates for all using (auth.jwt() ->> 'email' = 'admin@saliguri.com') with check (auth.jwt() ->> 'email' = 'admin@saliguri.com');
