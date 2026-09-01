"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { PhoneCall, TrendingUp, Sparkles, Heart } from "lucide-react";

const STAGE_COUNT = 7;

function useStageProgress(progress: any, index: number) {
  const start = index / STAGE_COUNT;
  const end = (index + 1) / STAGE_COUNT;
  const fadeIn = start + (end - start) * 0.15;
  const fadeOut = end - (end - start) * 0.15;

  const opacity = useTransform(
    progress,
    [start, fadeIn, fadeOut, end],
    [0, 1, 1, 0]
  );
  const y = useTransform(progress, [start, fadeIn], [24, 0]);

  return { opacity, y };
}

export default function MorningBriefingStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.5,
  });

  const stage0 = useStageProgress(progress, 0);
  const stage1 = useStageProgress(progress, 1);
  const stage2 = useStageProgress(progress, 2);
  const stage3 = useStageProgress(progress, 3);
  const stage4 = useStageProgress(progress, 4);
  const stage5 = useStageProgress(progress, 5);
  const stage6 = useStageProgress(progress, 6);

  const timeLabel = now
    ? now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : "";

  const partners = ["Nimbus Retail", "Lyra Health", "VoxCore", "Anchorpoint", "Solace Bank", "Fernway"];

  return (
    <section ref={containerRef} className="relative h-[700vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* mini floating nav, local to this section */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-2 text-sm">
          <span className="font-bold text-white">
            FUTUR<span className="text-orange-500">i</span>OS
          </span>
          <span className="rounded-full bg-orange-500 text-black text-xs font-semibold px-3 py-1">
            Live
          </span>
        </div>

        <div className="relative max-w-md w-full mx-auto text-center">

          {/* Stage 0 — greeting with live clock */}
          <motion.div
            style={{ opacity: stage0.opacity, y: stage0.y }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <span className="mb-6 inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs uppercase tracking-widest text-orange-400">
              Welcome back
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold leading-snug text-white">
              Good morning! Here's your voice summary from today at{" "}
              <span className="text-orange-500">{timeLabel || "..."}</span>
            </h2>
          </motion.div>

          {/* Stage 1 — calls handled */}
          <motion.div
            style={{ opacity: stage1.opacity, y: stage1.y }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <PhoneCall className="text-orange-500 mb-4" size={28} />
            <h2 className="text-3xl sm:text-4xl font-bold leading-snug text-white">
              You've got <span className="text-orange-500">42 calls</span> handled today,
              with <span className="text-orange-500">89%</span> resolved on first contact.
            </h2>
          </motion.div>

          {/* Stage 2 — response time */}
          <motion.div
            style={{ opacity: stage2.opacity, y: stage2.y }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <TrendingUp className="text-orange-500 mb-4" size={28} />
            <h2 className="text-3xl sm:text-4xl font-bold leading-snug text-white">
              Your average response time dropped{" "}
              <span className="text-orange-500">18%</span> this week.
            </h2>
          </motion.div>

          {/* Stage 3 — spotlight insight card with CTA */}
          <motion.div
            style={{ opacity: stage3.opacity, y: stage3.y }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-6"
          >
            <div className="flex items-center gap-2 text-white text-2xl font-bold">
              <Sparkles size={22} className="text-orange-500" />
              Agent Spotlight
            </div>
            <p className="text-lg text-gray-300 leading-relaxed">
              63% of missed calls happen after 6 PM.
            </p>
            <button className="rounded-full bg-orange-500 text-black text-sm font-semibold px-6 py-3 hover:bg-orange-400 transition">
              Enable 24/7 coverage
            </button>
          </motion.div>

          {/* Stage 4 — sentiment win */}
          <motion.div
            style={{ opacity: stage4.opacity, y: stage4.y }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <Heart className="text-green-400 mb-4" size={28} />
            <h2 className="text-3xl sm:text-4xl font-bold leading-snug text-white">
              Sentiment win: customer satisfaction improved{" "}
              <span className="text-green-400">12%</span> this month.
            </h2>
          </motion.div>

          {/* Stage 5 — trusted by strip */}
          <motion.div
            style={{ opacity: stage5.opacity, y: stage5.y }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-8">
              Trusted by teams like
            </p>
            <div className="grid grid-cols-2 gap-x-10 gap-y-8 text-gray-500">
              {partners.map((name) => (
                <span key={name} className="text-lg font-semibold">
                  {name}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Stage 6 — phone mockup */}
          <motion.div
            style={{ opacity: stage6.opacity, y: stage6.y }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <div className="w-[220px] rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-3 shadow-2xl">
              <div className="rounded-[1.5rem] bg-black border border-white/10 p-4">
                <p className="text-xs text-gray-500 mb-3">Futurios AI</p>
                <div className="space-y-2">
                  <div className="rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-gray-300">
                    Front Desk Assistant <span className="text-green-400">● Live</span>
                  </div>
                  <div className="rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-gray-300">
                    Sales Agent <span className="text-green-400">● Live</span>
                  </div>
                  <div className="rounded-lg bg-orange-500/10 px-3 py-2 text-xs text-orange-400">
                    94% success rate today
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-6 text-gray-400 text-sm max-w-xs">
              Everything your agents hear, understand, and resolve — in one dashboard.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}