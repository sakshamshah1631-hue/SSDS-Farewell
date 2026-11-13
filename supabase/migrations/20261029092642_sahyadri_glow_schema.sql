/*
# Sahyadri Glow — Products, Orders, Owner management, and Admin RPC functions

## Overview
Creates the full database backend for the Sahyadri Glow candle e-commerce app:
- `products` table for the public candle catalogue (readable by all, writable only by owners)
- `orders` table for customer orders submitted at checkout (readable/writable only by owners)
- `owners` table listing which authenticated users are store owners
- SECURITY DEFINER helper functions for owner checks and admin product/order management

## New Tables
1. `products`
   - id (uuid, PK, default gen_random_uuid())
   - name (text, not null) — product display name
   - slug (text, unique, not null) — URL-friendly identifier
   - description (text, not null) — marketing copy
   - category (text, not null, check 'single' | 'blend') — single fragrance or signature blend
   - image_url (text, not null) — product photograph URL
   - price_inr (numeric, nullable) — regular price in INR
   - sale_price_inr (numeric, nullable) — optional sale price in INR
   - size_label (text, nullable) — e.g. "200g"
   - weight_grams (integer, nullable) — used for shipping calculation
   - fragrance (text, nullable) — fragrance notes description
   - stock_quantity (integer, not null, default 0)
   - is_featured (boolean, default false) — shown in featured/blend sections
   - is_bestseller (boolean, default false) — shown in bestsellers section
   - is_published (boolean, default true) — visible on storefront
   - created_at (timestamptz, default now())

2. `orders`
   - id (uuid, PK, default gen_random_uuid())
   - customer_name (text, not null)
   - customer_phone (text, not null)
   - customer_address (text, not null)
   - items (jsonb, not null) — array of { name, quantity, price, image_url }
   - total_inr (numeric, not null) — grand total including shipping
   - status (text, not null, default 'pending')
   - created_at (timestamptz, default now())

3. `owners`
   - user_id (uuid, PK, references auth.users ON DELETE CASCADE)
   - created_at (timestamptz, default now())
   - Marks which authenticated Supabase users are store owners.

## Security
- RLS enabled on all three tables.
- products: SELECT public (anon + authenticated); all writes restricted to owners via SECURITY DEFINER functions.
- orders: no direct public access; INSERT allowed for anyone (anon + authenticated) so customers can place orders; SELECT/UPDATE/DELETE restricted to owners via SECURITY DEFINER functions.
- owners: no public access at all; readable only inside SECURITY DEFINER functions.
- All admin product/order functions are SECURITY DEFINER, revoke EXECUTE from PUBLIC/anon, grant to authenticated, and verify caller is an owner before acting.
- `is_owner()` helper function checks if the calling authenticated user is in the owners table.

## RPC Functions
- is_owner() → boolean: checks if current user is an owner
- admin_list_products() → products[]: returns all products (owner only)
- admin_create_product(...): inserts a new product (owner only)
- admin_update_product(p_id, ...): updates an existing product (owner only)
- admin_delete_product(p_id): deletes a product (owner only)
- admin_toggle_product_field(p_id, p_field): toggles is_published/is_featured/is_bestseller (owner only)
- admin_list_orders() → orders[]: returns all orders (owner only)
*/

-- ============================================================
-- products table
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('single', 'blend')),
  image_url text NOT NULL,
  price_inr numeric,
  sale_price_inr numeric,
  size_label text,
  weight_grams integer,
  fragrance text,
  stock_quantity integer NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  is_bestseller boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON products TO anon, authenticated;

DROP POLICY IF EXISTS "public_select_products" ON products;
CREATE POLICY "public_select_products"
  ON products FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================
-- orders table
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  items jsonb NOT NULL,
  total_inr numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Customers can place orders (INSERT) without signing in
GRANT INSERT ON orders TO anon, authenticated;

DROP POLICY IF EXISTS "anyone_insert_orders" ON orders;
CREATE POLICY "anyone_insert_orders"
  ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- ============================================================
-- owners table
-- ============================================================
CREATE TABLE IF NOT EXISTS owners (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE owners ENABLE ROW LEVEL SECURITY;

-- No direct grants or policies: owners table is accessed only through SECURITY DEFINER functions

-- ============================================================
-- is_owner() helper — callable by authenticated users
-- ============================================================
CREATE OR REPLACE FUNCTION is_owner()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM owners WHERE user_id = auth.uid());
$$;

REVOKE EXECUTE ON FUNCTION is_owner() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION is_owner() TO authenticated;

-- ============================================================
-- admin_list_products — owner only
-- ============================================================
CREATE OR REPLACE FUNCTION admin_list_products()
RETURNS SETOF products
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_owner() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  RETURN QUERY SELECT * FROM products ORDER BY created_at ASC;
END;
$$;

REVOKE EXECUTE ON FUNCTION admin_list_products() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION admin_list_products() TO authenticated;

