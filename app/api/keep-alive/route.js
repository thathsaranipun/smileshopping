import { supabase } from '@/lib/supabase';

// Called daily by the Vercel cron in vercel.json so the free Supabase project never pauses.
export const dynamic = 'force-dynamic';

export async function GET() {
  const { count, error } = await supabase.from('categories').select('id', { count: 'exact', head: true });
  return Response.json({ ok: !error, categories: count ?? 0, at: new Date().toISOString() }, { status: error ? 500 : 200 });
}
