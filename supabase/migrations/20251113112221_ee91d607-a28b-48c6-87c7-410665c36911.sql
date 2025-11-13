-- Add name column to user table
ALTER TABLE public.user ADD COLUMN IF NOT EXISTS name character varying;

-- Update the handle_new_user function to include name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public."user" (id, email, "userName", name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'userName', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$;