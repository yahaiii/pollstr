
import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

// Robust server-side session fetcher for Next.js App Router
export async function getServerSessionUserId(): Promise<string | null> {
  try {
    // Supabase session cookie name: sb-<project-ref>-auth-token
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) return null;
    const projectRefMatch = supabaseUrl.match(/^https?:\/\/([^.]+)\.supabase\.co/);
    if (!projectRefMatch) return null;
    const projectRef = projectRefMatch[1];
    const cookieName = `sb-${projectRef}-auth-token`;
  const cookieStore = await cookies();
  const raw = typeof cookieStore.get === 'function' ? cookieStore.get(cookieName)?.value : null;
    if (!raw) return null;
    let payload: { access_token?: string } | null = null;
    try { payload = JSON.parse(decodeURIComponent(raw)); } catch { payload = JSON.parse(raw); }
    if (!payload?.access_token) return null;
    const supabase = createServerClient();
    const { data, error } = await supabase.auth.getUser(payload.access_token);
    if (error || !data?.user?.id) return null;
    return data.user.id;
  } catch {
    return null;
  }
}
