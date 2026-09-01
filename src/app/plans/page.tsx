"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import PlanCard from "@/features/subscription/components/PlanCard";
import { plans } from "@/features/subscription/data/plans";

export default function PricingPage() {
  const router = useRouter();
  const defaultPlan = plans.find((p) => p.name === "Pro") ?? plans[0];
  const [selectedId, setSelectedId] = useState(defaultPlan.id);

  return (
    <div className="p-8 min-h-screen">
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center size-9 rounded-full border border-white/15 text-white hover:bg-white/5 hover:border-orange-500 transition"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-4xl font-bold text-white">Plans</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 max-w-6xl mx-auto items-stretch">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: (i % 2) * 0.15 }}
          >
            <PlanCard
              plan={plan}
              selected={plan.id === selectedId}
              onSelect={() => setSelectedId(plan.id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}