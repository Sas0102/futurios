"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getAgents } from "@/features/agents/services/agentService";
import { Agent } from "@/features/agents/types/agent";
import { useCurrentOrganisation } from "@/features/organisations/hooks/useCurrentOrganisation";

const statusLabel = (status: Agent["status"]) =>
  status.charAt(0).toUpperCase() + status.slice(1);

export default function VoiceAgentsPage() {
  const { currentOrganisationId, currentOrganisation, loading, error } =
    useCurrentOrganisation();

  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [agentsError, setAgentsError] = useState("");

  useEffect(() => {
    if (!currentOrganisationId) return;

    const loadAgents = async () => {
      setAgentsLoading(true);
      setAgentsError("");

      try {
        const data = await getAgents(currentOrganisationId);
        setAgents(data);
      } catch (err) {
        console.log(err);
        setAgentsError("Unable to load voice agents.");
      } finally {
        setAgentsLoading(false);
      }
    };

    loadAgents();
  }, [currentOrganisationId]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Voice Agents</h1>
          <p className="mt-2 text-gray-500">
            {currentOrganisation
              ? `Manage assistants for ${currentOrganisation.name}`
              : "Manage your AI voice assistants"}
          </p>
        </div>

        <Link
          href="/dashboard/voice-agents/create"
          className="rounded-xl bg-orange-500 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-orange-600"
        >
          + Create Agent
        </Link>
      </div>

      {(loading || agentsLoading) && (
        <div className="rounded-xl border border-orange-100 bg-white p-6 text-gray-500">
          Loading voice agents...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && !currentOrganisationId && (
        <div className="rounded-xl border border-orange-100 bg-white p-6 text-gray-600">
          Create an organisation before adding voice agents.
        </div>
      )}

      {!loading && !agentsLoading && agentsError && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-red-700">
          {agentsError}
        </div>
      )}

      {!loading &&
        !agentsLoading &&
        !agentsError &&
        currentOrganisationId &&
        agents.length === 0 && (
          <div className="rounded-xl border border-orange-100 bg-white p-6 text-gray-600">
            No voice agents yet.
          </div>
        )}

      {!loading && !agentsLoading && agents.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:border-orange-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {agent.name}
                </h2>

                <span
                  className={
                    agent.status === "active"
                      ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                      : "rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                  }
                >
                  {statusLabel(agent.status)}
                </span>
              </div>

              <p className="mt-3 text-sm text-gray-500">
                {agent.description || "No description provided"}
              </p>

              <div className="mt-5 rounded-xl bg-orange-50 p-4">
                <p className="text-sm text-gray-500">Languages</p>
                <p className="mt-1 text-lg font-bold text-gray-900">
                  {agent.languages.join(", ")}
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  href={`/dashboard/voice-agents/${agent.id}/edit`}
                  className="flex-1 rounded-lg border border-orange-200 px-4 py-2 text-center font-medium text-orange-600 transition hover:bg-orange-50"
                >
                  Edit
                </Link>

                <Link
                  href={`/dashboard/voice-agents/${agent.id}/test`}
                  className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-center font-medium text-white transition hover:bg-black"
                >
                  Test Voice
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
