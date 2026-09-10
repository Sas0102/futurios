"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/apiError";
import { readStoredOrganisationId } from "@/features/organisations/hooks/useCurrentOrganisation";
import { Agent } from "../types/agent";
import { deleteAgent, getAgents } from "../services/agentService";

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    const organisationId = readStoredOrganisationId();
    if (!organisationId) {
      setAgents([]);
      setError("Select an organisation before managing voice agents.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      setAgents(await getAgents(organisationId));
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to load voice agents."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      refresh();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [refresh]);

  const remove = useCallback(async (agentId: number) => {
    setError("");
    try {
      await deleteAgent(agentId);
      setAgents((current) => current.filter((agent) => agent.id !== agentId));
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to delete this voice agent."));
    }
  }, []);

  return { agents, loading, error, refresh, remove };
}
