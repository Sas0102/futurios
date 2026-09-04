"use client";

import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import StackedOptionsWidget from "./StackedOptionsWidget";

// =====================================================
// FEATURE DATA — Futurios AI Voice Agent Platform
// =====================================================

type Feature = {
  number: string;
  title: string;
  description: string;
  widget: React.ReactNode;
  image: string;
};

const FEATURES: Feature[] = [
  {
    number: "01",
    title: "Call Routing",
    description:
      "Your AI agent decides in real time — transfer, book, or resolve — so customers never sit in a queue.",
    image: "/futurios1.jpg",
    widget: (
      <StackedOptionsWidget
        options={[
          { label: "Leave a voicemail" },
          { label: "Schedule a callback" },
          { label: "Transfer to a human agent", active: true },
          { label: "Resolve with FAQ answer" },
          { label: "End call" },
        ]}
      />
    ),
  },
  {
    number: "02",
    title: "Live Analytics",
    description:
      "See sentiment, response time, and missed-call patterns the moment they happen — not in tomorrow's report.",
    image: "/futurios2.jpg",
    widget: (
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
        <p className="text-[10px] text-gray-400">Customer sentiment</p>
        <p className="mt-1 text-2xl font-semibold text-orange-400">+12%</p>
      </div>
    ),
  },
  {
    number: "03",
    title: "24/7 Coverage",
    description:
      "63% of missed calls happen after 6PM. Your agent doesn't clock out — it's always on shift.",
    image: "/futurios3.jpg",
    widget: (
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
        <p className="text-[10px] text-gray-400">Missed calls after 6PM</p>
        <p className="mt-1 text-2xl font-semibold text-white">63%</p>
      </div>
    ),
  },
  {
    number: "04",
    title: "Business Intelligence",
    description:
      "Every call becomes a data point — spot trends across conversations to make better decisions, faster.",
    image: "/futurios4.jpg",
    widget: (
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
        <p className="text-[10px] text-gray-400">Calls handled today</p>
        <p className="mt-1 text-2xl font-semibold text-white">42</p>
      </div>
    ),
  },
];

export default function VideoHeroFeatureCard() {
  // Outer wrapper is tall (one screen-height per feature) — scrolling
  // through it is what drives which feature is "active". The inner
  // screen is `sticky`, so it stays pinned full-viewport for the
  // entire scroll range, then releases naturally once you scroll
  // past the wrapper's bottom (or back above its top).
  const wrapperRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const index = Math.min(
      FEATURES.length - 1,
      Math.floor(v * FEATURES.length)
    );
    setActiveIndex((prev) => (prev === index ? prev : index));
  });

  const active = FEATURES[activeIndex];

  return (
    <section
      ref={wrapperRef}
      className="relative w-full bg-black"
      style={{ height: `${FEATURES.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* =================================================
            BACKGROUND IMAGE
        ================================================= */}

        <AnimatePresence mode="sync">
          <motion.img
            key={active.image}
            src={active.image}
            alt=""
            className="absolute inset-0 z-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{
              opacity: { duration: 0.6, ease: "easeInOut" },
              scale: { duration: 1.2, ease: "easeOut" },
            }}
          />
        </AnimatePresence>

        {/* DARK OVERLAY */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-black/30" />

        {/* LEFT GRADIENT */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-10
            bg-gradient-to-r
            from-black/55
            via-black/20
            to-transparent
          "
        />

        {/* =================================================
            GLASS FEATURE CARD
        ================================================= */}

        <div
          className="
            absolute
            left-6
            top-24
            z-20
            w-[420px]
            max-w-[90vw]
            rounded-2xl
            border
            border-white/10
            bg-black/40
            p-6
            backdrop-blur-xl
          "
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <p className="text-xs font-medium text-orange-400">
                {active.number}
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-white">
                {active.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-gray-300">
                {active.description}
              </p>

              <button
                type="button"
                className="
                  mt-4
                  text-xs
                  uppercase
                  tracking-widest
                  text-orange-400
                  transition-colors
                  hover:text-orange-300
                "
              >
                Learn more
              </button>

              <div className="mt-6">{active.widget}</div>
            </motion.div>
          </AnimatePresence>

          {/* PROGRESS INDICATORS */}
          <div className="mt-6 flex gap-2">
            {FEATURES.map((feature, index) => (
              <button
                key={feature.number}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/15"
                aria-label={`Show feature ${index + 1}`}
              >
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-orange-500"
                  animate={{ width: index === activeIndex ? "100%" : "0%" }}
                  transition={{ duration: 0.25 }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}