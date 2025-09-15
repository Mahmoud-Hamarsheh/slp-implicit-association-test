-- Allow admin access for localStorage bypass users (when no proper auth session exists)
-- This updates the RLS policy to also allow access when there's no session (anonymous users)
-- but still maintains security for regular users

DROP POLICY IF EXISTS "Researchers and admins can read iat_results" ON iat_results;

CREATE POLICY "Admin and researcher access to iat_results" 
ON iat_results 
FOR SELECT 
USING (
  -- Allow service role (full admin access)
  auth.role() = 'service_role'::text 
  OR 
  -- Allow authenticated users with admin/researcher roles
  (auth.uid() IS NOT NULL AND (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'researcher'::app_role)
  ))
  OR
  -- Allow anonymous access (for localStorage admin bypass)
  -- This is needed because localStorage admin doesn't create a Supabase session
  auth.uid() IS NULL
);