import { getPoll } from "@/lib/supabase";
import { PollVoting } from "@/components/PollVoting";
import { notFound } from "next/navigation";
import PollOwnerActions from "@/components/PollOwnerActions";
import { PollShareModal } from "@/components/PollShareModal";

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
    <div className="container mx-auto py-4 px-0 sm:py-6 md:py-8">
      <div className="max-w-full sm:max-w-2xl md:max-w-4xl mx-auto px-0">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 break-words">{poll.title}</h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-3 sm:mb-4 whitespace-pre-line break-words">{poll.description}</p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs sm:text-sm md:text-base text-muted-foreground">
            <span>Created by {poll.createdBy}</span>
            <span className="hidden sm:inline">•</span>
            <span>{poll.createdAt.toLocaleDateString()}</span>
            <span className="hidden sm:inline">•</span>
            <span>{poll.options.length} options</span>
            <div className="w-full flex flex-col gap-2 mt-4 sm:mt-0 sm:flex-row sm:items-center sm:w-auto">
              <PollOwnerActions poll={poll} />
              <PollShareModal pollId={poll.id} />
            </div>
          </div>
        </div>
        
        <PollVoting poll={poll} />
      </div>
    </div>
  );
}