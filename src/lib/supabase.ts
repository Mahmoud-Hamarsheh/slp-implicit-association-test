
import { supabase as integrationSupabase } from '@/integrations/supabase/client';

// Use the preconfigured Supabase client and relax types to avoid build-time table typing issues
export const supabase = integrationSupabase as any;
