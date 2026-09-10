"use client";

import StatCard from "@/features/dashboard/components/StatCard";
import RecentCallsTable from "@/features/dashboard/components/RecentCallsTable";
import AgentStatus from "@/features/dashboard/components/AgentStatus";
import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData";


export default function DashboardPage() {
  const { data, loading, error } = useDashboardData();
  const callCountsByAgent = data?.calls.reduce<Record<number, number>>(
    (counts, call) => ({
      ...counts,
      [call.agent_id]: (counts[call.agent_id] ?? 0) + 1,
    }),
    {}
  ) ?? {};
  const agentNamesById = Object.fromEntries(
    (data?.agents ?? []).map((agent) => [agent.id, agent.name])
  );
  const stats = data
    ? [
        { title: "Total Calls", value: data.usage.total_calls },
        { title: "Calls This Month", value: data.usage.calls_this_month },
        {
          title: "Active Agents",
          value: data.agents.filter((agent) => agent.status === "active").length,
        },
        { title: "Appointments", value: data.appointments.length },
      ]
    : [];

  return (

    <div>


      {/* Header */}

      <div className="border-l-4 border-primary pl-4">

        <h1 className="
          text-3xl
          font-bold
          text-foreground
        ">
          Dashboard
        </h1>


        <p className="
          mt-2
          text-muted-foreground
        ">
          Monitor your AI Voice Platform
        </p>


      </div>




      {/* Statistics Cards */}

      {error && <p className="mt-6 text-sm text-red-700">{error}</p>}

      {loading && <p className="mt-6 text-sm text-muted-foreground">Loading dashboard metrics...</p>}

      <div className="
        mt-8
        grid
        grid-cols-1
        gap-6
        sm:grid-cols-2
        xl:grid-cols-4
      ">

        {stats.map((stat) => (

          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
          />

        ))}

      </div>




      {/* Recent Calls */}

      <div className="
        mt-8
        border-t-2
        border-primary/20
        pt-6
      ">

        <RecentCallsTable
          calls={[...(data?.calls ?? [])]
            .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
            .slice(0, 4)}
          agentNamesById={agentNamesById}
        />

      </div>




      {/* AI Agent Status */}

      <div className="
        mt-8
        border-t-2
        border-primary/20
        pt-6
      ">

        <AgentStatus
          agents={data?.agents ?? []}
          callCountsByAgent={callCountsByAgent}
        />

      </div>


    </div>

  );
}
