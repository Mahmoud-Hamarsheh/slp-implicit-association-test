
import { createClient } from '@supabase/supabase-js';
import { supabase as integrationSupabase } from '@/integrations/supabase/client';

const supabaseUrl = 'https://owizlmihkzhenphfpmpj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93aXpsbWloa3poZW5waGZwbXBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MjgxNTUsImV4cCI6MjA1NTQwNDE1NX0.XllTzNSicqLmolIigCnMi-Sa64RntePDixZjohgh5gQ';

// Add error checking to provide better error messages
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please make sure you have provided valid Supabase credentials.'
  );
}

// Use the integration client if available, otherwise create a new client
export const supabase = typeof integrationSupabase !== 'undefined' 
  ? integrationSupabase 
  : createClient(supabaseUrl, supabaseKey);
