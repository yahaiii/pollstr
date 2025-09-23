'use client';

import { PollForm } from "@/components/PollForm";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CreatePollPage() {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, router]);

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Create New Poll</h1>
      <div className="max-w-2xl mx-auto">
        <PollForm />
      </div>
    </div>
  );
}