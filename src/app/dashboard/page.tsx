import { redirect } from 'next/navigation';
import { getServerSessionUserId } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Always display minimal dashboard for debugging
  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="text-muted-foreground">This is the dashboard. If you see this, routing works.</p>
      <div className="mt-8 space-y-4 text-sm">
        <p>🧩 Next: restore session logic once confirmed.</p>
      </div>
    </div>
  );
}
