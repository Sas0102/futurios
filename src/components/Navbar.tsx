"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import BookDemoModal from "@/components/BookDemoModal";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const navLinks = [
  {
    label: "Solutions",
    href: "/plans",
  },
  {
    label: "Company",
    href: "/company",
  },
];

// =====================================================
// PRODUCTS MEGA-MENU DATA
// Same four pillars used on the homepage feature card,
// kept consistent across the site.
// =====================================================

const productCards = [
  {
    title: "Call Routing",
    href: "/products/call-routing",
    description:
      "Your AI agent decides in real time — transfer, book, or resolve — so customers never sit in a queue.",
  },
  {
    title: "Live Analytics",
    href: "/products/analytics",
    description:
      "See sentiment, response time, and missed-call patterns the moment they happen.",
  },
  {
    title: "24/7 Coverage",
    href: "/products/coverage",
    description:
      "Your agent doesn't clock out — never miss a call after hours again.",
  },
  {
    title: "Business Intelligence",
    href: "/products/intelligence",
    description:
      "Every call becomes a data point — spot trends to make better decisions, faster.",
  },
];

export default function Navbar() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const { isSuperAdmin } = useCurrentUser();

  const menuRef = useRef<HTMLDivElement>(null);

  // Close the dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setProductsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav
        ref={menuRef}
        className="
          relative
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
        <Link href="/" className="text-2xl font-bold text-white">
          FUTUR
          <span className="text-orange-500">i</span>
          OS AI
        </Link>

        {/* Navigation */}

        <div className="hidden md:flex items-center gap-8 text-gray-300">
          {/* Products — dropdown trigger */}
          <button
            onClick={() => setProductsOpen((prev) => !prev)}
            className="
              flex
              items-center
              gap-1
              hover:text-white
              transition
            "
          >
            Products
            <ChevronDown
              size={15}
              className={`transition-transform duration-200 ${
                productsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="hover:text-white transition"
            >
              {item.label}
            </Link>
          ))}

          {isSuperAdmin && (
            <Link
              href="/admin/organisations"
              className="hover:text-white transition"
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

        {/* =================================================
            PRODUCTS MEGA-MENU
        ================================================= */}

        <AnimatePresence>
          {productsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -14, scale: 0.94, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, scale: 0.95, filter: "blur(6px)" }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              style={{ transformOrigin: "top center" }}
              className="
                absolute
                left-1/2
                top-full
                z-50
                mt-3
                w-[min(94vw,980px)]
                -translate-x-1/2
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-[#0a0a0a]
                p-8
                shadow-[0_30px_100px_rgba(0,0,0,0.65)]
              "
            >
              {/* Top glow line, matches the card-top-light look elsewhere on the site */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-0
                  h-px
                  w-1/2
                  -translate-x-1/2
                  bg-gradient-to-r
                  from-transparent
                  via-orange-400
                  to-transparent
                "
              />

              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
                  },
                }}
                className="grid gap-5 sm:grid-cols-[1.15fr_1fr_1fr]"
              >
                {/* Featured card — Platform overview */}

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 14, scale: 0.97 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  whileHover={{ scale: 1.015 }}
                  className="row-span-2"
                >
                  <Link
                    href="/products"
                    onClick={() => setProductsOpen(false)}
                    className="
                      group
                      block
                      h-full
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.03]
                      p-6
                      transition-colors
                      duration-200
                      hover:border-orange-500/30
                      hover:bg-white/[0.05]
                    "
                  >
                    <h3 className="text-2xl font-bold tracking-tight text-white">
                      Platform
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-gray-400">
                      Grow your business with the all-in-one AI voice
                      agent platform.
                    </p>
                  </Link>
                </motion.div>

                {/* 2x2 grid of the four pillars */}

                {productCards.map((card) => (
                  <motion.div
                    key={card.title}
                    variants={{
                      hidden: { opacity: 0, y: 14, scale: 0.97 },
                      visible: { opacity: 1, y: 0, scale: 1 },
                    }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    whileHover={{ scale: 1.015 }}
                  >
                    <Link
                      href={card.href}
                      onClick={() => setProductsOpen(false)}
                      className="
                        group
                        block
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        p-6
                        transition-colors
                        duration-200
                        hover:border-orange-500/30
                        hover:bg-white/[0.05]
                      "
                    >
                      <h3 className="text-base font-bold tracking-tight text-white">
                        {card.title}
                      </h3>

                      <p className="mt-2.5 text-sm leading-relaxed text-gray-400">
                        {card.description}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {/* Tagline */}

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="mt-8 text-center text-sm leading-relaxed text-gray-500"
              >
                Futurios helps organisations create, manage and deploy
                AI-powered voice assistants for customer support,
                sales and business automation.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <BookDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}