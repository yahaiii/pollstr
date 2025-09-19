"use client";

import { useState, useEffect } from "react";
import { Poll } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { voteOnPoll, hasUserVoted, getCurrentUser } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ClientOnly } from "./ClientOnly";

interface PollVotingProps {
  poll: Poll;
}

export function PollVoting({ poll }: PollVotingProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { name?: string } } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUserAndVoteStatus = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          const voted = await hasUserVoted(poll.id, currentUser.id);
          setHasVoted(voted);
        }
      } catch (error) {
        console.error("Error checking user and vote status:", error);
      }
    };

    checkUserAndVoteStatus();
  }, [poll.id]);

  const handleVote = async () => {
    if (!selectedOption || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      await voteOnPoll(poll.id, selectedOption, user.id);
      setHasVoted(true);
      // Refresh the page to show updated vote counts
      router.refresh();
    } catch (error: unknown) {
      console.error("Error voting:", error);
      setError(error instanceof Error ? error.message : "Failed to vote");
    } finally {
      setIsLoading(false);
    }
  };

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  if (!user) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground mb-4">
            Please log in to vote on this poll
          </p>
          <Button onClick={() => router.push("/auth/login")}>
            Log In
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <ClientOnly
      fallback={
        <Card>
          <CardContent className="py-8 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      }
    >
      {hasVoted ? (
        <Card>
          <CardHeader>
            <CardTitle>Poll Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {poll.options.map((option) => {
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{option.text}</span>
                    <span>{option.votes} votes ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="pt-4 text-sm text-muted-foreground">
              Total votes: {totalVotes}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Cast Your Vote</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              {poll.options.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                    selectedOption === option.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="poll-option"
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={(e) => setSelectedOption(parseInt(e.target.value))}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedOption === option.id 
                      ? "border-blue-500 bg-blue-500" 
                      : "border-gray-300"
                  }`}>
                    {selectedOption === option.id && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                    )}
                  </div>
                  <span className="flex-1">{option.text}</span>
                </label>
              ))}
            </div>

            <Button
              onClick={handleVote}
              disabled={!selectedOption || isLoading}
              className="w-full"
            >
              {isLoading ? "Voting..." : "Vote"}
            </Button>
          </CardContent>
        </Card>
      )}
    </ClientOnly>
  );
}
