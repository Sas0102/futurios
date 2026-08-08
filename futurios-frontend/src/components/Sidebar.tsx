"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  clearAuthSession,
  getStoredUser,
} from "@/features/auth/utils/authStorage";
import { LoginResponse } from "@/features/auth/types/auth";


const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "▣",
  },
  {
    name: "Voice Agents",
    href: "/dashboard/voice-agents",
    icon: "◉",
  },
  {
    name: "Calls",
    href: "/dashboard/calls",
    icon: "☎",
  },
  {
    name: "Appointments",
    href: "/dashboard/appointments",
    icon: "A",
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: "▥",
  },
  {
    name: "Knowledge Base",
    href: "/dashboard/knowledge-base",
    icon: "?",
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: "⚙",
  },
];


export default function Sidebar() {

  const router = useRouter();
  const [user, setUser] = useState<LoginResponse["user"] | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setUser(getStoredUser());
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    router.push("/login");
  };


  return (

    <aside
      className="
        w-72
        min-h-screen
        bg-white
        border-r
        border-gray-200
        px-6
        py-8
        flex
        flex-col
      "
    >



      {/* Logo */}

      <Link
        href="/"
        className="
          text-3xl
          font-bold
          mb-12
          text-gray-900
          tracking-tight
        "
      >

        Futurios
        <span className="text-orange-500">
          {" "}AI
        </span>

      </Link>





      {/* Navigation */}

      <nav className="space-y-3">


        {
          menuItems.map((item)=>(

            <Link

              key={item.name}

              href={item.href}

              className="
                flex
                items-center
                gap-4
                px-4
                py-3
                rounded-xl
                text-gray-700
                text-base
                font-medium
                transition
                hover:bg-orange-50
                hover:text-orange-600
              "

            >

              <span
                className="
                  text-lg
                "
              >
                {item.icon}
              </span>


              <span>
                {item.name}
              </span>


            </Link>

          ))
        }


      </nav>






      {/* Bottom User Section */}

      <div
        className="
          mt-auto
          border-t
          border-gray-200
          pt-6
        "
      >

        <div
          className="
            rounded-xl
            bg-orange-50
            p-4
          "
        >

          <p
            className="
              font-semibold
              text-gray-900
            "
          >
            {user?.full_name ?? "Futurios Admin"}
          </p>


          <p
            className="
              text-sm
              text-gray-500
              mt-1
            "
          >
            {user?.email ?? "AI Voice Platform"}
          </p>

          <button
            type="button"
            onClick={handleLogout}
            className="
              mt-4
              text-sm
              font-medium
              text-orange-600
              hover:text-orange-700
            "
          >
            Logout
          </button>


        </div>


      </div>




    </aside>

  );

}
