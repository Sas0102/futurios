"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getMyOrganisations } from "../services/organisationService";
import { MyOrganisation } from "../types/organisation";

const CURRENT_ORGANISATION_ID_KEY = "current_organisation_id";

export const readStoredOrganisationId = (): number | null => {
  if (typeof window === "undefined") return null;

  const value = window.localStorage.getItem(CURRENT_ORGANISATION_ID_KEY);
  if (!value) return null;

  const id = Number(value);
  return Number.isFinite(id) ? id : null;
};

export const storeCurrentOrganisationId = (organisationId: number) => {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    CURRENT_ORGANISATION_ID_KEY,
    String(organisationId)
  );
};

export function useCurrentOrganisation() {
  const [organisations, setOrganisations] = useState<MyOrganisation[]>([]);
  const [currentOrganisationId, setCurrentOrganisationId] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selectOrganisation = useCallback((organisationId: number) => {
    storeCurrentOrganisationId(organisationId);
    setCurrentOrganisationId(organisationId);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMyOrganisations();
      setOrganisations(data);

      const storedId = readStoredOrganisationId();
      const selectedId =
        storedId && data.some((org) => org.id === storedId)
          ? storedId
          : data[0]?.id ?? null;

      setCurrentOrganisationId(selectedId);

      if (selectedId) {
        storeCurrentOrganisationId(selectedId);
      } else if (typeof window !== "undefined") {
        window.localStorage.removeItem(CURRENT_ORGANISATION_ID_KEY);
      }
    } catch (err) {
      console.log(err);
      setError("Unable to load organisations.");
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

  const currentOrganisation = useMemo(
    () =>
      organisations.find((org) => org.id === currentOrganisationId) ?? null,
    [organisations, currentOrganisationId]
  );

  return {
    organisations,
    currentOrganisation,
    currentOrganisationId,
    selectOrganisation,
    loading,
    error,
    refresh,
  };
}
