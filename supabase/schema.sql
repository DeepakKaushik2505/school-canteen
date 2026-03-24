-- School Canteen Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- snacks
create table if not exists snacks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null,
  "ordersCount" integer not null default 0
);

-- students
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  "referralCode" text not null unique,
  "totalSpent" numeric not null default 0,
  "userId" text
);

-- orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  "studentId" uuid not null references students(id) on delete cascade,
  "snackId" uuid not null references snacks(id) on delete restrict,
  quantity integer not null check (quantity >= 1 and quantity <= 5),
  "payableAmount" numeric not null,
  "createdAt" timestamptz not null default now()
);

-- Enable RLS (Row Level Security)
alter table snacks enable row level security;
alter table students enable row level security;
alter table orders enable row level security;

-- Policies: allow all for prototype (adjust for production)
create policy "Allow all on snacks" on snacks for all using (true) with check (true);
create policy "Allow all on students" on students for all using (true) with check (true);
create policy "Allow all on orders" on orders for all using (true) with check (true);

-- Run supabase/seed.sql for initial data (snacks + students)
