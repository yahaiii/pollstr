import { PollList } from "@/components/PollList";

// This would typically come from an API or database
const mockPolls = [
  {
    id: "1",
    title: "Favorite Programming Language",
    description: "What's your go-to programming language?",
    options: [
      { id: "1", text: "JavaScript", votes: 0 },
      { id: "2", text: "Python", votes: 0 },
      { id: "3", text: "TypeScript", votes: 0 },
    ],
    createdAt: new Date(),
    createdBy: "user1",
  },
  {
    id: "2",
    title: "Best Frontend Framework",
    description: "Which frontend framework do you prefer?",
    options: [
      { id: "1", text: "React", votes: 0 },
      { id: "2", text: "Vue", votes: 0 },
      { id: "3", text: "Angular", votes: 0 },
    ],
    createdAt: new Date(),
    createdBy: "user1",
  },
];

export default function PollsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Polls</h1>
      <PollList polls={mockPolls} />
    </div>
  );
}