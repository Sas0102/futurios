"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import StackedOptionsWidget from "./StackedOptionsWidget";

// =====================================================
// FEATURE DATA — Futurios AI Voice Agent Platform
// =====================================================

type Feature = {
  number: string;
  title: string;
  description: string;
  widget: React.ReactNode;
};

const FEATURES: Feature[] = [
  {
    number: "01",
    title: "Call Routing",
    description:
      "Your AI agent decides in real time — transfer, book, or resolve — so customers never sit in a queue.",

    widget: (
      <StackedOptionsWidget
        options={[
          { label: "Leave a voicemail" },
          { label: "Schedule a callback" },
          {
            label: "Transfer to a human agent",
            active: true,
          },
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

    widget: (
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
        <p className="text-[10px] text-gray-400">
          Customer sentiment
        </p>

        <p className="mt-1 text-2xl font-semibold text-orange-400">
          +12%
        </p>
      </div>
    ),
  },

  {
    number: "03",
    title: "24/7 Coverage",
    description:
      "63% of missed calls happen after 6PM. Your agent doesn't clock out — it's always on shift.",

    widget: (
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
        <p className="text-[10px] text-gray-400">
          Missed calls after 6PM
        </p>

        <p className="mt-1 text-2xl font-semibold text-white">
          63%
        </p>
      </div>
    ),
  },

  {
    number: "04",
    title: "Business Intelligence",
    description:
      "Every call becomes a data point — spot trends across conversations to make better decisions, faster.",

    widget: (
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
        <p className="text-[10px] text-gray-400">
          Calls handled today
        </p>

        <p className="mt-1 text-2xl font-semibold text-white">
          42
        </p>
      </div>
    ),
  },
];

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function VideoHeroFeatureCard() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Reference to this section
  const sectionRef = useRef<HTMLElement>(null);

  // Prevent multiple feature changes from one fast scroll
  const lastScrollTime = useRef(0);

  // =====================================================
  // SCROLL-BASED FEATURE CHANGE
  // =====================================================

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const handleWheel = (event: WheelEvent) => {
      const now = Date.now();

      // Prevent scrolling from changing multiple
      // features too quickly
      if (now - lastScrollTime.current < 650) {
        return;
      }

      // Ignore tiny wheel movements
      if (Math.abs(event.deltaY) < 10) {
        return;
      }

      // -------------------------------------------------
      // Check whether the Video Hero is currently visible
      // -------------------------------------------------

      const rect = section.getBoundingClientRect();

      const sectionIsVisible =
        rect.top < window.innerHeight * 0.6 &&
        rect.bottom > window.innerHeight * 0.4;

      if (!sectionIsVisible) {
        return;
      }

      lastScrollTime.current = now;

      // -------------------------------------------------
      // Scroll DOWN → next feature
      // -------------------------------------------------

      if (event.deltaY > 0) {
        setActiveIndex((currentIndex) => {
          return Math.min(
            currentIndex + 1,
            FEATURES.length - 1
          );
        });
      }

      // -------------------------------------------------
      // Scroll UP → previous feature
      // -------------------------------------------------

      else {
        setActiveIndex((currentIndex) => {
          return Math.max(currentIndex - 1, 0);
        });
      }
    };

    window.addEventListener("wheel", handleWheel, {
      passive: true,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // =====================================================
  // RESET TO FEATURE 01 WHEN ENTERING THE SECTION
  // =====================================================

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveIndex(0);
        }
      },
      {
        threshold: 0.6,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  // =====================================================
  // CURRENT FEATURE
  // =====================================================

  const active = FEATURES[activeIndex];

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section
      ref={sectionRef}
      className="
        relative
        h-screen
        w-full
        overflow-hidden
        bg-black
      "
    >
      {/* =================================================
          BACKGROUND VIDEO
      ================================================= */}

      <video
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
        "
        src="/videos/hero-background.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* =================================================
          DARK OVERLAY
      ================================================= */}

      <div
        className="
          absolute
          inset-0
          bg-black/30
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
        {/* =================================================
            FEATURE CONTENT
        ================================================= */}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
          >
            {/* =================================================
                FEATURE NUMBER
            ================================================= */}

            <p
              className="
                text-xs
                font-medium
                text-orange-400
              "
            >
              {active.number}
            </p>

            {/* =================================================
                FEATURE TITLE
            ================================================= */}

            <h3
              className="
                mt-2
                text-2xl
                font-semibold
                text-white
              "
            >
              {active.title}
            </h3>

            {/* =================================================
                FEATURE DESCRIPTION
            ================================================= */}

            <p
              className="
                mt-3
                text-sm
                leading-relaxed
                text-gray-300
              "
            >
              {active.description}
            </p>

            {/* =================================================
                LEARN MORE
            ================================================= */}

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

            {/* =================================================
                WIDGET
            ================================================= */}

            <div className="mt-6">
              {active.widget}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* =================================================
            PROGRESS INDICATORS
        ================================================= */}

        <div className="mt-6 flex gap-2">
          {FEATURES.map((feature, index) => (
            <button
              key={feature.number}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="
                relative
                h-1
                flex-1
                overflow-hidden
                rounded-full
                bg-white/15
              "
              aria-label={`Show feature ${index + 1}`}
            >
              <motion.div
                className="
                  absolute
                  inset-y-0
                  left-0
                  rounded-full
                  bg-orange-500
                "
                animate={{
                  width:
                    index === activeIndex
                      ? "100%"
                      : "0%",
                }}
                transition={{
                  duration: 0.25,
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}