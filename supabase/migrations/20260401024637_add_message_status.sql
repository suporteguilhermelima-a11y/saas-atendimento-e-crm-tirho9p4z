ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'sent';
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS wa_message_id TEXT;

UPDATE public.messages SET status = 'read' WHERE is_read = true AND sender_type = 'attendant';
UPDATE public.messages SET status = 'received' WHERE sender_type = 'user' AND status = 'sent';
