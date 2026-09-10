"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import BookDemoModal from "@/components/BookDemoModal";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const navLinks = [
  { label: "Solutions", href: "/plans" },
  { label: "Company", href: "/company" },
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
  const [mobileOpen, setMobileOpen] = useState(false);
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

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        ref={menuRef}
        className="
          relative
          flex
          items-center
          justify-between
          px-4
          py-4
          sm:px-6
          md:px-10
          md:py-6
          border-b
          border-white/10
        "
      >
        {/* Logo */}
        <Link href="/" className="text-xl sm:text-2xl font-bold text-white">
          FUTUR
          <span className="text-orange-500">i</span>
          OS AI
        </Link>

        {/* Desktop navigation */}

        <div className="hidden md:flex items-center gap-8 text-gray-300">
          {/* Products — dropdown trigger */}
          <button
            onClick={() => setProductsOpen((prev) => !prev)}
            className="flex items-center gap-1 hover:text-white transition"
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

        {/* Desktop buttons */}

        <div className="hidden sm:flex gap-3 md:gap-4">
          <Link
            href="/login"
            className="
              px-4
              py-2
              md:px-5
              rounded-lg
              border
              border-white/20
              hover:border-orange-500
              transition
              text-sm
              md:text-base
            "
          >
            Login
          </Link>

          <button
            onClick={() => setDemoOpen(true)}
            className="
              px-4
              py-2
              md:px-5
              rounded-lg
              bg-orange-500
              text-black
              font-semibold
              hover:bg-orange-400
              transition
              text-sm
              md:text-base
            "
          >
            Book a Demo
          </button>
        </div>

        {/* Mobile hamburger trigger */}

        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            border
            border-white/15
            text-white
            sm:hidden
          "
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* =================================================
            PRODUCTS MEGA-MENU (desktop only)
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
                hidden
                w-[min(94vw,980px)]
                -translate-x-1/2
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-[#0a0a0a]
                p-8
                shadow-[0_30px_100px_rgba(0,0,0,0.65)]
                md:block
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

      {/* =====================================================
          MOBILE DRAWER (nav links + buttons, below sm)
      ===================================================== */}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] sm:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="
                absolute
                right-0
                top-0
                h-full
                w-[82%]
                max-w-xs
                overflow-y-auto
                border-l
                border-white/10
                bg-[#0a0a0a]
                p-6
              "
            >
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-bold text-white"
                >
                  FUTUR<span className="text-orange-500">i</span>OS AI
                </Link>

                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="
                    flex h-9 w-9 items-center justify-center rounded-lg
                    border border-white/15 text-white
                  "
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-8 flex flex-col gap-1 text-base text-gray-300">
                <Link
                  href="/products"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-3 hover:bg-white/5 hover:text-white"
                >
                  Products
                </Link>

                {navLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-3 hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}

                {isSuperAdmin && (
                  <Link
                    href="/admin/organisations"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-3 hover:bg-white/5 hover:text-white"
                  >
                    Admin
                  </Link>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="
                    rounded-lg border border-white/20 px-5 py-3
                    text-center text-white hover:border-orange-500
                  "
                >
                  Login
                </Link>

                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setDemoOpen(true);
                  }}
                  className="
                    rounded-lg bg-orange-500 px-5 py-3
                    text-center font-semibold text-black hover:bg-orange-400
                  "
                >
                  Book a Demo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BookDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}