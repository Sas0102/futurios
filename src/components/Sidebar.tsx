"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: "▣" },
  { name: "Voice Agents", href: "/dashboard/voice-agents", icon: "◉" },
  { name: "Calls", href: "/dashboard/calls", icon: "☎" },
  { name: "Appointments", href: "/dashboard/appointments", icon: "📅" },
  { name: "Analytics", href: "/dashboard/analytics", icon: "▥" },
  { name: "Knowledge Base", href: "/dashboard/knowledge-base", icon: "📚" },
  { name: "Settings", href: "/dashboard/settings", icon: "⚙" },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col px-6 py-8">
      {/* Logo */}
      <Link
        href="/"
        className="mb-10 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl sm:mb-12"
      >
        Futurios
        <span className="text-orange-500"> AI</span>
      </Link>

      {/* Navigation */}
      <nav className="space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={`
                flex items-center gap-4 rounded-xl px-4 py-3 text-base font-medium transition
                ${
                  active
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom User Section */}
      <div className="mt-auto border-t border-gray-200 pt-6">
        <div className="rounded-xl bg-orange-50 p-4">
          <p className="font-semibold text-gray-900">Futurios Admin</p>
          <p className="mt-1 text-sm text-gray-500">AI Voice Platform</p>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* =====================================================
          MOBILE TOP BAR (visible below lg)
      ===================================================== */}
      <header
        className="
          sticky top-0 z-40 flex items-center justify-between
          border-b border-gray-200 bg-white px-4 py-3
          lg:hidden
        "
      >
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
          Futurios<span className="text-orange-500"> AI</span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="
            flex h-10 w-10 items-center justify-center rounded-lg
            border border-gray-200 text-gray-700 active:bg-gray-100
          "
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* =====================================================
          DESKTOP SIDEBAR (static, lg and up)
      ===================================================== */}
      <aside
        className="
          hidden lg:flex lg:w-72 lg:min-h-screen lg:flex-col
          border-r border-gray-200 bg-white
        "
      >
        <SidebarContent />
      </aside>

      {/* =====================================================
          MOBILE DRAWER (overlay, below lg)
      ===================================================== */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Drawer panel */}
          <div
            className="
              absolute left-0 top-0 h-full w-[82%] max-w-xs
              bg-white shadow-2xl
              animate-in slide-in-from-left duration-200
            "
          >
            <div className="flex items-center justify-end px-4 pt-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="
                  flex h-9 w-9 items-center justify-center rounded-lg
                  border border-gray-200 text-gray-700 active:bg-gray-100
                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}