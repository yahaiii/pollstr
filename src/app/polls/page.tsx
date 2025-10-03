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
    <div className="container mx-auto py-6 md:py-8 px-0">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">Polls</h1>
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
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-8">
            {page > 1 ? (
              <Link
                href={`/polls?page=${page - 1}`}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-center"
              >
                Previous
              </Link>
            ) : (
              <span className="px-4 py-2 rounded bg-gray-200 opacity-50 cursor-not-allowed text-center">
                Previous
              </span>
            )}
            {polls.length >= PAGE_SIZE ? (
              <Link
                href={`/polls?page=${page + 1}`}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-center"
              >
                Next
              </Link>
            ) : (
              <span className="px-4 py-2 rounded bg-gray-200 opacity-50 cursor-not-allowed text-center">
                Next
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}