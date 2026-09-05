"use client";

import { useEffect, useMemo, useState } from "react";

import { getAgents } from "@/features/agents/services/agentService";
import { Agent } from "@/features/agents/types/agent";
import {
  getAppointments,
  getCallbackRequests,
} from "@/features/calls/services/callService";
import {
  Appointment,
  CallbackRequest,
} from "@/features/calls/types/call";
import { useCurrentOrganisation } from "@/features/organisations/hooks/useCurrentOrganisation";
import { getApiErrorMessage } from "@/lib/apiError";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export default function AppointmentsPage() {
  const { currentOrganisationId, loading, error } = useCurrentOrganisation();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [callbacks, setCallbacks] = useState<CallbackRequest[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    if (!currentOrganisationId) return;

    const loadFollowUps = async () => {
      setDataLoading(true);
      setDataError("");

      try {
        const [appointmentData, callbackData, agentData] = await Promise.all([
          getAppointments(currentOrganisationId),
          getCallbackRequests(currentOrganisationId),
          getAgents(currentOrganisationId),
        ]);

        setAppointments(appointmentData);
        setCallbacks(callbackData);
        setAgents(agentData);
      } catch (err: unknown) {
        setDataError(
          getApiErrorMessage(err, "Unable to load appointments and callbacks.")
        );
      } finally {
        setDataLoading(false);
      }
    };

    loadFollowUps();
  }, [currentOrganisationId]);

  const agentNamesById = useMemo(
    () =>
      agents.reduce<Record<number, string>>((lookup, agent) => {
        lookup[agent.id] = agent.name;
        return lookup;
      }, {}),
    [agents]
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <p className="mt-2 text-gray-500">
          Review appointment and callback records created by simulations.
        </p>
      </div>

      {(loading || dataLoading) && (
        <div className="rounded-xl border bg-white p-6 text-gray-500">
          Loading follow-ups...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && !currentOrganisationId && (
        <div className="rounded-xl border bg-white p-6 text-gray-600">
          Create an organisation before viewing follow-ups.
        </div>
      )}

      {!loading && !dataLoading && dataError && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-red-700">
          {dataError}
        </div>
      )}

      {!loading && !dataLoading && !dataError && currentOrganisationId && (
        <div className="space-y-8">
          <FollowUpTable
            title="Appointments"
            emptyText="No appointments have been created yet."
            rows={appointments}
            agentNamesById={agentNamesById}
          />

          <FollowUpTable
            title="Callback Requests"
            emptyText="No callback requests have been created yet."
            rows={callbacks}
            agentNamesById={agentNamesById}
          />
        </div>
      )}
    </div>
  );
}

function FollowUpTable({
  title,
  emptyText,
  rows,
  agentNamesById,
}: {
  title: string;
  emptyText: string;
  rows: Array<Appointment | CallbackRequest>;
  agentNamesById: Record<number, string>;
}) {
  return (
    <section className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-gray-900">{title}</h2>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyText}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-4 font-medium">Call ID</th>
                <th className="pb-4 font-medium">Agent</th>
                <th className="pb-4 font-medium">Caller Message</th>
                <th className="pb-4 font-medium">Phone</th>
                <th className="pb-4 font-medium">Created</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr
                  key={`${title}-${row.id}`}
                  className="border-b border-gray-100 transition hover:bg-orange-50"
                >
                  <td className="py-4 font-medium text-gray-900">
                    {row.call_id}
                  </td>
                  <td className="text-gray-700">
                    {agentNamesById[row.agent_id] ?? `Agent #${row.agent_id}`}
                  </td>
                  <td className="max-w-md text-gray-700">
                    {row.caller_message}
                  </td>
                  <td className="text-gray-700">
                    {row.phone_number ?? "Not captured"}
                  </td>
                  <td className="text-gray-500">{formatDate(row.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
