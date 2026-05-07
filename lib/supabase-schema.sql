-- ============================================
-- SIGON SPORT — Supabase Schema
-- Chạy script này trong Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- TABLE: products
-- ============================================
create table if not exists products (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  brand           text,
  sport           text,          -- 'bong-da' | 'cau-long' | 'tennis' | 'pickleball'
  category        text,          -- 'giay' | 'vot' | 'phu-kien'
  price           bigint not null default 0,
  original_price  bigint default 0,
  discount        int default 0,
  img             text,          -- URL ảnh chính
  is_new          boolean default false,
  is_hot          boolean default false,
  is_secondhand   boolean default false,
  in_stock        boolean default true,
  condition       text,          -- 'Mới 90%' | 'Mới 80%' | null (nếu hàng mới)
  rating          numeric(2,1),
  review_count    int default 0,
  sold            int default 0,
  description     text,
  created_at      timestamptz default now()
);

-- ============================================
-- TABLE: orders
-- ============================================
create type order_status as enum (
  'pending',
  'confirmed',
  'shipping',
  'delivered',
  'cancelled'
);

create table if not exists orders (
  id                uuid primary key default uuid_generate_v4(),
  order_number      text unique not null default ('DH' || to_char(now(), 'YYYYMMDD') || '-' || substr(md5(random()::text), 1, 6)),
  customer_name     text not null,
  customer_phone    text not null,
  customer_email    text,
  customer_address  text not null,
  customer_province text not null,
  customer_note     text,
  items             jsonb not null default '[]',
  subtotal          bigint not null default 0,
  shipping          bigint not null default 0,
  total             bigint not null default 0,
  status            order_status not null default 'pending',
  payment_method    text not null default 'cod',  -- 'cod' | 'bank'
  created_at        timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Bật RLS
alter table products enable row level security;
alter table orders enable row level security;

-- PRODUCTS: public có thể đọc
create policy "products_public_read"
  on products for select
  to anon, authenticated
  using (true);

-- PRODUCTS: chỉ admin (authenticated) mới insert/update/delete
create policy "products_admin_write"
  on products for all
  to authenticated
  using (true)
  with check (true);

-- ORDERS: public có thể INSERT (đặt hàng)
create policy "orders_public_insert"
  on orders for insert
  to anon, authenticated
  with check (true);

-- ORDERS: authenticated (admin) có thể đọc và cập nhật
create policy "orders_admin_read"
  on orders for select
  to authenticated
  using (true);

create policy "orders_admin_update"
  on orders for update
  to authenticated
  using (true)
  with check (true);

-- ============================================
-- TABLE: customers (danh bạ thủ công)
-- ============================================
create table if not exists customers (
  id        uuid primary key default uuid_generate_v4(),
  name      text not null,
  phone     text,
  email     text,
  address   text,
  province  text,
  note      text,
  source    text default 'manual',  -- 'manual' | 'facebook' | 'zalo' | 'referral' | 'walkin'
  created_at timestamptz default now()
);

alter table customers enable row level security;

create policy "customers_admin_all"
  on customers for all
  to authenticated
  using (true) with check (true);

create index if not exists idx_customers_phone on customers(phone);

-- Thêm cột channel vào orders (nếu chưa có)
alter table orders add column if not exists channel text default 'website';
-- 'website' | 'facebook' | 'zalo' | 'phone' | 'tiktok' | 'instagram' | 'walkin'
create index if not exists idx_orders_channel on orders(channel);

-- ============================================
-- TABLE: posts (Blog & SEO)
-- ============================================
create table if not exists posts (
  id               uuid primary key default uuid_generate_v4(),
  title            text not null,
  slug             text unique not null,
  excerpt          text,
  content          text,
  cover_img        text,
  author           text default 'Admin',
  category         text,
  tags             text[],
  status           text not null default 'draft',  -- 'draft' | 'published'
  -- SEO fields
  seo_title        text,
  seo_description  text,
  seo_keywords     text,
  focus_keyword    text,
  -- Metrics
  view_count       int default 0,
  published_at     timestamptz,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- RLS cho posts
alter table posts enable row level security;

-- Public đọc bài đã đăng
create policy "posts_public_read"
  on posts for select
  to anon, authenticated
  using (status = 'published' or auth.role() = 'authenticated');

-- Admin full quyền
create policy "posts_admin_write"
  on posts for all
  to authenticated
  using (true)
  with check (true);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
  before update on posts
  for each row execute function update_updated_at();

-- ============================================
-- INDEXES để tối ưu query
-- ============================================
create index if not exists idx_products_sport on products(sport);
create index if not exists idx_products_is_hot on products(is_hot);
create index if not exists idx_products_is_new on products(is_new);
create index if not exists idx_products_is_secondhand on products(is_secondhand);
create index if not exists idx_products_brand on products(brand);
create index if not exists idx_products_created_at on products(created_at desc);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created_at on orders(created_at desc);
create index if not exists idx_orders_order_number on orders(order_number);
create index if not exists idx_posts_status     on posts(status);
create index if not exists idx_posts_slug       on posts(slug);
create index if not exists idx_posts_category   on posts(category);
create index if not exists idx_posts_created_at on posts(created_at desc);
