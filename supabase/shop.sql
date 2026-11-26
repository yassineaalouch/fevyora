-- Produits, codes promo et visites FEVYORA.
-- À coller dans Supabase → SQL Editor → Run si les tables n'existent pas encore.
-- La clé secrète (worker + dashboard Vercel) ignore le RLS. Le site public ne l'a pas.

create table if not exists public.fevyora_products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique,
  name text not null,
  price integer not null check (price >= 0),
  compare_at integer,
  collection text not null,
  image text not null default '',
  detail text not null default '',
  sizes text[] not null default '{}',
  active boolean not null default true
);

create table if not exists public.fevyora_coupons (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  code text not null unique,
  kind text not null check (kind in ('percent', 'fixed')),
  amount integer not null check (amount > 0),
  min_total integer not null default 0 check (min_total >= 0),
  active boolean not null default true,
  expires_at timestamptz,
  usage_limit integer,
  used_count integer not null default 0 check (used_count >= 0)
);

create table if not exists public.fevyora_visitors (
  id uuid primary key default gen_random_uuid(),
  visitor_key text not null unique,
  user_id text not null default '',
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  source text not null default 'Direct',
  device text not null default '',
  os text not null default '',
  browser text not null default '',
  sessions integer not null default 1
);

create table if not exists public.fevyora_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  visitor_key text not null,
  session_key text not null,
  type text not null check (type in ('page', 'product', 'add_cart', 'remove_cart')),
  path text not null default '',
  slug text not null default ''
);

create index if not exists fevyora_events_created_idx on public.fevyora_events (created_at desc);
create index if not exists fevyora_events_visitor_idx on public.fevyora_events (visitor_key);
create index if not exists fevyora_visitors_last_seen_idx on public.fevyora_visitors (last_seen desc);

alter table public.fevyora_orders add column if not exists coupon_code text;
alter table public.fevyora_orders add column if not exists discount integer not null default 0;

alter table public.fevyora_products enable row level security;
alter table public.fevyora_coupons enable row level security;
alter table public.fevyora_visitors enable row level security;
alter table public.fevyora_events enable row level security;

insert into public.fevyora_products (slug, name, price, compare_at, collection, detail, sizes)
values
  ('ensemble-elegant', 'Ensemble Élégant', 499, 699, 'ensembles', 'Veste courte · jupe ample', array['S','M','L']),
  ('robe-a-volants', 'Robe à Volants', 599, 799, 'abayas-robes', 'Volants · jupe longue', array['XS','S','M','L']),
  ('ensemble-chic', 'Ensemble Chic', 549, 749, 'jupes-tops', 'Top olive · jupe ivoire', array['S','M','L','XL']),
  ('jupe-longue-premium', 'Jupe Longue Premium', 399, 499, 'jupes-tops', 'Jupe ample · veste croisée', array['M','L','XL','XXL']),
  ('veste-courte', 'Veste Courte', 449, 599, 'ensembles', 'Col festonné · boutons nacrés', array['XS','S','M']),
  ('robe-longue-elegante', 'Robe Longue Élégante', 479, 599, 'vestes-manteaux', 'Manteau long · robe noire', array['S','M','L','XL'])
on conflict (slug) do nothing;
