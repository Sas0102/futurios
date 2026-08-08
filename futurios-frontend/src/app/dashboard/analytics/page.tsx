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
import { useCurrentOrganisation } from "@/features/organisations/hooks/useCurrentOrganisation";

const isThisMonth = (value: string) => {
  const date = new Date(value);
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
};

const formatPercent = (value: number, total: number) => {
  if (total === 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
};

const statusLabel = (status: Agent["status"]) =>
  status.charAt(0).toUpperCase() + status.slice(1);

export default function AnalyticsPage() {
  const { currentOrganisationId, loading, error } = useCurrentOrganisation();

  const [calls, setCalls] = useState<CallSummary[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [callbacks, setCallbacks] = useState<CallbackRequest[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    if (!currentOrganisationId) return;

    const loadAnalytics = async () => {
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
        setDataError("Unable to load analytics data.");
      } finally {
        setDataLoading(false);
      }
    };

    loadAnalytics();
  }, [currentOrganisationId]);

  const callsThisMonth = calls.filter((call) =>
    isThisMonth(call.created_at)
  ).length;
  const transferredCalls = calls.filter((call) => call.transfer_required).length;
  const activeAgents = agents.filter((agent) => agent.status === "active").length;

  const analytics = [
    {
      title: "Total Conversations",
      value: calls.length,
      description: "Saved call summaries",
    },
    {
      title: "Calls This Month",
      value: callsThisMonth,
      description: "Based on call summary dates",
    },
    {
      title: "Transfer Rate",
      value: formatPercent(transferredCalls, calls.length),
      description: "Calls that required human transfer",
    },
    {
      title: "Active Voice Agents",
      value: activeAgents,
      description: "Agents currently marked active",
    },
  ];

  const performance = useMemo(
    () =>
      agents.map((agent) => {
        const agentCalls = calls.filter((call) => call.agent_id === agent.id);
        const agentTransfers = agentCalls.filter(
          (call) => call.transfer_required
        );

        return {
          agent,
          calls: agentCalls.length,
          transfers: agentTransfers.length,
        };
      }),
    [agents, calls]
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-gray-500">
          Monitor backend-backed conversation and agent activity.
        </p>
      </div>

      {(loading || dataLoading) && (
        <div className="rounded-xl border bg-white p-6 text-gray-500">
          Loading analytics...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && !currentOrganisationId && (
        <div className="rounded-xl border bg-white p-6 text-gray-600">
          Create an organisation before viewing analytics.
        </div>
      )}

      {!loading && !dataLoading && dataError && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-red-700">
          {dataError}
        </div>
      )}

      {!loading && !dataLoading && !dataError && currentOrganisationId && (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {analytics.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:border-orange-300 hover:shadow-md"
              >
                <p className="text-sm text-gray-500">{item.title}</p>
                <h2 className="mt-3 text-3xl font-bold text-gray-900">
                  {item.value}
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  {item.description}
                </p>
                <div className="mt-5 h-1 w-14 rounded-full bg-orange-500" />
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Agent Activity
            </h2>

            {performance.length === 0 ? (
              <p className="text-sm text-gray-500">No voice agents yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-gray-500">
                      <th className="pb-4 font-medium">Agent</th>
                      <th className="pb-4 font-medium">Status</th>
                      <th className="pb-4 font-medium">Calls</th>
                      <th className="pb-4 font-medium">Transfers</th>
                      <th className="pb-4 font-medium">Transfer Rate</th>
                    </tr>
                  </thead>

                  <tbody>
                    {performance.map((item) => (
                      <tr
                        key={item.agent.id}
                        className="border-b border-gray-100 transition hover:bg-orange-50"
                      >
                        <td className="py-4 font-medium text-gray-900">
                          {item.agent.name}
                        </td>
                        <td className="text-gray-700">
                          {statusLabel(item.agent.status)}
                        </td>
                        <td className="text-gray-700">{item.calls}</td>
                        <td className="text-gray-700">{item.transfers}</td>
                        <td>
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            {formatPercent(item.transfers, item.calls)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Appointments</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                {appointments.length}
              </h2>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Callback Requests</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                {callbacks.length}
              </h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
