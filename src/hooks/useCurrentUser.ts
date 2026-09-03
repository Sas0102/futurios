"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type User = {
  id: number;
  name: string;
  email: string;
  is_super_admin: boolean;
  [key: string]: any;
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
      .get("/auth/me") // TODO: confirm real path with backend
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