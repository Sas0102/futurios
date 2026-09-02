"use client";

import Link from "next/link";

import AgentForm from "@/features/agents/components/AgentForm";
import { useCurrentOrganisation } from "@/features/organisations/hooks/useCurrentOrganisation";

export default function CreateAgentPage() {
  const { currentOrganisationId, loading, error } = useCurrentOrganisation();

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Create Voice Agent</h1>

      <p className="mb-8 text-gray-500">Configure your AI voice assistant</p>

      {loading && (
        <div className="rounded-xl border bg-white p-6 text-gray-500">
          Loading organisation...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && !currentOrganisationId && (
        <div className="rounded-xl border bg-white p-6 text-gray-600">
          <p>Create an organisation before adding a voice agent.</p>
          <Link
            href="/onboarding"
            className="mt-4 inline-block rounded-lg bg-orange-500 px-4 py-2 font-medium text-white transition hover:bg-orange-600"
          >
            Create Organisation
          </Link>
        </div>
      )}

      {!loading && !error && currentOrganisationId && (
        <AgentForm organisationId={currentOrganisationId} />
      )}
    </div>
  );
}
