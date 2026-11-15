import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/** True only when a project URL and anon key were present at build time. */
export const isSupabaseConfigured = Boolean(envUrl && envKey);

const SUPABASE_URL = envUrl || 'https://placeholder.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = envKey || 'placeholder-key';

if (!isSupabaseConfigured) {
  console.warn('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Supabase operations will fail.');
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  }
});