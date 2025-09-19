import { PollList } from "@/components/PollList";
import { getPolls } from "@/lib/supabase";
import { Poll } from "@/types";

export default async function PollsPage() {
  let polls: Poll[] = [];
  let error: string | null = null;

  try {
    polls = await getPolls();
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
        <PollList polls={polls} />
      )}
    </div>
  );
}