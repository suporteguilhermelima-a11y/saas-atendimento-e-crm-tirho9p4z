-- Ensure profiles table exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'operational',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_select" ON public.profiles;
CREATE POLICY "authenticated_select" ON public.profiles
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "authenticated_insert" ON public.profiles;
CREATE POLICY "authenticated_insert" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update" ON public.profiles;
CREATE POLICY "authenticated_update" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "authenticated_delete" ON public.profiles;
CREATE POLICY "authenticated_delete" ON public.profiles
  FOR DELETE TO authenticated USING (id = auth.uid());


-- Seed Admin (Using fast gen_salt cost of 4 to prevent timeouts, and pure SQL instead of PL/pgSQL block)
WITH new_user AS (
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current,
    phone, phone_change, phone_change_token, reauthentication_token
  )
  SELECT 
    gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'suporte.guilhermelima@gmail.com',
    crypt('securepassword123', gen_salt('bf', 4)), NOW(), NOW(), NOW(),
    '{"provider": "email", "providers": ["email"]}'::jsonb, '{"name": "Admin"}'::jsonb,
    false, 'authenticated', 'authenticated',
    '', '', '', '', '', NULL, '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'suporte.guilhermelima@gmail.com')
  RETURNING id, email
)
INSERT INTO public.profiles (id, email, name, role)
SELECT id, email, 'Admin', 'admin' FROM new_user
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, name, role)
SELECT id, email, 'Admin', 'admin' FROM auth.users WHERE email = 'suporte.guilhermelima@gmail.com'
ON CONFLICT (id) DO NOTHING;


-- Seed Dra. Laisa
WITH new_user AS (
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current,
    phone, phone_change, phone_change_token, reauthentication_token
  )
  SELECT 
    gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'laisa@example.com',
    crypt('securepassword123', gen_salt('bf', 4)), NOW(), NOW(), NOW(),
    '{"provider": "email", "providers": ["email"]}'::jsonb, '{"name": "Dra. Laisa"}'::jsonb,
    false, 'authenticated', 'authenticated',
    '', '', '', '', '', NULL, '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'laisa@example.com')
  RETURNING id, email
)
INSERT INTO public.profiles (id, email, name, role)
SELECT id, email, 'Dra. Laisa', 'clinical' FROM new_user
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, name, role)
SELECT id, email, 'Dra. Laisa', 'clinical' FROM auth.users WHERE email = 'laisa@example.com'
ON CONFLICT (id) DO NOTHING;


-- Seed Ana
WITH new_user AS (
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current,
    phone, phone_change, phone_change_token, reauthentication_token
  )
  SELECT 
    gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'ana@example.com',
    crypt('securepassword123', gen_salt('bf', 4)), NOW(), NOW(), NOW(),
    '{"provider": "email", "providers": ["email"]}'::jsonb, '{"name": "Ana (Operacional)"}'::jsonb,
    false, 'authenticated', 'authenticated',
    '', '', '', '', '', NULL, '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ana@example.com')
  RETURNING id, email
)
INSERT INTO public.profiles (id, email, name, role)
SELECT id, email, 'Ana (Operacional)', 'operational' FROM new_user
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, name, role)
SELECT id, email, 'Ana (Operacional)', 'operational' FROM auth.users WHERE email = 'ana@example.com'
ON CONFLICT (id) DO NOTHING;


-- Seed Paola
WITH new_user AS (
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current,
    phone, phone_change, phone_change_token, reauthentication_token
  )
  SELECT 
    gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'paola@example.com',
    crypt('securepassword123', gen_salt('bf', 4)), NOW(), NOW(), NOW(),
    '{"provider": "email", "providers": ["email"]}'::jsonb, '{"name": "Dra. Paola (Clínica)"}'::jsonb,
    false, 'authenticated', 'authenticated',
    '', '', '', '', '', NULL, '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'paola@example.com')
  RETURNING id, email
)
INSERT INTO public.profiles (id, email, name, role)
SELECT id, email, 'Dra. Paola (Clínica)', 'clinical' FROM new_user
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, name, role)
SELECT id, email, 'Dra. Paola (Clínica)', 'clinical' FROM auth.users WHERE email = 'paola@example.com'
ON CONFLICT (id) DO NOTHING;
