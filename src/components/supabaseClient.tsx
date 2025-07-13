import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvsrfwezxirnbjukthwj.supabase.co'; // Your project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2c3Jmd2V6eGlybmJqdWt0aHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNzIxNTcsImV4cCI6MjA2NzY0ODE1N30.hfFRQO6t3NnVOCMpE2XSNQAFEpokLfVMPur46J9yM4g';
export const supabase = createClient(supabaseUrl, supabaseKey);
