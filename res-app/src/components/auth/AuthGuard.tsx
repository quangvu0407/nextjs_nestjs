"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

const AuthGuard = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if ((session as any)?.error === "TokenExpired") {
      signOut({ callbackUrl: "/auth/login" });
    }
  }, [session]);

  return null;
};

export default AuthGuard;
