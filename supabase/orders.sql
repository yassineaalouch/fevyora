-- Commandes FEVYORA. Le préfixe fevyora_ les sépare des tables vp_ déjà dans ce projet Supabase.
-- À coller dans Supabase → SQL Editor → Run.
-- La clé service_role (worker + dashboard) ignore le RLS.
-- La clé anon ne peut ni lire ni écrire cette table.

create table if not exists public.fevyora_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'nouvelle'
    check (status in ('nouvelle', 'confirmee', 'expediee', 'livree', 'annulee')),
  customer_name text not null,
  phone text not null,
  city text not null,
  address text not null,
  note text,
  items jsonb not null,
  total integer not null check (total >= 0)
);

create index if not exists fevyora_orders_created_at_idx on public.fevyora_orders (created_at desc);

alter table public.fevyora_orders enable row level security;
