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
        min-h-[70vh]
        flex
        items-center
        justify-center
        px-6
        pt-20
      "
    >

      {/* Hero Content */}
      <div
        className="
          relative
          z-10
          max-w-5xl
          mx-auto
          text-center
        "
      >

        {/* Badge */}
        <div
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
            mb-8
          "
        >
          <Zap size={16} />
          AI Powered Voice Automation Platform
        </div>

        {/* Heading */}
        <h1
          className="
            text-5xl
            md:text-7xl
            font-bold
            leading-tight
          "
        >
          <motion.span
            className="block"
            initial={{ opacity: 0.3, color: "#666666" }}
            whileInView={{ opacity: 1, color: "#ffffff" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Build Intelligent
          </motion.span>

          <motion.span
            className="block text-orange-500"
            initial={{ opacity: 0.3 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            AI Voice Agents
          </motion.span>

          <motion.span
            className="block"
            initial={{ opacity: 0.3, color: "#666666" }}
            whileInView={{ opacity: 1, color: "#ffffff" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            for Your Business
          </motion.span>
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0.3, color: "#666666" }}
          whileInView={{ opacity: 1, color: "#9ca3af" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="
            mt-8
            max-w-2xl
            mx-auto
            text-lg
            leading-relaxed
          "
        >
          Futurios helps organisations create, manage and deploy
          AI-powered voice assistants for customer support,
          sales and business automation.
        </motion.p>

        {/* Buttons */}
        <div
          className="
            flex
            justify-center
            gap-5
            mt-10
            flex-wrap
          "
        >
          <Link
            href="/product-demo"
            className="
              px-8
              py-4
              rounded-xl
              bg-orange-500
              text-black
              font-semibold
              hover:bg-orange-400
              transition
            "
          >
            Start Building
          </Link>

          <Link
            href="/signup"
            className="
              px-8
              py-4
              rounded-xl
              border
              border-white/20
              hover:border-orange-500
              transition
            "
          >
            Signup
          </Link>
        </div>

      </div>
    </section>
  );
}