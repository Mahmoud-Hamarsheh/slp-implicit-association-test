-- Ensure RLS is enabled on iat_results
ALTER TABLE public.iat_results ENABLE ROW LEVEL SECURITY;

-- Clean up existing insert policies to avoid conflicts
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'iat_results' AND policyname = 'Allow public insert to iat_results'
  ) THEN
    DROP POLICY "Allow public insert to iat_results" ON public.iat_results;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'iat_results' AND policyname = 'Public can insert iat_results'
  ) THEN
    DROP POLICY "Public can insert iat_results" ON public.iat_results;
  END IF;
END $$;

-- Create explicit policies for anonymous and authenticated inserts
CREATE POLICY "anon can insert iat_results"
ON public.iat_results
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "authenticated can insert iat_results"
ON public.iat_results
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Keep existing SELECT policy as-is (admins/researchers/service_role only)
