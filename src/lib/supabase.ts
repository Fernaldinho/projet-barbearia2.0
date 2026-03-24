import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Helper to validate URL
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

const finalUrl = isValidUrl(supabaseUrl) 
  ? supabaseUrl 
  : 'https://placeholder.supabase.co';

if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
  // Supabase not configured - client will use placeholder
}

export const supabase = createClient(
  finalUrl,
  supabaseAnonKey || 'placeholder-key'
)
