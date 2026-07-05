-- ============================================================
-- ZACO GLOBAL SCHOLARS — Supabase schema
-- Run this once in Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. PROFILES ---------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  email text,
  country text,
  phone text,
  role text not null default 'student' check (role in ('student','admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Admins can update all profiles"
  on public.profiles for update
  using (public.is_admin());

-- 2. INQUIRIES ----------------------------------------------------
-- Public landing-page form can insert without an account (user_id nullable).
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text not null,
  whatsapp text,
  service text not null,
  destination text,
  message text,
  status text not null default 'pending' check (status in ('pending','in_review','responded','cancelled')),
  created_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;

create policy "Anyone can submit an inquiry"
  on public.inquiries for insert
  with check (true);

create policy "Users can view own inquiries"
  on public.inquiries for select
  using (auth.uid() = user_id);

create policy "Users can cancel own inquiries"
  on public.inquiries for update
  using (auth.uid() = user_id);

create policy "Admins can view all inquiries"
  on public.inquiries for select
  using (public.is_admin());

create policy "Admins can update all inquiries"
  on public.inquiries for update
  using (public.is_admin());

-- 3. DOCUMENTS ------------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  doc_type text not null default 'other',
  uploaded_at timestamptz not null default now()
);

alter table public.documents enable row level security;

create policy "Users can manage own documents"
  on public.documents for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Admins can view all documents"
  on public.documents for select
  using (public.is_admin());

-- 4. APPLICATIONS (admission tracking) --------------------------------
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  university text not null,
  country text,
  program text,
  status text not null default 'applied' check (status in ('applied','under_review','admitted','rejected','visa_processing','visa_approved','arrived')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.applications enable row level security;

create policy "Users can view own applications"
  on public.applications for select
  using (auth.uid() = user_id);

create policy "Admins can manage all applications"
  on public.applications for all
  using (public.is_admin())
  with check (public.is_admin());

-- 5. PAYMENTS -----------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(10,2) not null,
  currency text not null default 'USD',
  purpose text not null,
  reference text not null,
  status text not null default 'pending' check (status in ('pending','confirmed','rejected')),
  created_at timestamptz not null default now()
);

alter table public.payments enable row level security;

create policy "Users can view own payments"
  on public.payments for select
  using (auth.uid() = user_id);

create policy "Users can create own payments"
  on public.payments for insert
  with check (auth.uid() = user_id);

create policy "Admins can manage all payments"
  on public.payments for all
  using (public.is_admin())
  with check (public.is_admin());

-- 6. STORAGE BUCKET FOR DOCUMENTS ----------------------------------------
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "Users can upload own documents"
  on storage.objects for insert
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can view own documents"
  on storage.objects for select
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete own documents"
  on storage.objects for delete
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Admins can view all documents in storage"
  on storage.objects for select
  using (bucket_id = 'documents' and public.is_admin());

-- ============================================================
-- To make your own account an admin after signing up once in the app,
-- run (replace the email):
--
-- update public.profiles set role = 'admin' where email = 'you@example.com';
-- ============================================================
