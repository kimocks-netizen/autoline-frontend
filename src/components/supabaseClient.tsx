import { createClient } from '@supabase/supabase-js';

// Environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cfmpqxtsrbkoxohubjof.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmbXBxeHRzcmJrb3hvaHViam9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0MjM0MDYsImV4cCI6MjA5OTk5OTQwNn0.ppZOa35DiSiK0z78m1wCyG8oRIoa1u-DELIFFWPI-H4';

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
