-- Fix nullable owner fields that break RLS on the active lifeBlock table
-- First, update any existing NULL values to a system user or the first user
UPDATE "lifeBlock" 
SET created_by = (SELECT id FROM auth.users ORDER BY created_at LIMIT 1)
WHERE created_by IS NULL;

UPDATE "userwiseExperiences" 
SET user_id = (SELECT id FROM auth.users ORDER BY created_at LIMIT 1)
WHERE user_id IS NULL;

-- Make columns NOT NULL
ALTER TABLE "lifeBlock" 
ALTER COLUMN created_by SET NOT NULL;

ALTER TABLE "userwiseExperiences" 
ALTER COLUMN user_id SET NOT NULL;

-- Add default for future inserts
ALTER TABLE "lifeBlock" 
ALTER COLUMN created_by SET DEFAULT auth.uid();

ALTER TABLE "userwiseExperiences" 
ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Remove overly permissive 'Policy with security definer functions' policies
DROP POLICY IF EXISTS "Policy with security definer functions" ON "Lifeblock";
DROP POLICY IF EXISTS "Policy with security definer functions" ON "lifeBlockTasks";
DROP POLICY IF EXISTS "Policy with security definer functions" ON "user";

-- Add proper RLS policies for lifeBlockTasks (which had no other policies)
CREATE POLICY "Users can view all tasks"
ON "lifeBlockTasks" FOR SELECT
USING (true);

CREATE POLICY "Users can create tasks for own blocks"
ON "lifeBlockTasks" FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "lifeBlock" 
    WHERE "lifeBlock".id = "lifeBlockTasks"."lifeBlockId" 
    AND "lifeBlock".created_by = auth.uid()
  )
);

CREATE POLICY "Users can update tasks for own blocks"
ON "lifeBlockTasks" FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "lifeBlock" 
    WHERE "lifeBlock".id = "lifeBlockTasks"."lifeBlockId" 
    AND "lifeBlock".created_by = auth.uid()
  )
);

CREATE POLICY "Users can delete tasks for own blocks"
ON "lifeBlockTasks" FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM "lifeBlock" 
    WHERE "lifeBlock".id = "lifeBlockTasks"."lifeBlockId" 
    AND "lifeBlock".created_by = auth.uid()
  )
);