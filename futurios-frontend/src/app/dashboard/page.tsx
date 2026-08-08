"use client";

import { useEffect, useMemo, useState } from "react";

import { getAgents } from "@/features/agents/services/agentService";
import { Agent } from "@/features/agents/types/agent";
import {
  getAppointments,
  getCallbackRequests,
  getCallSummaries,
} from "@/features/calls/services/callService";
import {
  Appointment,
  CallbackRequest,
  CallSummary,
} from "@/features/calls/types/call";
import AgentStatus from "@/features/dashboard/components/AgentStatus";
import RecentCallsTable from "@/features/dashboard/components/RecentCallsTable";
import StatCard from "@/features/dashboard/components/StatCard";
import { useCurrentOrganisation } from "@/features/organisations/hooks/useCurrentOrganisation";

const isThisMonth = (value: string) => {
  const date = new Date(value);
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
};

export default function DashboardPage() {
  const { currentOrganisationId, currentOrganisation, loading, error } =
    useCurrentOrganisation();

  const [calls, setCalls] = useState<CallSummary[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [callbacks, setCallbacks] = useState<CallbackRequest[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    if (!currentOrganisationId) return;

    const loadDashboard = async () => {
      setDataLoading(true);
      setDataError("");

      try {
        const [callData, appointmentData, callbackData, agentData] =
          await Promise.all([
            getCallSummaries(currentOrganisationId),
            getAppointments(currentOrganisationId),
            getCallbackRequests(currentOrganisationId),
            getAgents(currentOrganisationId),
          ]);

        setCalls(callData);
        setAppointments(appointmentData);
        setCallbacks(callbackData);
        setAgents(agentData);
      } catch (err) {
        console.log(err);
        setDataError("Unable to load dashboard data.");
      } finally {
        setDataLoading(false);
      }
    };

    loadDashboard();
  }, [currentOrganisationId]);

  const sortedCalls = useMemo(
    () =>
      [...calls].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [calls]
  );

  const agentNamesById = useMemo(
    () =>
      agents.reduce<Record<number, string>>((lookup, agent) => {
        lookup[agent.id] = agent.name;
        return lookup;
      }, {}),
    [agents]
  );

  const callCountsByAgent = useMemo(
    () =>
      calls.reduce<Record<number, number>>((lookup, call) => {
        lookup[call.agent_id] = (lookup[call.agent_id] ?? 0) + 1;
        return lookup;
      }, {}),
    [calls]
  );

  const stats = [
    {
      title: "Total Calls",
      value: calls.length,
    },
    {
      title: "Calls This Month",
      value: calls.filter((call) => isThisMonth(call.created_at)).length,
    },
    {
      title: "Active Agents",
      value: agents.filter((agent) => agent.status === "active").length,
    },
    {
      title: "Follow-ups",
      value: appointments.length + callbacks.length,
    },
  ];

  return (
    <div>
      <div className="border-l-4 border-primary pl-4">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>

        <p className="mt-2 text-muted-foreground">
          {currentOrganisation
            ? `Monitor ${currentOrganisation.name}`
            : "Monitor your AI Voice Platform"}
        </p>
      </div>

      {(loading || dataLoading) && (
        <div className="mt-8 rounded-xl border bg-white p-6 text-gray-500">
          Loading dashboard...
        </div>
      )}

      {!loading && error && (
        <div className="mt-8 rounded-xl border border-red-100 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && !currentOrganisationId && (
        <div className="mt-8 rounded-xl border bg-white p-6 text-gray-600">
          Create an organisation to view dashboard data.
        </div>
      )}

      {!loading && !dataLoading && dataError && (
        <div className="mt-8 rounded-xl border border-red-100 bg-red-50 p-6 text-red-700">
          {dataError}
        </div>
      )}

      {!loading && !dataLoading && !dataError && currentOrganisationId && (
        <>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.title} title={stat.title} value={stat.value} />
            ))}
          </div>

          <div className="mt-8 border-t-2 border-primary/20 pt-6">
            <RecentCallsTable
              calls={sortedCalls}
              agentNamesById={agentNamesById}
            />
          </div>

          <div className="mt-8 border-t-2 border-primary/20 pt-6">
            <AgentStatus
              agents={agents}
              callCountsByAgent={callCountsByAgent}
            />
          </div>
        </>
      )}
    </div>
  );
}
