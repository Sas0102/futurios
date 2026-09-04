"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const columnVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-black text-white">
      {/* Background Grid */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.025]
          [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)]
          [background-size:60px_60px]
        "
      />

      {/* Orange Glow */}
      <motion.div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-[300px]
          w-[700px]
          -translate-x-1/2
          rounded-full
          bg-orange-500/[0.07]
          blur-[120px]
        "
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Top hairline that draws itself in on view */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-x-0 top-0 h-px origin-center bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
        {/* Main Footer Content */}
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <motion.div
            custom={0}
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Logo */}
            <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
              <Link href="/" className="inline-flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight">
                  Futurios
                </span>

                <span className="text-2xl font-bold text-orange-500">
                  AI
                </span>
              </Link>
            </motion.div>

            {/* Description */}
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/40">
              Build intelligent AI voice agents that
              automate conversations, connect with
              customers, and help your business grow.
            </p>

            {/* Social Links */}
            <div className="mt-7 flex items-center gap-3">
              <SocialButton href="https://github.com" label="GitHub">
                <span className="text-xs font-semibold">Git</span>
              </SocialButton>

              <SocialButton href="https://linkedin.com" label="LinkedIn">
                <span className="text-xs font-semibold">in</span>
              </SocialButton>

              <SocialButton href="https://twitter.com" label="X / Twitter">
                <span className="text-sm font-semibold">𝕏</span>
              </SocialButton>
            </div>
          </motion.div>

          {/* Product */}
          <FooterColumn
            index={1}
            title="Product"
            links={[
              { label: "Features", href: "#features" },
              { label: "How it works", href: "#how-it-works" },
              { label: "Dashboard", href: "/demo" },
              { label: "Get started", href: "/signup" },
            ]}
          />

          {/* Company */}
          <FooterColumn
            index={2}
            title="Company"
            links={[
              { label: "About", href: "#about" },
              { label: "Contact", href: "#contact" },
              { label: "Careers", href: "#careers" },
              { label: "Blog", href: "#blog" },
            ]}
          />

          {/* Resources */}
          <FooterColumn
            index={3}
            title="Resources"
            links={[
              { label: "Documentation", href: "#docs" },
              { label: "Privacy", href: "#privacy" },
              { label: "Terms", href: "#terms" },
              { label: "Support", href: "#support" },
            ]}
          />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="
            mt-16
            overflow-hidden
            rounded-3xl
            border
            border-white/[0.08]
            bg-white/[0.035]
            p-6
            backdrop-blur-xl
            sm:p-8
          "
        >
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-lg font-semibold">
                Ready to build your AI voice agent?
              </p>

              <p className="mt-1 text-sm text-white/40">
                Start building with Futurios AI today.
              </p>
            </div>

            <Link href="/signup">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="
                  group
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-orange-500
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-black
                  transition-all
                  duration-200
                  hover:bg-orange-400
                  hover:shadow-[0_0_30px_rgba(249,115,22,0.25)]
                "
              >
                Start Building

                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Bottom Divider — grows in from the center */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mt-10 origin-center border-t border-white/[0.07]"
        />

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="
            flex
            flex-col
            items-center
            justify-between
            gap-4
            pt-7
            text-xs
            text-white/30
            sm:flex-row
          "
        >
          <p>
            © {new Date().getFullYear()} Futurios AI.
            All rights reserved.
          </p>

          <p className="flex items-center gap-1">
            Built with intelligence
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-orange-500"
            >
              ✦
            </motion.span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

/* ---------------------------------- */
/* Footer Column                       */
/* ---------------------------------- */

function FooterColumn({
  title,
  links,
  index,
}: {
  title: string;
  links: { label: string; href: string }[];
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={columnVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <h3 className="text-sm font-semibold text-white">{title}</h3>

      <div className="mt-5 space-y-3">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="
              group
              flex
              w-fit
              items-center
              gap-1
              text-sm
              text-white/40
              transition-colors
              duration-200
              hover:text-orange-400
            "
          >
            {link.label}

            <ArrowUpRight
              size={13}
              className="
                -translate-x-1
                opacity-0
                transition-all
                duration-200
                group-hover:translate-x-0
                group-hover:opacity-100
              "
            />
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

/* ---------------------------------- */
/* Social Button                       */
/* ---------------------------------- */

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-lg
        border
        border-white/[0.08]
        bg-white/[0.035]
        text-white/40
        transition-all
        duration-200
        hover:border-orange-500/30
        hover:bg-orange-500/10
        hover:text-orange-400
      "
    >
      {children}
    </motion.a>
  );
}