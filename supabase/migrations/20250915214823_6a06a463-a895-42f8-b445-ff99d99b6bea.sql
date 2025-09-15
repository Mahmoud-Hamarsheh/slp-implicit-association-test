-- Drop all existing policies on app_settings
DROP POLICY IF EXISTS "Allow public insert/update to app_settings" ON public.app_settings;
DROP POLICY IF EXISTS "Allow public read access to app_settings" ON public.app_settings;
DROP POLICY IF EXISTS "Allow public read for test_enabled setting only" ON public.app_settings;
DROP POLICY IF EXISTS "Allow admin full access to app_settings" ON public.app_settings;

-- Create secure policies for app_settings
-- Allow public read access only for test_enabled setting (needed for test availability check)
CREATE POLICY "public_read_test_enabled_only"
ON public.app_settings
FOR SELECT
USING (key = 'test_enabled');

-- Allow admins full access to all settings
CREATE POLICY "admin_full_access_app_settings"
ON public.app_settings
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));