-- Create the iat_results table for storing IAT test results
CREATE TABLE public.iat_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  d_score DECIMAL NOT NULL,
  age INTEGER NOT NULL,
  years_experience INTEGER NOT NULL DEFAULT 0,
  degree TEXT NOT NULL,
  gender INTEGER NOT NULL,
  response_times DECIMAL[] NOT NULL DEFAULT '{}',
  responses JSONB NOT NULL DEFAULT '{}',
  survey_responses JSONB,
  survey_score DECIMAL,
  test_model TEXT NOT NULL DEFAULT 'A',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create the app_settings table for storing application configuration
CREATE TABLE public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.iat_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for iat_results (public read access for research data)
CREATE POLICY "Allow public read access to iat_results" 
ON public.iat_results 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert to iat_results" 
ON public.iat_results 
FOR INSERT 
WITH CHECK (true);

-- Create RLS policies for app_settings (public read, admin write)
CREATE POLICY "Allow public read access to app_settings" 
ON public.app_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert/update to app_settings" 
ON public.app_settings 
FOR ALL 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_iat_results_updated_at
  BEFORE UPDATE ON public.iat_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default test_enabled setting
INSERT INTO public.app_settings (key, value) 
VALUES ('test_enabled', 'true')
ON CONFLICT (key) DO NOTHING;