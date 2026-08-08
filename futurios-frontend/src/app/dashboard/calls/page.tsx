"use client";

import { useEffect, useMemo, useState } from "react";

import { getAgents } from "@/features/agents/services/agentService";
import { Agent } from "@/features/agents/types/agent";
import CallsTable from "@/features/calls/components/CallsTable";
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

export default function CallsPage() {
  const { currentOrganisationId, loading, error } = useCurrentOrganisation();

  const [calls, setCalls] = useState<CallSummary[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [callbacks, setCallbacks] = useState<CallbackRequest[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    if (!currentOrganisationId) return;

    const loadCalls = async () => {
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
        setDataError("Unable to load call data.");
      } finally {
        setDataLoading(false);
      }
    };

    loadCalls();
  }, [currentOrganisationId]);

  const agentNamesById = useMemo(
    () =>
      agents.reduce<Record<number, string>>((lookup, agent) => {
        lookup[agent.id] = agent.name;
        return lookup;
      }, {}),
    [agents]
  );

  const transferredCalls = calls.filter((call) => call.transfer_required).length;

  const summaryCards = [
    {
      title: "Total Calls",
      value: calls.length,
      accent: "bg-orange-500",
      border: "border-orange-100 hover:border-orange-300",
    },
    {
      title: "Transfers",
      value: transferredCalls,
      accent: "bg-blue-500",
      border: "border-blue-100 hover:border-blue-300",
    },
    {
      title: "Appointments",
      value: appointments.length,
      accent: "bg-green-500",
      border: "border-green-100 hover:border-green-300",
    },
    {
      title: "Callbacks",
      value: callbacks.length,
      accent: "bg-gray-500",
      border: "border-gray-100 hover:border-gray-300",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Calls</h1>
        <p className="mt-2 text-gray-500">
          View backend call summaries and follow-up requests.
        </p>
      </div>

      {(loading || dataLoading) && (
        <div className="rounded-xl border bg-white p-6 text-gray-500">
          Loading call data...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && !currentOrganisationId && (
        <div className="rounded-xl border bg-white p-6 text-gray-600">
          Create an organisation before viewing call data.
        </div>
      )}

      {!loading && !dataLoading && dataError && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-red-700">
          {dataError}
        </div>
      )}

      {!loading && !dataLoading && !dataError && currentOrganisationId && (
        <>
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <div
                key={card.title}
                className={`rounded-2xl border bg-white p-6 shadow-sm transition ${card.border}`}
              >
                <p className="text-sm text-gray-500">{card.title}</p>
                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {card.value}
                </h2>
                <div className={`mt-4 h-1 w-16 rounded-full ${card.accent}`} />
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Recent Conversations
            </h2>

            <CallsTable calls={calls} agentNamesById={agentNamesById} />
          </div>
        </>
      )}
    </div>
  );
}
