"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/supabase";

// The rest of the component...

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      // The user state will be automatically updated by the auth hook after signOut
      router.push("/polls");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  return (
    <nav className="border-b">
      <div className="container mx-auto flex items-center justify-between h-16">
        <Link href="/polls" className="text-xl font-bold">
          Pollstr
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/polls">
            <Button variant={pathname === "/polls" ? "default" : "ghost"}>
              Polls
            </Button>
          </Link>
          <Link href="/create-poll">
            <Button variant={pathname === "/create-poll" ? "default" : "ghost"}>
              Create Poll
            </Button>
          </Link>
          
          {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {user.user_metadata?.name || user.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            )}
        </div>
      </div>
    </nav>
  );
}