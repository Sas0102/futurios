"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      className="
        relative
        overflow-hidden
        min-h-[85vh]
        flex
        items-center
        justify-center
        px-6
        pt-20
      "
    >
      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-full
            border
            border-orange-500/30
            bg-orange-500/10
            text-orange-400
            text-sm
            mb-10
          "
        >
          <Zap size={16} />
          AI Powered Voice Automation Platform
        </motion.div>

        {/* =================================================
            HEADLINE — mixed-weight line, then one oversized
            full-width word underneath (REVER-style)
        ================================================= */}

        <h1 className="uppercase leading-[0.95] tracking-tight">
          {/* Line 1 — smaller, mixed weight, italic accent word */}
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="
              block
              text-3xl
              sm:text-4xl
              md:text-5xl
              font-bold
              text-white
            "
          >
            Giving{" "}
            <span className="italic text-orange-500">superhuman</span>{" "}
            voices to
          </motion.span>

          {/* Line 2 — the giant word, solid orange */}
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="
              block
              mt-1
              text-[16vw]
              leading-[0.85]
              sm:text-[13vw]
              md:text-[10vw]
              lg:text-[8.5vw]
              font-extrabold
              text-orange-500
              tracking-tighter
            "
          >
            Businesses
          </motion.span>
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="
            mt-8
            max-w-2xl
            mx-auto
            text-lg
            leading-relaxed
            text-gray-400
          "
        >
          Futurios helps organisations create, manage and deploy
          AI-powered voice assistants for customer support,
          sales and business automation.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center mt-10"
        >
          <Link
            href="/signup"
            className="
              group
              inline-flex
              items-center
              gap-2
              px-6
              py-3.5
              rounded-full
              bg-orange-500
              text-black
              font-semibold
              text-sm
              uppercase
              tracking-wide
              hover:bg-orange-400
              transition-all
              duration-200
              hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]
            "
          >
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
            Start Building
          </Link>
        </motion.div>
      </div>
    </section>
  );
}