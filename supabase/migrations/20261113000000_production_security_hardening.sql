/*
  # Production Security Hardening & Strict RLS Migration
  
  1. Purpose:
     - Prevent unauthorized order status manipulation (IDOR / privilege escalation).
     - Protect draft/unpublished products from public exposure.
     - Validate order integrity at the database level.
     - Enforce least-privilege access across all tables and RPCs.

  2. Changes:
     - 'orders' table:
       - Restrict INSERT to valid orders with status = 'pending'.
       - Validate customer details and ensure total_inr > 0.
       - Restrict SELECT / UPDATE / DELETE exclusively to authenticated owners.
     - 'products' table:
       - Restrict public SELECT to published items only (is_published = true).
       - Authenticated owners can query all products.
*/

-- 1. Ensure RLS is active on all sensitive tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;

-- 2. Hardened Products Policy:
-- Public can only see published products. Owners can see all products.
DROP POLICY IF EXISTS "public_select_products" ON products;
CREATE POLICY "public_select_products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (
    is_published = true 
    OR (auth.role() = 'authenticated' AND public.is_owner())
  );

-- 3. Hardened Orders Policy:
-- Customers can insert orders, but ONLY in 'pending' status with positive total.
DROP POLICY IF EXISTS "anyone_insert_orders" ON orders;
CREATE POLICY "anyone_insert_orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND total_inr > 0
    AND length(trim(customer_name)) >= 2
    AND length(trim(customer_phone)) >= 10
    AND length(trim(customer_address)) >= 10
  );

-- Restrict orders SELECT/UPDATE/DELETE strictly to owners
DROP POLICY IF EXISTS "owner_manage_orders" ON orders;
CREATE POLICY "owner_manage_orders"
  ON orders FOR ALL
  TO authenticated
  USING (public.is_owner())
  WITH CHECK (public.is_owner());

-- 4. Revoke broad public permissions and grant least privilege
REVOKE ALL ON orders FROM anon;
GRANT INSERT ON orders TO anon;

REVOKE ALL ON products FROM anon;
GRANT SELECT ON products TO anon;

-- Ensure execute permissions on owner RPCs are strictly granted to authenticated users
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_owner() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_products() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_create_product(text, text, text, text, text, numeric, numeric, text, integer, text, integer, boolean, boolean, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_product(uuid, text, text, text, text, text, numeric, numeric, text, integer, text, integer, boolean, boolean, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_product(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_toggle_product_field(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_orders() TO authenticated;
