


import { PollList } from "@/components/PollList";
import { getPolls } from "@/lib/supabase";
import { Poll } from "@/types";
import Link from "next/link";


type SearchParams = { page?: string } | Promise<{ page?: string }>;

function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
  return !!value && typeof (value as unknown as { then?: unknown }).then === 'function';
}

export default async function PollsPage({ searchParams }: { searchParams?: SearchParams }) {
  const PAGE_SIZE = 20;
  // Await searchParams if it's a Promise (Next.js 15+ dynamic API)
  const params = isPromise(searchParams) ? await searchParams : searchParams || {};
  const page = Number(params.page) > 0 ? Number(params.page) : 1;
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