export default function PollPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Poll Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {/* Poll details will go here */}
        <p>Poll ID: {params.id}</p>
      </div>
    </div>
  );
}