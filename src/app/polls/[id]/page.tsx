import { getPoll } from "@/lib/supabase";
import { PollVoting } from "@/components/PollVoting";
import { notFound } from "next/navigation";

export default async function PollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pollId = parseInt(id);
  
  if (isNaN(pollId)) {
    notFound();
  }

  const poll = await getPoll(pollId);

  if (!poll) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{poll.title}</h1>
          <p className="text-lg text-muted-foreground mb-4">{poll.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Created by {poll.createdBy}</span>
            <span>•</span>
            <span>{poll.createdAt.toLocaleDateString()}</span>
            <span>•</span>
            <span>{poll.options.length} options</span>
          </div>
        </div>
        
        <PollVoting poll={poll} />
      </div>
    </div>
  );
}