"use client";
import React from 'react';

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/supabase";

// The rest of the component...

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const displayName = (user?.user_metadata?.name as string | undefined) || user?.email || "User";
  const initial = displayName.charAt(0).toUpperCase();
  const avatarUrl = (user?.user_metadata?.avatar_url as string | undefined) || (user?.user_metadata?.picture as string | undefined);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/polls");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Close menu on route change (basic pathname watch)
  React.useEffect(() => { setMenuOpen(false); }, [pathname]);

  const NavLinks = () => (
    <>
      <Link href="/polls">
        <Button variant={pathname === "/polls" ? "default" : "ghost"} className="w-full justify-start md:w-auto">
          Polls
        </Button>
      </Link>
      <Link href="/create-poll">
        <Button variant={pathname === "/create-poll" ? "default" : "ghost"} className="w-full justify-start md:w-auto">
          Create Poll
        </Button>
      </Link>
    </>
  );

  const AuthSection = () => (
    user ? (
      <div className="flex items-center gap-4 w-full md:w-auto">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={32}
            height={32}
            className="rounded-full object-cover border"
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-medium border"
            aria-label={displayName}
            title={displayName}
          >
            {initial}
          </div>
        )}
        <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full md:w-auto">Sign Out</Button>
      </div>
    ) : (
      <div className="flex flex-col gap-2 w-full md:flex-row md:w-auto">
        <Button variant="outline" size="sm" asChild className="w-full md:w-auto">
          <Link href="/auth/login">Sign In</Link>
        </Button>
        <Button size="sm" asChild className="w-full md:w-auto">
          <Link href="/auth/register">Sign Up</Link>
        </Button>
      </div>
    )
  );

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 flex items-center justify-between h-20 sm:h-16">
        <div className="flex items-center gap-4 flex-1 py-2">
          <Link href="/polls" className="text-2xl font-bold py-2 px-2 rounded-md hover:bg-accent focus:bg-accent transition-colors">
            Pollstr
          </Link>
        </div>
        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <NavLinks />
          <AuthSection />
        </div>
        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center w-12 h-12 rounded-lg border hover:bg-accent focus:bg-accent transition-colors"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span className="sr-only">Menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-7 h-7"
          >
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>
      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden border-t bg-background px-4 pb-8 pt-6 animate-in fade-in slide-in-from-top-2">
          {/* Navigation links - centered */}
          <div className="flex flex-col items-center gap-4 pt-2 pb-4">
            <NavLinks />
          </div>
          {/* Divider */}
          <div className="border-t my-4" />
          {/* Account section - centered */}
          <div className="flex flex-col items-center gap-3 pt-2">
            {user ? (
              <>
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    width={48}
                    height={48}
                    className="rounded-full object-cover border mb-2"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-lg font-medium border mb-2"
                    aria-label={displayName}
                    title={displayName}
                  >
                    {initial}
                  </div>
                )}
                <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full min-h-[44px]">Sign Out</Button>
              </>
            ) : (
              <div className="flex flex-col gap-2 w-full">
                <Button variant="outline" size="sm" asChild className="w-full min-h-[44px]">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild className="w-full min-h-[44px]">
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}