-- ============================================================
-- admin_create_product — owner only
-- ============================================================
CREATE OR REPLACE FUNCTION admin_create_product(
  p_name text,
  p_slug text,
  p_description text,
  p_category text,
  p_image_url text,
  p_price_inr numeric,
  p_sale_price_inr numeric,
  p_size_label text,
  p_weight_grams integer,
  p_fragrance text,
  p_stock_quantity integer,
  p_is_featured boolean,
  p_is_bestseller boolean,
  p_is_published boolean
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  IF NOT is_owner() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  INSERT INTO products (
    name, slug, description, category, image_url,
    price_inr, sale_price_inr, size_label, weight_grams,
    fragrance, stock_quantity, is_featured, is_bestseller, is_published
  ) VALUES (
    p_name, p_slug, p_description, p_category, p_image_url,
    p_price_inr, p_sale_price_inr, p_size_label, p_weight_grams,
    p_fragrance, p_stock_quantity, p_is_featured, p_is_bestseller, p_is_published
  ) RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION admin_create_product(text, text, text, text, text, numeric, numeric, text, integer, text, integer, boolean, boolean, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION admin_create_product(text, text, text, text, text, numeric, numeric, text, integer, text, integer, boolean, boolean, boolean) TO authenticated;

-- ============================================================
-- admin_update_product — owner only
-- ============================================================
CREATE OR REPLACE FUNCTION admin_update_product(
  p_id uuid,
  p_name text,
  p_slug text,
  p_description text,
  p_category text,
  p_image_url text,
  p_price_inr numeric,
  p_sale_price_inr numeric,
  p_size_label text,
  p_weight_grams integer,
  p_fragrance text,
  p_stock_quantity integer,
  p_is_featured boolean,
  p_is_bestseller boolean,
  p_is_published boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_owner() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  UPDATE products SET
    name = p_name,
    slug = p_slug,
    description = p_description,
    category = p_category,
    image_url = p_image_url,
    price_inr = p_price_inr,
    sale_price_inr = p_sale_price_inr,
    size_label = p_size_label,
    weight_grams = p_weight_grams,
    fragrance = p_fragrance,
    stock_quantity = p_stock_quantity,
    is_featured = p_is_featured,
    is_bestseller = p_is_bestseller,
    is_published = p_is_published
  WHERE id = p_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION admin_update_product(uuid, text, text, text, text, text, numeric, numeric, text, integer, text, integer, boolean, boolean, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION admin_update_product(uuid, text, text, text, text, text, numeric, numeric, text, integer, text, integer, boolean, boolean, boolean) TO authenticated;

-- ============================================================
-- admin_delete_product — owner only
-- ============================================================
CREATE OR REPLACE FUNCTION admin_delete_product(p_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_owner() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  DELETE FROM products WHERE id = p_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION admin_delete_product(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION admin_delete_product(uuid) TO authenticated;

-- ============================================================
-- admin_toggle_product_field — toggles a boolean field (owner only)
-- ============================================================
CREATE OR REPLACE FUNCTION admin_toggle_product_field(p_id uuid, p_field text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_owner() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  IF p_field NOT IN ('is_published', 'is_featured', 'is_bestseller') THEN
    RAISE EXCEPTION 'Invalid field';
  END IF;
  EXECUTE format('UPDATE products SET %I = NOT %I WHERE id = $1', p_field, p_field)
  USING p_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION admin_toggle_product_field(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION admin_toggle_product_field(uuid, text) TO authenticated;

-- ============================================================
-- admin_list_orders — owner only
-- ============================================================
CREATE OR REPLACE FUNCTION admin_list_orders()
RETURNS SETOF orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_owner() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  RETURN QUERY SELECT * FROM orders ORDER BY created_at DESC;
END;
$$;

REVOKE EXECUTE ON FUNCTION admin_list_orders() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION admin_list_orders() TO authenticated;

-- ============================================================
-- Seed fallback products so the storefront isn't empty
-- ============================================================
INSERT INTO products (name, slug, description, category, image_url, price_inr, sale_price_inr, size_label, weight_grams, fragrance, stock_quantity, is_featured, is_bestseller, is_published)
VALUES
  ('Vanilla', 'vanilla', 'Soft, creamy vanilla with a comforting warmth that turns any corner into home.', 'single', 'https://images.pexels.com/photos/8903647/pexels-photo-8903647.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL, NULL, NULL, 200, NULL, 0, true, true, true),
  ('T Rose', 't-rose', 'A graceful rose accord with a fresh, petal-soft finish and quiet elegance.', 'single', 'https://images.pexels.com/photos/37181850/pexels-photo-37181850.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL, NULL, NULL, 200, NULL, 0, true, false, true),
  ('Lavender', 'lavender', 'A calm botanical blend inspired by slow evenings and open mountain air.', 'single', 'https://images.pexels.com/photos/6101288/pexels-photo-6101288.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL, NULL, NULL, 200, NULL, 0, false, true, true),
  ('Hawaiian Breeze', 'hawaiian-breeze', 'Bright, airy and sun-washed — a little escape in every breath.', 'single', 'https://images.pexels.com/photos/14499685/pexels-photo-14499685.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL, NULL, NULL, 200, NULL, 0, false, false, true),
  ('Sandalwood', 'sandalwood', 'Earthy sandalwood with a smooth, meditative depth and warm trail.', 'single', 'https://images.pexels.com/photos/28260282/pexels-photo-28260282.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL, NULL, NULL, 200, NULL, 0, false, true, true),
  ('Vanilla + Lavender', 'vanilla-lavender', 'Creamy vanilla softened with a serene lavender heart.', 'blend', 'https://images.pexels.com/photos/27549293/pexels-photo-27549293.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL, NULL, NULL, 200, NULL, 0, true, true, true),
  ('Vanilla + Rose', 'vanilla-rose', 'A tender pairing of velvety rose and familiar vanilla warmth.', 'blend', 'https://images.pexels.com/photos/7498421/pexels-photo-7498421.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL, NULL, NULL, 200, NULL, 0, true, false, true),
  ('Vanilla + Hawaiian Breeze', 'vanilla-hawaiian-breeze', 'A luminous blend where creamy vanilla meets a fresh island breeze.', 'blend', 'https://images.pexels.com/photos/7302762/pexels-photo-7302762.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL, NULL, NULL, 200, NULL, 0, false, false, true)
ON CONFLICT (slug) DO NOTHING;
