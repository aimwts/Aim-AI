import { createClient } from '@supabase/supabase-js';

// process.env is now polyfilled by vite.config.ts
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Create a single supabase client for interacting with your database
// If keys are missing, we export null to trigger "Mock Mode" in services
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const isSupabaseConfigured = !!supabase;