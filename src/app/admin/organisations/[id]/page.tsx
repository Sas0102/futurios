"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type Usage = {
  organisation_id: number;
  total_agents: number;
  total_calls: number;
  calls_this_month: number;
};

type PlanLimits = {
  max_agents: number | null;
  max_calls_per_month: number | null;
  max_faqs: number | null;
  max_team_members: number | null;
  department_routing: boolean;
  api_access: boolean;
  analytics_retention_days: number | null;
};

type Subscription = {
  plan: {
    name: string;
    price_per_month: number | null;
    limits: PlanLimits;
  };
  [key: string]: any;
};

export default function OrgDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isLoading: userLoading, isSuperAdmin } = useCurrentUser();

  const [usage, setUsage] = useState<Usage | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userLoading) return;

    if (!isSuperAdmin) {
      router.replace("/");
      return;
    }

    Promise.all([
      api.get(`/organisations/${id}/usage`),
      api.get(`/organisations/${id}/subscription`),
    ])
      .then(([usageRes, subRes]) => {
        setUsage(usageRes.data);
        setSubscription(subRes.data);
      })
      .catch((err) => {
        setError(
          err.response?.status === 403
            ? "You don't have access to this organisation."
            : "Something went wrong loading this organisation."
        );
      })
      .finally(() => setLoading(false));
  }, [id, userLoading, isSuperAdmin, router]);

  if (userLoading || loading) {
    return <div className="p-10 text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="p-10 text-red-400">{error}</div>;
  }

  const limits = subscription?.plan?.limits;

  return (
    <div className="p-10">
      <Link
        href="/admin/organisations"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition mb-8"
      >
        <ArrowLeft size={16} />
        Back to all organisations
      </Link>

      <h1 className="text-3xl font-bold text-white mb-2">Organisation #{id}</h1>
      <p className="text-gray-400 mb-8">Usage and plan details — super admin view</p>

      <div className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4">Usage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatBox label="Total Agents" value={usage?.total_agents} />
          <StatBox label="Total Calls" value={usage?.total_calls} />
          <StatBox label="Calls This Month" value={usage?.calls_this_month} />
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4">Plan</h2>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xl font-bold text-orange-400 capitalize">
              {subscription?.plan?.name ?? "—"}
            </p>
            <p className="text-sm text-gray-400">
              {subscription?.plan?.price_per_month == null
                ? "Contact us"
                : `$${subscription.plan.price_per_month}/mo`}
            </p>
          </div>

          {limits && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <LimitRow label="Max Agents" value={limits.max_agents} />
              <LimitRow label="Max Calls / Month" value={limits.max_calls_per_month} />
              <LimitRow label="Max FAQs" value={limits.max_faqs} />
              <LimitRow label="Max Team Members" value={limits.max_team_members} />
              <LimitRow
                label="Department Routing"
                value={limits.department_routing ? "Yes" : "No"}
              />
              <LimitRow label="API Access" value={limits.api_access ? "Yes" : "No"} />
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Members</h2>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-gray-500">
          No endpoint for listing members yet — only creation (
          <code className="text-gray-400">POST /organisations/&#123;id&#125;/members</code>) is
          confirmed. Ask your friend if there's a matching GET.
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value?: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-sm text-gray-400 mb-2">{label}</p>
      <p className="text-2xl font-bold text-white">{value ?? "—"}</p>
    </div>
  );
}

function LimitRow({ label, value }: { label: string; value: number | string | null }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="text-white font-medium">{value === null ? "Unlimited" : value}</p>
    </div>
  );
}