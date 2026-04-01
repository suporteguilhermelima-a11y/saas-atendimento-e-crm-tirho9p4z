DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'operational', 'clinical');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'operational',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  procedure_name TEXT,
  stage TEXT NOT NULL DEFAULT 'lead',
  attendant_id UUID REFERENCES public.profiles(id),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL,
  sender_id UUID REFERENCES public.profiles(id),
  text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.deals(id),
  patient_name TEXT NOT NULL,
  appointment_time TIMESTAMPTZ NOT NULL,
  procedure_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Aguardando',
  specialist_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT false,
  webhook_url TEXT,
  stats TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_profiles" ON public.profiles;
CREATE POLICY "allow_all_profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all_deals" ON public.deals;
CREATE POLICY "allow_all_deals" ON public.deals FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all_messages" ON public.messages;
CREATE POLICY "allow_all_messages" ON public.messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all_appointments" ON public.appointments;
CREATE POLICY "allow_all_appointments" ON public.appointments FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all_templates" ON public.templates;
CREATE POLICY "allow_all_templates" ON public.templates FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all_automations" ON public.automations;
CREATE POLICY "allow_all_automations" ON public.automations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed Data
DO $do$
DECLARE
  uid_suporte UUID := gen_random_uuid();
  uid_laisa UUID := gen_random_uuid();
  uid_beatriz UUID := gen_random_uuid();
  uid_ana UUID := gen_random_uuid();
  uid_natalia UUID := gen_random_uuid();
  uid_paola UUID := gen_random_uuid();
