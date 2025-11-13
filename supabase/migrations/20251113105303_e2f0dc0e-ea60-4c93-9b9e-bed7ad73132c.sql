-- Step 1: Drop foreign key constraints that reference user table
ALTER TABLE public."userwiseExperiences" DROP CONSTRAINT IF EXISTS "userwiseExperiences_user_fkey";
ALTER TABLE public."lifeBlock" DROP CONSTRAINT IF EXISTS "lifeBlock_createdBy_fkey";

-- Step 2: Truncate the user table to remove old data (we're migrating to Supabase Auth)
TRUNCATE TABLE public."user" CASCADE;

-- Step 3: Drop the password column
ALTER TABLE public."user" DROP COLUMN IF EXISTS password;

-- Step 4: Rename old id column temporarily
ALTER TABLE public."user" RENAME COLUMN id TO old_id;

-- Step 5: Drop the old primary key constraint
ALTER TABLE public."user" DROP CONSTRAINT IF EXISTS user_pkey CASCADE;

-- Step 6: Add new uuid id column as primary key
ALTER TABLE public."user" ADD COLUMN id uuid PRIMARY KEY;

-- Step 7: Add foreign key to auth.users
ALTER TABLE public."user" ADD CONSTRAINT user_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 8: Drop the old_id column
ALTER TABLE public."user" DROP COLUMN old_id;

-- Step 9: Update lifeBlock table
ALTER TABLE public."lifeBlock" DROP COLUMN IF EXISTS "createdBy";
ALTER TABLE public."lifeBlock" ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public."user"(id) ON DELETE SET NULL;

-- Step 10: Update userwiseExperiences table
ALTER TABLE public."userwiseExperiences" DROP COLUMN IF EXISTS "user";
ALTER TABLE public."userwiseExperiences" ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public."user"(id) ON DELETE CASCADE;

-- Step 11: Enable RLS on user table
ALTER TABLE public."user" ENABLE ROW LEVEL SECURITY;

-- Step 12: Create RLS policies for user table
CREATE POLICY "Users can view all profiles"
  ON public."user" FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public."user" FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public."user" FOR INSERT WITH CHECK (auth.uid() = id);

-- Step 13: Update RLS policies for lifeBlock
DROP POLICY IF EXISTS "Policy with security definer functions" ON public."lifeBlock";

CREATE POLICY "Everyone can view life blocks"
  ON public."lifeBlock" FOR SELECT USING (true);

CREATE POLICY "Users can create own life blocks"
  ON public."lifeBlock" FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own life blocks"
  ON public."lifeBlock" FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own life blocks"
  ON public."lifeBlock" FOR DELETE USING (auth.uid() = created_by);

-- Step 14: Update RLS policies for userwiseExperiences
DROP POLICY IF EXISTS "Policy with security definer functions" ON public."userwiseExperiences";

CREATE POLICY "Users can view own experiences"
  ON public."userwiseExperiences" FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own experiences"
  ON public."userwiseExperiences" FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own experiences"
  ON public."userwiseExperiences" FOR UPDATE USING (auth.uid() = user_id);

-- Step 15: Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public."user" (id, email, "userName")
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'userName', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$;

-- Step 16: Create trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();