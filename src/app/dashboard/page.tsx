// import { createServerClient } from "@/lib/supabase"; // Already imported below
import { redirect } from "next/navigation";
import type { Poll } from "@/types";

// import { cookies } from "next/headers"; // Uncomment and use for session extraction in production
import { createServerClient } from "@/lib/supabase";

async function getUserSession() {
  // Get Supabase session from cookies (App Router)
  // See https://supabase.com/docs/guides/auth/server-side for details
  // Use cookies to extract session
  const supabase = createServerClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session?.user?.id) {
    return { userId: null };
  }
  return { userId: session.user.id };
}

async function getUserPolls(userId: string): Promise<Poll[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("polls")
    .select("*, poll_options (*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((poll: {
    id: number;
    title: string;
    description: string;
    created_at: string;
    created_by: string;
    user_id: string;
    poll_options: Array<{
      id: number;
      text: string;
      votes: number;
    }>;
  }) => ({
    id: poll.id,
    title: poll.title,
    description: poll.description,
    createdAt: new Date(poll.created_at),
    createdBy: poll.created_by,
    userId: poll.user_id,
    options: poll.poll_options.map((option) => ({
      id: option.id,
      text: option.text,
      votes: option.votes,
    })),
  }));
}

async function getUserVotedPolls(userId: string): Promise<Poll[]> {
  const supabase = createServerClient();
  // Get poll_ids user has voted on
  const { data: votes, error: votesError } = await supabase
    .from("votes")
    .select("poll_id")
    .eq("user_id", userId);
  if (votesError || !votes?.length) return [];
  const pollIds = votes.map((v: { poll_id: number }) => v.poll_id);
  // Get polls by those ids
  const { data: polls, error: pollsError } = await supabase
    .from("polls")
    .select("*, poll_options (*)")
    .in("id", pollIds);
  if (pollsError || !polls) return [];
  return polls.map((poll: {
    id: number;
    title: string;
    description: string;
    created_at: string;
    created_by: string;
    user_id: string;
    poll_options: Array<{
      id: number;
      text: string;
      votes: number;
    }>;
  }) => ({
    id: poll.id,
    title: poll.title,
    description: poll.description,
    createdAt: new Date(poll.created_at),
    createdBy: poll.created_by,
    userId: poll.user_id,
    options: poll.poll_options.map((option) => ({
      id: option.id,
      text: option.text,
      votes: option.votes,
    })),
  }));
}

import { DashboardTabs } from "@/components/DashboardTabs";

export default async function DashboardPage() {
  const session = await getUserSession();
  if (!session?.userId) {
    redirect("/auth/login");
  }
  const myPolls = await getUserPolls(session.userId);
  const votedPolls = await getUserVotedPolls(session.userId);

  return (
    <div className="container mx-auto py-6 px-2 sm:px-4 max-w-2xl">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900 dark:text-white tracking-tight">My Dashboard</h1>
      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">My Polls</h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
            <DashboardTabs myPolls={myPolls} votedPolls={votedPolls} />
          </div>
        </section>
      </div>
    </div>
  );
}
