import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && (supabaseAnonKey || supabaseServiceKey),
);

let cachedServerClient: SupabaseClient | null = null;
let cachedAnonClient: SupabaseClient | null = null;

/**
 * Returns a server-side Supabase client using Service Role key for administrative operations.
 * Returns null if Supabase is not configured (graceful local fallback).
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  if (!isSupabaseConfigured || !supabaseUrl) return null;
  const key = supabaseServiceKey || supabaseAnonKey;
  if (!key) return null;

  if (!cachedServerClient) {
    cachedServerClient = createClient(supabaseUrl, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cachedServerClient;
}

export const getSupabaseAdminClient = getSupabaseServerClient;

/**
 * Returns a public anon client for client-side queries with RLS.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) return null;

  if (!cachedAnonClient) {
    cachedAnonClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return cachedAnonClient;
}
