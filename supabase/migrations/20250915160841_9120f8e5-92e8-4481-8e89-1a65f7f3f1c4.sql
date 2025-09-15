-- Secure sensitive research data in iat_results by restricting read access to authorized roles

-- 1) Create roles enum (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'researcher', 'moderator', 'user');
  END IF;
END $$;

-- 2) Create user_roles table to assign roles to users
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policies: users can read their own roles. No public insert/update/delete.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Users can view their own roles'
  ) THEN
    CREATE POLICY "Users can view their own roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- 3) Helper function to check roles (SECURITY DEFINER to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role = _role
  );
$$;

-- 4) Tighten iat_results read access policy
-- Drop overly permissive public read, if present
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'iat_results' AND policyname = 'Allow public read access to iat_results'
  ) THEN
    DROP POLICY "Allow public read access to iat_results" ON public.iat_results;
  END IF;
END $$;

-- Create a restricted SELECT policy for researchers/admins
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'iat_results' AND policyname = 'Researchers and admins can read iat_results'
  ) THEN
    CREATE POLICY "Researchers and admins can read iat_results"
    ON public.iat_results
    FOR SELECT
    TO authenticated
    USING (
      -- service_role bypasses RLS, but keep a guard for completeness
      auth.role() = 'service_role' OR
      public.has_role(auth.uid(), 'admin') OR
      public.has_role(auth.uid(), 'researcher')
    );
  END IF;
END $$;

-- Keep existing public INSERT policy as-is to allow anonymous study submissions
-- No change to INSERT policy to avoid breaking data collection
