import React from "react";
import { AuthContext } from "@/context/AuthContext";
import type { User, Session } from '@supabase/supabase-js';

export function withProviders(
  ui: React.ReactNode,
  {
    user = null,
    session = null,
  }: { user?: User | null; session?: Session | null } = {}
) {
  return (
    <AuthContext.Provider value={{ user, session }}>
      {ui}
    </AuthContext.Provider>
  );
}
