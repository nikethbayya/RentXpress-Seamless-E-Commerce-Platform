// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Supabase service role key and URL from your Supabase project settings
const supabaseUrl = process.env.REACT_APP_SUPABASE_PROJECT_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_API_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
