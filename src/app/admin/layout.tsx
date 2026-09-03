"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Building2, MessageSquare } from "lucide-react";

const SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_ADMIN_AUTH === "true";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, isSuperAdmin } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";
  const effectivelySuperAdmin = SKIP_AUTH || isSuperAdmin;

  useEffect(() => {
    if (isLoginPage || SKIP_AUTH) return;
    if (!isLoading && !isSuperAdmin) {
      router.replace("/admin/login");
    }
  }, [isLoading, isSuperAdmin, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!SKIP_AUTH && isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  if (!effectivelySuperAdmin) {
    return null;
  }

  const adminLinks = [
    { label: "Organisations", href: "/admin/organisations", icon: Building2 },
    { label: "Demo Requests", href: "/admin/demo-requests", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex bg-black">
      {SKIP_AUTH && (
        <div className="fixed bottom-4 right-4 z-50 rounded-full bg-red-500/90 backdrop-blur-sm text-black text-xs font-semibold px-3 py-1.5 shadow-lg">
          ⚠ Admin auth bypassed
        </div>
      )}

      <aside className="w-60 border-r border-white/10 p-6">
        <p className="text-lg font-bold text-white mb-1">
          FUTUR<span className="text-orange-500">i</span>OS
        </p>
        <p className="text-xs text-gray-500 mb-8">Super Admin</p>

        <nav className="flex flex-col gap-1">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  active
                    ? "bg-orange-500/10 text-orange-400"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}