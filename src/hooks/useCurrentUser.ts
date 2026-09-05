"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type User = {
  id: number;
  full_name: string;
  email: string;
  is_super_admin: boolean;
};

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    if (!token) {
      setIsLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  return {
    user,
    isLoading,
    isSuperAdmin: user?.is_super_admin ?? false,
  };
}
