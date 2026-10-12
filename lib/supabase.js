import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// One shared client. Public reads use row-level security; admin writes need a signed-in admin.
export const supabase = createClient(url, key, {
  auth: { persistSession: typeof window !== 'undefined', autoRefreshToken: true },
});
