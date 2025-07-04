"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useUserStore } from "@/hooks/zustand/use-user-store";
import { useEffect } from "react";

function UserSessionSync() {
  const { data: session } = useSession();
  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);
  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    } else {
      clearUser();
    }
  }, [session, setUser, clearUser]);
  return null;
}

export default function SessionClientProvider({ children }) {
  return (
    <SessionProvider>
      <UserSessionSync />
      {children}
    </SessionProvider>
  );
}
