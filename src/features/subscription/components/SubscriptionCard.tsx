"use client";

import { useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/apiError";
import { getOrganisationUsage } from "@/features/dashboard/services/dashboardService";
import { getSubscription } from "../services/subscriptionService";
import { Subscription } from "../types/subscription";

const formatPrice = (price: number | null) =>
  price === null ? "Contact us" : `Rs. ${price.toLocaleString("en-IN")}/month`;

export default function SubscriptionCard({ organisationId }: { organisationId: number }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<{ total_agents: number; total_calls: number; calls_this_month: number } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      try {
        const [subscriptionData, usageData] = await Promise.all([
          getSubscription(organisationId),
          getOrganisationUsage(organisationId),
        ]);
        setSubscription(subscriptionData);
        setUsage(usageData);
      } catch (err) {
        setError(getApiErrorMessage(err, "Unable to load subscription details."));
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [organisationId]);

  if (error) return <p className="text-sm text-red-700">{error}</p>;
  if (!subscription || !usage) return <p className="text-sm text-gray-500">Loading subscription...</p>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div><p className="font-semibold text-gray-900">{subscription.plan.display_name}</p><p className="text-sm text-gray-500">{formatPrice(subscription.plan.price_per_month)}</p></div>
        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">Current plan</span>
      </div>
      <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 sm:grid-cols-2">
        <p>Calls this month: {usage.calls_this_month} / {subscription.plan.limits.max_calls_per_month ?? "Unlimited"}</p>
        <p>Agents: {usage.total_agents} / {subscription.plan.limits.max_agents ?? "Unlimited"}</p>
      </div>
    </div>
  );
}