BEGIN
  -- suporte
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'suporte.guilhermelima@gmail.com') THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change, email_change_token_current, phone_change, phone_change_token, reauthentication_token, phone)
    VALUES (uid_suporte, '00000000-0000-0000-0000-000000000000', 'suporte.guilhermelima@gmail.com', crypt('securepassword123', gen_salt('bf')), NOW(), '{"provider": "email", "providers": ["email"]}', '{"name": "Suporte"}', 'authenticated', 'authenticated', NOW(), NOW(), '', '', '', '', '', '', '', '', NULL);
    INSERT INTO public.profiles (id, email, name, role, avatar_url) VALUES (uid_suporte, 'suporte.guilhermelima@gmail.com', 'Suporte', 'admin', 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=10');
  END IF;

  -- Dra Laisa
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'laisa@example.com') THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change, email_change_token_current, phone_change, phone_change_token, reauthentication_token, phone)
    VALUES (uid_laisa, '00000000-0000-0000-0000-000000000000', 'laisa@example.com', crypt('securepassword123', gen_salt('bf')), NOW(), '{"provider": "email", "providers": ["email"]}', '{"name": "Dra. Laisa Chimello"}', 'authenticated', 'authenticated', NOW(), NOW(), '', '', '', '', '', '', '', '', NULL);
    INSERT INTO public.profiles (id, email, name, role, avatar_url) VALUES (uid_laisa, 'laisa@example.com', 'Dra. Laisa Chimello', 'admin', 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=24');
  END IF;

  -- Beatriz
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'beatriz@example.com') THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change, email_change_token_current, phone_change, phone_change_token, reauthentication_token, phone)
    VALUES (uid_beatriz, '00000000-0000-0000-0000-000000000000', 'beatriz@example.com', crypt('securepassword123', gen_salt('bf')), NOW(), '{"provider": "email", "providers": ["email"]}', '{"name": "Beatriz"}', 'authenticated', 'authenticated', NOW(), NOW(), '', '', '', '', '', '', '', '', NULL);
    INSERT INTO public.profiles (id, email, name, role, avatar_url) VALUES (uid_beatriz, 'beatriz@example.com', 'Beatriz', 'admin', 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=25');
  END IF;

  -- Ana
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ana@example.com') THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change, email_change_token_current, phone_change, phone_change_token, reauthentication_token, phone)
    VALUES (uid_ana, '00000000-0000-0000-0000-000000000000', 'ana@example.com', crypt('securepassword123', gen_salt('bf')), NOW(), '{"provider": "email", "providers": ["email"]}', '{"name": "Ana"}', 'authenticated', 'authenticated', NOW(), NOW(), '', '', '', '', '', '', '', '', NULL);
    INSERT INTO public.profiles (id, email, name, role, avatar_url) VALUES (uid_ana, 'ana@example.com', 'Ana', 'operational', 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=26');
  END IF;

  -- Natalia
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'natalia@example.com') THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change, email_change_token_current, phone_change, phone_change_token, reauthentication_token, phone)
    VALUES (uid_natalia, '00000000-0000-0000-0000-000000000000', 'natalia@example.com', crypt('securepassword123', gen_salt('bf')), NOW(), '{"provider": "email", "providers": ["email"]}', '{"name": "Natalia"}', 'authenticated', 'authenticated', NOW(), NOW(), '', '', '', '', '', '', '', '', NULL);
    INSERT INTO public.profiles (id, email, name, role, avatar_url) VALUES (uid_natalia, 'natalia@example.com', 'Natalia', 'operational', 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=27');
  END IF;

  -- Dra Paola
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'paola@example.com') THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change, email_change_token_current, phone_change, phone_change_token, reauthentication_token, phone)
    VALUES (uid_paola, '00000000-0000-0000-0000-000000000000', 'paola@example.com', crypt('securepassword123', gen_salt('bf')), NOW(), '{"provider": "email", "providers": ["email"]}', '{"name": "Dra. Paola"}', 'authenticated', 'authenticated', NOW(), NOW(), '', '', '', '', '', '', '', '', NULL);
    INSERT INTO public.profiles (id, email, name, role, avatar_url) VALUES (uid_paola, 'paola@example.com', 'Dra. Paola', 'clinical', 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=28');
  END IF;

  -- Initial Mock CRM Data
  INSERT INTO public.deals (id, name, phone, procedure_name, stage, avatar_url) VALUES
    ('d1000000-0000-0000-0000-000000000001'::uuid, 'Mariana Silva', '+55 11 99999-1111', 'Avaliação Facial', 'lead', 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1'),
    ('d1000000-0000-0000-0000-000000000002'::uuid, 'Carlos Santos', '+55 21 98888-2222', 'Dúvidas Botox', 'triage', 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=2'),
    ('d1000000-0000-0000-0000-000000000003'::uuid, 'Beatriz Almeida', '+55 31 97777-3333', 'Preenchimento', 'scheduled', 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=12')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.messages (id, deal_id, sender_type, text, created_at) VALUES
    ('m1000000-0000-0000-0000-000000000001'::uuid, 'd1000000-0000-0000-0000-000000000001'::uuid, 'bot', 'Olá! Bem-vindo ao Atendimento Laisa Chimello. Especialistas em sua melhor versão. Como podemos te ajudar hoje?', NOW() - INTERVAL '10 minutes'),
    ('m1000000-0000-0000-0000-000000000002'::uuid, 'd1000000-0000-0000-0000-000000000001'::uuid, 'user', 'Gostaria de agendar uma avaliação facial.', NOW() - INTERVAL '9 minutes'),
    ('m1000000-0000-0000-0000-000000000003'::uuid, 'd1000000-0000-0000-0000-000000000001'::uuid, 'bot', 'Perfeito! Estamos transferindo você para nossa recepção humana.', NOW() - INTERVAL '9 minutes'),
    ('m1000000-0000-0000-0000-000000000004'::uuid, 'd1000000-0000-0000-0000-000000000001'::uuid, 'user', 'Ok, no aguardo.', NOW() - INTERVAL '8 minutes')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.templates (id, title, category, content) VALUES
    ('t1000000-0000-0000-0000-000000000001'::uuid, 'Confirmação de Consulta - Padrão', 'Confirmação de Consulta', 'Olá, {nome_paciente}!\n\nPassando para confirmar sua consulta com a {especialista} amanhã, {data}, às {hora}.\n\nPor favor, responda com "SIM" para confirmar ou "NÃO" para reagendar.'),
    ('t1000000-0000-0000-0000-000000000002'::uuid, 'Lembrete de Retorno Mensal', 'Lembrete de Retorno', 'Olá, {nome_paciente}!\n\nJá faz um tempinho desde a sua última visita ao Atendimento Laisa Chimello. Que tal agendarmos seu retorno para acompanhamento do tratamento?\n\nPodemos marcar para a próxima semana?')
  ON CONFLICT DO NOTHING;
END $do$;
