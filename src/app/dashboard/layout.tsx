"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/features/auth/services/authService";
import {
  clearAuthSession,
  getAccessToken,
  storeCurrentUser,
} from "@/features/auth/utils/authStorage";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }

    getCurrentUser()
      .then((user) => {
        storeCurrentUser(user);
        setCheckingAuth(false);
      })
      .catch(() => {
        clearAuthSession();
        router.replace("/login");
      });
  }, [router]);

  if (checkingAuth) {
    return <div className="min-h-screen bg-gray-100" />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 lg:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}