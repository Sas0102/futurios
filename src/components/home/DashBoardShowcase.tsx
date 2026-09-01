"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import CountUp from "@/components/CountUp";

function StatCard({
  label,
  value,
  numericValue,
  suffix,
  index,
  progress,
}: {
  label: string;
  value: string;
  numericValue?: number;
  suffix?: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const direction = index % 2 === 0 ? -1 : 1;
  const x = useTransform(progress, [0, 1], [40 * direction, 0]);
  const rotate = useTransform(progress, [0, 1], [6 * direction, 0]);
  const opacity = useTransform(progress, [0, 1], [0, 1]);

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      className="rounded-2xl bg-[#111] border border-white/10 p-6"
    >
      <p className="text-gray-400 text-sm">{label}</p>
      <h3 className="text-3xl font-bold mt-4">
        {numericValue !== undefined ? (
          <CountUp value={numericValue} suffix={suffix} />
        ) : (
          value
        )}
      </h3>
      <div className="mt-5 h-1 rounded-full bg-orange-500 w-3/4" />
    </motion.div>
  );
}

export default function DashBoardShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.95", "start 0.35"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.5,
  });

  const scale = useTransform(smoothProgress, [0, 1], [0.85, 1]);
  const y = useTransform(smoothProgress, [0, 1], [140, 0]);
  const opacity = useTransform(smoothProgress, [0, 1], [0, 1]);
  const rotateX = useTransform(smoothProgress, [0, 1], [14, 0]);
  const rotateY = useTransform(smoothProgress, [0, 1], [-6, 0]);

  const tableY = useTransform(smoothProgress, [0, 1], [60, 0]);
  const tableOpacity = useTransform(smoothProgress, [0, 1], [0, 1]);

  const stats = [
    { label: "Total Calls", value: "1,240", numericValue: 1240 },
    { label: "Active Agents", value: "8", numericValue: 8 },
    { label: "Success Rate", value: "94%", numericValue: 94, suffix: "%" },
    { label: "Average Duration", value: "3m 42s" },
  ];

  return (
    <section ref={containerRef} className="relative mt-10 pb-40 px-6">
      <motion.div
        style={{
          scale,
          y,
          opacity,
          rotateX,
          rotateY,
          perspective: 1400,
          transformStyle: "preserve-3d",
        }}
        className="relative max-w-7xl mx-auto origin-top"
      >

        {/* Main dashboard window */}
        <div
          className="
            relative
            rounded-3xl
            overflow-hidden
            border
            border-white/10
            bg-[#090909]
            shadow-2xl
          "
        >

          {/* Browser top bar */}
          <div
            className="
              flex
              items-center
              justify-between
              px-6
              py-4
              border-b
              border-white/10
            "
          >
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>

            <p className="text-gray-400 text-sm">
              Futurios AI Platform
            </p>
          </div>

          {/* Dashboard content */}
          <div className="p-8 md:p-10">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  Dashboard
                </h2>
                <p className="text-gray-400 mt-2">
                  Monitor your AI Voice Platform
                </p>
              </div>

              <div className="flex items-center gap-2 text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Online
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid md:grid-cols-4 gap-5">
              {stats.map((stat, index) => (
                <StatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  numericValue={stat.numericValue}
                  suffix={stat.suffix}
                  index={index}
                  progress={smoothProgress}
                />
              ))}
            </div>

            {/* Recent calls table */}
            <motion.div
              style={{ y: tableY, opacity: tableOpacity }}
              className="
                mt-8
                rounded-2xl
                bg-[#111]
                border
                border-white/10
                p-6
              "
            >
              <h3 className="text-xl font-semibold mb-6">
                Recent Calls
              </h3>

              <div className="space-y-5 text-gray-300">
                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span>Front Desk Assistant</span>
                  <span className="text-green-400">Completed</span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span>Sales Agent</span>
                  <span className="text-red-400">Missed</span>
                </div>

                <div className="flex justify-between">
                  <span>Support Agent</span>
                  <span className="text-green-400">Completed</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}