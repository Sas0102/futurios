"use client";

import Link from "next/link";
import { useState } from "react";
import BookDemoModal from "@/components/BookDemoModal";
import { useCurrentUser } from "@/hooks/useCurrentUser";


const navLinks = [
  {
    label: "Products",
    href: "#",
  },
  {
    label: "Solutions",
    href: "/plans",
  },
  {
    label: "Analytics",
    href: "/analytics",
  },
];


export default function Navbar() {
  const [demoOpen, setDemoOpen] = useState(false);
  const { isSuperAdmin } = useCurrentUser();

  return (
    <>
      <nav
        className="
          flex
          items-center
          justify-between
          px-10
          py-6
          border-b
          border-white/10
        "
      >

        {/* Logo */}
        <Link
          href="/"
          className="
            text-2xl
            font-bold
            text-white
          "
        >
          FUTUR
          <span className="text-orange-500">
            i
          </span>
          OS AI
        </Link>



        {/* Navigation */}

        <div
          className="
            hidden
            md:flex
            items-center
            gap-8
            text-gray-300
          "
        >

          {navLinks.map((item) => (

            <Link
              key={item.label}
              href={item.href}
              className="
                hover:text-white
                transition
              "
            >
              {item.label}
            </Link>

          ))}

          {isSuperAdmin && (
            <Link
              href="/admin/organisations"
              className="
                hover:text-white
                transition
              "
            >
              Admin
            </Link>
          )}

        </div>



        {/* Buttons */}

        <div className="flex gap-4">


          {/* Login */}

          <Link
            href="/login"
            className="
              px-5
              py-2
              rounded-lg
              border
              border-white/20
              hover:border-orange-500
              transition
            "
          >
            Login
          </Link>



          {/* Book a Demo */}

          <button
            onClick={() => setDemoOpen(true)}
            className="
              px-5
              py-2
              rounded-lg
              bg-orange-500
              text-black
              font-semibold
              hover:bg-orange-400
              transition
            "
          >
            Book a Demo
          </button>


        </div>


      </nav>

      <BookDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}