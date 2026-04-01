DO $do$
DECLARE
  pub_exists boolean;
BEGIN
  -- Check if the supabase_realtime publication exists
  SELECT count(*) > 0 INTO pub_exists FROM pg_publication WHERE pubname = 'supabase_realtime';
  
  IF NOT pub_exists THEN
    -- Create it if it does not exist and add our tables
    CREATE PUBLICATION supabase_realtime FOR TABLE public.deals, public.messages;
  ELSE
    -- Add tables safely if the publication already exists
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.deals;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;
END
$do$;
