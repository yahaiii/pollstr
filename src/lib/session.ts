import { createServerClient } from '@/lib/supabase';

// Minimal server-side session fetcher.
// Returns the authenticated user id or null.
export async function getServerSessionUserId(): Promise<string | null> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) return null;
    return data.session?.user?.id ?? null;
  } catch {
    return null;
  }
}
