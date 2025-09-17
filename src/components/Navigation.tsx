"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const pathname = usePathname();
  
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
          <Link href="/auth/login">
            <Button variant="outline">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}