"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import PlanCard from "@/features/subscription/components/PlanCard";
import { getPlans } from "@/features/subscription/data/plans";
import { Plan } from "@/features/subscription/types/subscription";
import { getApiErrorMessage } from "@/lib/apiError";

export default function PricingPage() {
  const router = useRouter();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPlans = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getPlans();
        setPlans(data);
        setSelectedId(
          data.find((plan) => plan.name === "pro")?.id ?? data[0]?.id ?? null
        );
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, "Unable to load plans."));
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="mb-10 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-orange-500 hover:bg-white/5"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-4xl font-bold text-white">Plans</h1>
      </div>

      {loading && (
        <div className="mx-auto max-w-6xl rounded-xl border border-white/10 bg-white/[0.03] p-6 text-gray-300">
          Loading plans...
        </div>
      )}

      {!loading && error && (
        <div className="mx-auto max-w-6xl rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && plans.length === 0 && (
        <div className="mx-auto max-w-6xl rounded-xl border border-white/10 bg-white/[0.03] p-6 text-gray-300">
          No active plans are available.
        </div>
      )}

      {!loading && !error && plans.length > 0 && (
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-x-10 gap-y-10 md:grid-cols-2">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: (index % 2) * 0.15 }}
            >
              <PlanCard
                plan={plan}
                selected={plan.id === selectedId}
                onSelect={() => setSelectedId(plan.id)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
