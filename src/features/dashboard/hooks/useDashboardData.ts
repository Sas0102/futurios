"use client";

import { useCallback, useEffect, useState } from "react";
import { readStoredOrganisationId } from "@/features/organisations/hooks/useCurrentOrganisation";
import { getAgents } from "@/features/agents/services/agentService";
import {
  getAppointments,
  getCallbackRequests,
  getCallSummaries,
} from "@/features/calls/services/callService";
import { getApiErrorMessage } from "@/lib/apiError";
import { Agent } from "@/features/agents/types/agent";
import {
  Appointment,
  CallbackRequest,
  CallSummary,
} from "@/features/calls/types/call";
import { getOrganisationUsage, OrganisationUsage } from "../services/dashboardService";

interface DashboardData {
  usage: OrganisationUsage;
  agents: Agent[];
  calls: CallSummary[];
  appointments: Appointment[];
  callbackRequests: CallbackRequest[];
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    const organisationId = readStoredOrganisationId();
    if (!organisationId) {
      setData(null);
      setError("Select an organisation to view dashboard metrics.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const [usage, calls, appointments, callbackRequests, agents] =
        await Promise.all([
          getOrganisationUsage(organisationId),
          getCallSummaries(organisationId),
          getAppointments(organisationId),
          getCallbackRequests(organisationId),
          getAgents(organisationId),
        ]);
      setData({ usage, calls, appointments, callbackRequests, agents });
    } catch (err) {
      setData(null);
      setError(getApiErrorMessage(err, "Unable to load dashboard metrics."));
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

  return { data, loading, error, refresh };
}
