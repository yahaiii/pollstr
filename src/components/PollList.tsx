
"use client";
import React from 'react';

import { Poll } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface PollListProps {
  polls?: Poll[];
}

export function PollList({ polls = [] }: PollListProps) {
  if (polls.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No polls found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {polls.map((poll) => (
        <Link key={poll.id} href={`/polls/${poll.id}`}>
          <Card className="hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle>{poll.title}</CardTitle>
              <CardDescription>{poll.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {poll.options.length} options · Created {new Date(poll.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}