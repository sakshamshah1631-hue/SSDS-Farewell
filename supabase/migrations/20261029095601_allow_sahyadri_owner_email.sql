/*
# Allow the designated Sahyadri Glow owner account

1. Purpose
- Allows the specified store owner email to use the existing owner panel after creating and signing into a Supabase email/password account.

2. Modified behavior
- Updates `is_owner()` so it recognizes an authenticated session with email `sahydriglow@gmail.com`.
- Existing rows in `public.owners` continue to be recognized.

3. Security
- The check still requires an authenticated session.
- No anonymous access is granted.
- No passwords are stored or exposed by this change.

4. Important note
- The owner must create the account with the exact email above and choose a password. The password cannot be recovered from the application.
*/

CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.owners
    WHERE user_id = auth.uid()
  )
  OR lower(COALESCE(auth.jwt() ->> 'email', '')) = 'sahydriglow@gmail.com';
$$;

REVOKE EXECUTE ON FUNCTION public.is_owner() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_owner() TO authenticated;