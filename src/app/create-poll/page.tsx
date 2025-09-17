import { PollForm } from "@/components/PollForm";

export default function CreatePollPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Create New Poll</h1>
      <div className="max-w-2xl mx-auto">
        <PollForm />
      </div>
    </div>
  );
}