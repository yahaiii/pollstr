"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut, getCurrentUser, onAuthStateChange } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { ClientOnly } from "./ClientOnly";

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { name?: string } } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Listen to auth state changes
    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
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
          
          <ClientOnly
            fallback={<div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />}
          >
            {isLoading ? (
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
            ) : user ? (
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
          </ClientOnly>
        </div>
      </div>
    </nav>
  );
}