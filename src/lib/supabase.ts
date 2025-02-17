
import { createClient } from '@supabase/supabase-js';

// When using Lovable's Supabase integration, these environment variables are automatically injected
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Add error checking to provide better error messages
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please make sure you have connected your project to Supabase through the Lovable interface.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
