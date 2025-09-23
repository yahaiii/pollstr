


import { PollList } from "@/components/PollList";
import { getPolls } from "@/lib/supabase";
import { Poll } from "@/types";
import Link from "next/link";

export default async function PollsPage({ searchParams }: { searchParams?: { page?: string } }) {
  const PAGE_SIZE = 20;
  const safeParams = searchParams || {};
  const page = Number(safeParams.page) > 0 ? Number(safeParams.page) : 1;
  let polls: Poll[] = [];
  let error: string | null = null;

  try {
    polls = await getPolls({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE });
  } catch (err) {
    console.error("Error fetching polls:", err);
    error = "Failed to load polls. Please check your database connection.";
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Polls</h1>
      {error ? (
        <div className="text-red-600 bg-red-50 p-4 rounded-md">
          {error}
          <p className="text-sm mt-2">
            Make sure your Supabase database is set up correctly and the tables exist.
          </p>
        </div>
      ) : (
        <>
          <PollList polls={polls} />
          <div className="flex justify-center gap-4 mt-8">
            <Link href={`/polls?page=${page - 1}`} passHref legacyBehavior>
              <button className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50" disabled={page <= 1}>
                Previous
              </button>
            </Link>
            <Link href={`/polls?page=${page + 1}`} passHref legacyBehavior>
              <button className="px-4 py-2 rounded bg-gray-200" disabled={polls.length < PAGE_SIZE}>
                Next
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}