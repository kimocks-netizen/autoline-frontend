import { createClient } from '@supabase/supabase-js';

// Environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xvsrfwezxirnbjukthwj.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2c3Jmd2V6eGlybmJqdWt0aHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNzIxNTcsImV4cCI6MjA2NzY0ODE1N30.hfFRQO6t3NnVOCMpE2XSNQAFEpokLfVMPur46J9yM4g';

// Debug logging (remove in production)
if (import.meta.env.DEV) {
  console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET');
  console.log("VITE_SUPABASE_KEY:", import.meta.env.VITE_SUPABASE_KEY ? 'SET' : 'NOT SET');
  console.log("Using fallback values:", !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_KEY);
}

// Validate environment variables
/*if (!import.meta.env.VITE_SUPABASE_URL) {
  console.error('VITE_SUPABASE_URL is not set. Please add it to your .env file.');
}

if (!import.meta.env.VITE_SUPABASE_KEY) {
  console.error('VITE_SUPABASE_KEY is not set. Please add it to your .env file.');
}*/

export const supabase = createClient(supabaseUrl, supabaseKey);
