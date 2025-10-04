import { redirect } from 'next/navigation';
import { getServerSessionUserId } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const userId = await getServerSessionUserId();
  if (!userId) {
    redirect('/auth/login?next=/dashboard');
  }
  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="text-muted-foreground">Welcome back. We will progressively enhance this page with your polls, votes, and stats.</p>
      <div className="mt-8 space-y-4 text-sm">
        <p>✅ Auth session verified on the server.</p>
        <p>🧩 Next steps: add My Polls list, Voted Polls, then aggregate stats.</p>
      </div>
    </div>
  );
}
