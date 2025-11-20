-- Allow life block creators to view signups for their blocks
CREATE POLICY "Creators can view signups for own blocks"
ON public."userwiseExperiences"
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public."lifeBlock"
    WHERE "lifeBlock".id = "userwiseExperiences".lifeblock
    AND "lifeBlock".created_by = auth.uid()
  )
);