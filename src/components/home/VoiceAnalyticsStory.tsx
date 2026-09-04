"use client";

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import {
  PhoneCall,
  TrendingUp,
  Sparkles,
  Heart,
  BarChart3,
  MessageSquare,
} from "lucide-react";

// =====================================================
// WORD ANIMATION COMPONENT
// =====================================================

function AnimatedWords({
  words,
  progress,
  start,
  duration = 0.015,
}: {
  words: string[];
  progress: any;
  start: number;
  duration?: number;
}) {
  return (
    <>
      {words.map((word, index) => (
        <AnimatedWord
          key={`${word}-${index}`}
          word={word}
          progress={progress}
          start={start}
          end={start + duration}
        />
      ))}
    </>
  );
}

// =====================================================
// ANIMATED WORD
// =====================================================

function AnimatedWord({
  word,
  progress,
  start,
  end,
}: {
  word: string;
  progress: any;
  start: number;
  end: number;
}) {
  const color = useTransform(
    progress,
    [start, end],
    ["#374151", "#ffffff"]
  );

  return (
    <motion.span
      style={{ color }}
      className="inline"
    >
      {word}{" "}
    </motion.span>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function VoiceAnalyticsStory() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // =====================================================
  // STAGE OPACITY + SLIDE
  // A tight fade width (0.01) instead of a wide overlap
  // means panels essentially swap rather than dissolve
  // into each other, and the paired "y" transform adds a
  // slide so it reads as a page transition, not a blend.
  // =====================================================

  const FADE = 0.01;

  function useStageMotion(start: number, end: number) {
    const hasPreFade = start - FADE >= 0;
    const hasPostFade = end + FADE <= 1;

    const inputs = [
      ...(hasPreFade ? [start - FADE] : []),
      start,
      end,
      ...(hasPostFade ? [end + FADE] : []),
    ];

    const opacityOutputs = [
      ...(hasPreFade ? [0] : []),
      1,
      0.9999,
      ...(hasPostFade ? [0] : []),
    ];

    const yOutputs = [
      ...(hasPreFade ? [40] : []),
      0,
      0.0001,
      ...(hasPostFade ? [-40] : []),
    ];

    const opacity = useTransform(scrollYProgress, inputs, opacityOutputs);
    const y = useTransform(scrollYProgress, inputs, yOutputs);
    const visibility = useTransform(opacity, (o) =>
      o > 0.01 ? ("visible" as const) : ("hidden" as const)
    );
    return { opacity, y, visibility };
  }

  const stage0 = useStageMotion(0, 0.14);
  const stage1 = useStageMotion(0.155, 0.28);
  const stage2 = useStageMotion(0.295, 0.41);
  const stage3 = useStageMotion(0.425, 0.545);
  const stage4 = useStageMotion(0.565, 0.69);
  const stage5 = useStageMotion(0.705, 0.83);
  const stage6 = useStageMotion(0.845, 0.92);

  const finalOpacity = useTransform(
    scrollYProgress,
    [0.91, 0.94],
    [0, 1]
  );
  const finalY = useTransform(
    scrollYProgress,
    [0.91, 0.94],
    [40, 0]
  );

  // =====================================================
  // TEXT CONTENT
  // =====================================================

  const greeting = [
    "Good",
    "morning! 🌤️",
  ];

  const summary = [
    "HERE'S",
    "YOUR",
    "VOICE",
    "AGENT",
    "SUMMARY",
    "FROM",
    "TODAY",
    "🕐",
  ];

  const calls = [
    "You've",
    "got",
    "42",
    "customer",
    "calls",
    "handled",
    "today.",
    "With",
    "a",
    "93%",
    "success",
    "rate.",
  ];

  const response = [
    "Your",
    "response",
    "time",
    "improved",
    "18%",
    "this",
    "week.",
  ];

  const missedCalls = [
    "63%",
    "of",
    "missed",
    "calls",
    "happen",
    "after",
    "6",
    "PM.",
  ];

  const sentiment = [
    "Customers",
    "are",
    "12%",
    "happier",
    "this",
    "month.",
  ];

  const intelligence = [
    "Futurios",
    "spots",
    "what",
    "matters",
    "across",
    "every",
    "call.",
  ];

  // =====================================================
  // HEADING
  // =====================================================

  const headingClass = `
    w-full
    max-w-5xl
    mx-auto
    px-4
    text-center
    text-[28px]
    leading-[1.15]
    font-medium
    tracking-[-0.035em]
    sm:text-[36px]
    md:text-[46px]
    lg:text-[54px]
  `;

  // Shared classes for each full-bleed, opaque stage panel.
  // bg-black is the important addition here — it stops the
  // stage behind it from showing through during the swap.
  const panelClass = `
    absolute
    inset-0
    z-10
    flex
    flex-col
    items-center
    justify-center
    bg-black
  `;

  return (
    <section
      ref={containerRef}
      className="relative h-[700vh] -mt-20"
    >
      {/* =================================================
          STICKY SCREEN
      ================================================= */}

      <div
        className="
          sticky
          top-0
          h-screen
          flex
          items-center
          justify-center
          px-6
          overflow-hidden
          bg-black
        "
      >
        {/* =================================================
            ORANGE BACKGROUND GLOW
        ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            w-[500px]
            h-[500px]
            rounded-full
            bg-orange-500/[0.08]
            blur-[140px]
          "
        />

        {/* =================================================
            CONTENT
        ================================================= */}

        <div
          className="
            relative
            w-full
            h-full
            max-w-6xl
            text-center
          "
        >
          {/* =================================================
              STAGE 0 — WELCOME
          ================================================= */}

          <motion.div
            style={{ opacity: stage0.opacity, y: stage0.y, visibility: stage0.visibility }}
            className={panelClass}
          >
            <motion.div
              whileHover={{
                scale: 1.05,
              }}
              transition={{
                duration: 0.2,
              }}
              className="
                mb-8
                inline-flex
                items-center
                rounded-full
                border
                border-orange-500/30
                bg-orange-500/[0.08]
                px-5
                py-2
                text-xs
                uppercase
                tracking-[0.3em]
                text-orange-400
                cursor-default
                transition-shadow
                duration-200
                hover:shadow-[0_0_30px_rgba(249,115,22,0.18)]
              "
            >
              Welcome to Futurios
            </motion.div>

            <h2 className={headingClass}>
              <AnimatedWords
                words={greeting}
                progress={scrollYProgress}
                start={0.005}
                duration={0.015}
              />
            </h2>

            <p
              className="
                mt-6
                text-xs
                uppercase
                tracking-[0.25em]
                text-gray-600
              "
            >
              HERE'S YOUR FUTURIOS AI VOICE AGENT SUMMARY FROM TODAY 🕐
            </p>
          </motion.div>

          {/* =================================================
              STAGE 1 — SUMMARY
          ================================================= */}

          <motion.div
            style={{ opacity: stage1.opacity, y: stage1.y, visibility: stage1.visibility }}
            className={panelClass}
          >
            <PhoneCall
              size={30}
              strokeWidth={1.7}
              className="
                mb-7
                text-orange-500
              "
            />

            <h2 className={headingClass}>
              <AnimatedWords
                words={summary}
                progress={scrollYProgress}
                start={0.155}
                duration={0.015}
              />
            </h2>

            <p
              className="
                mt-8
                max-w-xl
                px-4
                text-sm
                leading-relaxed
                text-gray-600
              "
            >
              YOUR AI VOICE AGENTS ARE KEEPING UP WITH YOUR
              CUSTOMERS — SO YOUR TEAM DOESN'T HAVE TO.
            </p>
          </motion.div>

          {/* =================================================
              STAGE 2 — CALLS
          ================================================= */}

          <motion.div
            style={{ opacity: stage2.opacity, y: stage2.y, visibility: stage2.visibility }}
            className={panelClass}
          >
            <TrendingUp
              size={30}
              strokeWidth={1.7}
              className="
                mb-7
                text-orange-500
              "
            />

            <h2 className={headingClass}>
              <AnimatedWords
                words={calls}
                progress={scrollYProgress}
                start={0.295}
                duration={0.015}
              />
            </h2>

            <p
              className="
                mt-8
                max-w-xl
                px-4
                text-sm
                leading-relaxed
                text-gray-600
              "
            >
              93% SUCCESS RATE — YOUR AI AGENTS ARE
              HANDLING CONVERSATIONS WITHOUT MAKING YOUR
              CUSTOMERS WAIT.
            </p>

            <div
              className="
                mt-6
                rounded-full
                border
                border-orange-500/20
                bg-orange-500/[0.06]
                px-5
                py-2
                text-xs
                uppercase
                tracking-[0.2em]
                text-orange-400
              "
            >
              93% SUCCESS RATE
            </div>
          </motion.div>

          {/* =================================================
              STAGE 3 — RESPONSE TIME
          ================================================= */}

          <motion.div
            style={{ opacity: stage3.opacity, y: stage3.y, visibility: stage3.visibility }}
            className={panelClass}
          >
            <Sparkles
              size={30}
              strokeWidth={1.7}
              className="
                mb-7
                text-orange-500
              "
            />

            <h2 className={headingClass}>
              <AnimatedWords
                words={response}
                progress={scrollYProgress}
                start={0.425}
                duration={0.015}
              />
            </h2>

            <p
              className="
                mt-8
                max-w-xl
                px-4
                text-sm
                leading-relaxed
                text-gray-600
              "
            >
              FASTER RESPONSES. HAPPIER CUSTOMERS.
              YOUR AI AGENTS ARE HELPING CUSTOMERS GET
              ANSWERS WITHOUT THE WAIT.
            </p>

            <div
              className="
                mt-6
                flex
                items-center
                gap-2
                text-xs
                uppercase
                tracking-[0.2em]
                text-gray-600
              "
            >
              <TrendingUp
                size={14}
                className="text-orange-500"
              />

              FASTER RESPONSES. HAPPIER CUSTOMERS.
            </div>
          </motion.div>

          {/* =================================================
              STAGE 4 — MISSED CALLS
          ================================================= */}

          <motion.div
            style={{ opacity: stage4.opacity, y: stage4.y, visibility: stage4.visibility }}
            className={panelClass}
          >
            <Heart
              size={30}
              strokeWidth={1.7}
              className="
                mb-7
                text-orange-500
              "
            />

            <h2 className={headingClass}>
              <AnimatedWords
                words={missedCalls}
                progress={scrollYProgress}
                start={0.565}
                duration={0.015}
              />
            </h2>

            <p
              className="
                mt-8
                max-w-xl
                px-4
                text-sm
                leading-relaxed
                text-gray-600
              "
            >
              FUTURIOS SPOTLIGHT: YOUR BUSIEST HOURS ARE
              AFTER 6 PM. DON'T LET THOSE CALLS GO UNANSWERED.
            </p>

            <button
              className="
                mt-9
                rounded-full
                border
                border-orange-500/30
                bg-orange-500
                px-6
                py-3
                text-sm
                font-semibold
                text-black
                transition-all
                duration-200
                hover:bg-orange-400
                hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]
              "
            >
              Enable 24/7 coverage
            </button>
          </motion.div>

          {/* =================================================
              STAGE 5 — SENTIMENT
          ================================================= */}

          <motion.div
            style={{ opacity: stage5.opacity, y: stage5.y, visibility: stage5.visibility }}
            className={panelClass}
          >
            <Heart
              size={30}
              strokeWidth={1.7}
              className="
                mb-7
                text-orange-500
              "
            />

            <h2 className={headingClass}>
              <AnimatedWords
                words={sentiment}
                progress={scrollYProgress}
                start={0.705}
                duration={0.015}
              />
            </h2>

            <p
              className="
                mt-8
                max-w-xl
                px-4
                text-sm
                leading-relaxed
                text-gray-600
              "
            >
              CUSTOMERS ARE 12% HAPPIER THIS MONTH.
              SEE WHAT'S WORKING ACROSS YOUR CONVERSATIONS.
            </p>

            <div
              className="
                mt-6
                flex
                items-center
                gap-2
                text-xs
                uppercase
                tracking-[0.2em]
                text-gray-600
              "
            >
              <Heart
                size={14}
                className="text-orange-500"
              />

              CUSTOMER SATISFACTION
            </div>
          </motion.div>

          {/* =================================================
              STAGE 6 — BUSINESS INTELLIGENCE
          ================================================= */}

          <motion.div
            style={{ opacity: stage6.opacity, y: stage6.y, visibility: stage6.visibility }}
            className={panelClass}
          >
            <BarChart3
              size={30}
              strokeWidth={1.7}
              className="
                mb-7
                text-orange-500
              "
            />

            <h2 className={headingClass}>
              <AnimatedWords
                words={intelligence}
                progress={scrollYProgress}
                start={0.845}
                duration={0.015}
              />
            </h2>

            <p
              className="
                mt-8
                max-w-xl
                px-4
                text-sm
                leading-relaxed
                text-gray-600
              "
            >
              FUTURIOS HELPS YOU SEE WHAT MATTERS ACROSS
              EVERY CALL — SO YOU CAN MAKE BETTER DECISIONS.
            </p>

            <div
              className="
                mt-10
                flex
                items-center
                gap-3
                text-xs
                uppercase
                tracking-[0.25em]
                text-gray-600
              "
            >
              <MessageSquare
                size={15}
                className="text-orange-500"
              />

              Conversations → Insights
            </div>
          </motion.div>

          {/* =================================================
              FINAL DASHBOARD
          ================================================= */}

          <motion.div
            style={{ opacity: finalOpacity, y: finalY }}
            className="
              absolute
              inset-0
              z-20
              flex
              flex-col
              items-center
              justify-center
              bg-black
            "
          >
            {/* Dashboard mockup */}

            <div
              className="
                w-[280px]
                sm:w-[320px]
                rounded-[2rem]
                border
                border-white/10
                bg-[#080808]
                p-3
                shadow-[0_20px_80px_rgba(0,0,0,0.7)]
              "
            >
              <div
                className="
                  rounded-[1.5rem]
                  border
                  border-white/[0.08]
                  bg-black
                  p-5
                "
              >
                {/* Dashboard header */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-5
                  "
                >
                  <div className="text-left">
                    <p className="text-xs text-gray-500">
                      Futurios AI
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      Voice Dashboard
                    </p>
                  </div>

                  <div
                    className="
                      h-2
                      w-2
                      rounded-full
                      bg-orange-500
                      shadow-[0_0_10px_rgba(249,115,22,0.6)]
                    "
                  />
                </div>

                {/* Calls */}

                <div
                  className="
                    mb-2
                    rounded-xl
                    border
                    border-white/[0.06]
                    bg-white/[0.03]
                    p-3
                    text-left
                  "
                >
                  <p className="text-[10px] text-gray-500">
                    Calls handled
                  </p>

                  <p className="mt-1 text-lg font-semibold text-white">
                    42
                  </p>
                </div>

                {/* Success */}

                <div
                  className="
                    mb-2
                    rounded-xl
                    border
                    border-white/[0.06]
                    bg-white/[0.03]
                    p-3
                    text-left
                  "
                >
                  <p className="text-[10px] text-gray-500">
                    First-contact resolution
                  </p>

                  <p className="mt-1 text-lg font-semibold text-white">
                    89%
                  </p>
                </div>

                {/* Sentiment */}

                <div
                  className="
                    mb-2
                    rounded-xl
                    border
                    border-white/[0.06]
                    bg-white/[0.03]
                    p-3
                    text-left
                  "
                >
                  <p className="text-[10px] text-gray-500">
                    Customer sentiment
                  </p>

                  <p className="mt-1 text-lg font-semibold text-orange-400">
                    +12%
                  </p>
                </div>

                {/* AI insight */}

                <div
                  className="
                    mt-3
                    rounded-xl
                    bg-orange-500/[0.08]
                    border
                    border-orange-500/10
                    p-3
                    text-left
                  "
                >
                  <p className="text-[10px] text-orange-400">
                    AI Insight
                  </p>

                  <p className="mt-1 text-[11px] leading-relaxed text-gray-400">
                    Peak missed calls detected after 6 PM.
                  </p>
                </div>
              </div>
            </div>

            {/* Final text */}

            <h2
              className="
                mt-8
                max-w-3xl
                px-4
                text-2xl
                sm:text-3xl
                md:text-4xl
                font-medium
                tracking-[-0.025em]
                leading-tight
                text-white
              "
            >
              One dashboard.
              <br />
              Every call.
              <br />
              <span className="text-orange-500">
                Better decisions.
              </span>
            </h2>

            <p
              className="
                mt-5
                max-w-lg
                px-4
                text-sm
                leading-relaxed
                text-gray-500
              "
            >
              From the first hello to the final insight,
              Futurios turns every customer conversation
              into measurable business intelligence.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}