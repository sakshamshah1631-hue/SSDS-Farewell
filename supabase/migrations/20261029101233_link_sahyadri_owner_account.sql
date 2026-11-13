/*
# Link the existing Sahyadri Glow owner account

1. Purpose
- Adds the already-created `sahydriglow@gmail.com` account to the owner allowlist.

2. Modified data
- Inserts the matching authenticated user ID into `public.owners` when that account exists.
- The insert is idempotent and does not change or delete any user data.

3. Security
- Owner access remains limited to the exact authenticated email and the owner table check.
- No password is read, stored, or exposed.
*/

INSERT INTO public.owners (user_id)
SELECT id
FROM auth.users
WHERE lower(email) = 'sahydriglow@gmail.com'
ON CONFLICT (user_id) DO NOTHING;