import { AuthForm } from "@/components/AuthForm";
import { getServerSessionUserId } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const userId = await getServerSessionUserId();
  if (userId) {
    redirect("/dashboard");
  }
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Login</h1>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}