"use client";

import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PlanCard({
  plan,
  selected,
  onSelect,
}: {
  plan: any;
  selected: boolean;
  onSelect: () => void;
}) {
  const features = [
    { label: "Agents", value: plan.limits.max_agents ?? "Unlimited" },
    { label: "FAQs", value: plan.limits.max_faqs ?? "Unlimited" },
    { label: "Team Members", value: plan.limits.max_team_members ?? "Unlimited" },
    { label: "API Access", value: plan.limits.api_access ? "Yes" : "No" },
  ];

  return (
    <div
      onClick={onSelect}
      className={cn(
        "relative flex flex-col h-full rounded-2xl border p-8 cursor-pointer",
        "bg-white/[0.03] backdrop-blur-sm transition-all duration-300",
        selected
          ? "border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.35)]"
          : "border-white/10 hover:border-white/20"
      )}
    >
      {plan.name === "Pro" && (
        <span className="absolute -top-3 left-8 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-black z-10">
          Most Popular
        </span>
      )}

      <h2 className="text-3xl font-bold text-white">{plan.name}</h2>

      <p className="mt-2 text-base text-gray-400">{plan.description}</p>

      <p className="mt-5 text-lg font-semibold text-orange-500">{plan.price}</p>

      <div className="mt-7 flex-1 space-y-4 text-base">
        {features.map((f) => (
          <div key={f.label} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-gray-300">
              <Check size={16} className="text-orange-500" />
              {f.label}
            </span>
            <span className="font-medium text-white">{f.value}</span>
          </div>
        ))}
      </div>

      <button
        className={cn(
          buttonVariants({
            variant: selected ? "default" : "outline",
            size: "lg",
          }),
          "mt-8 w-full"
        )}
      >
        Choose Plan
      </button>
    </div>
  );
}