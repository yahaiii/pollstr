import React from "react";
import { AuthContext } from "@/context/AuthContext";
import { User } from "@/types";

export function withProviders(
  ui: React.ReactNode,
  {
    user = null,
    session = null,
  }: { user?: User | null; session?: any } = {}
) {
  return (
    <AuthContext.Provider value={{ user, session }}>
      {ui}
    </AuthContext.Provider>
  );
}
