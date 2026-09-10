"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/apiError";
import { createApiKey, getApiKeys, revokeApiKey } from "../services/apiKeyService";
import { ApiKey } from "../types/apiKey";

const formatDate = (value: string | null) =>
  value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value)) : "Never";

export default function ApiKeyManager({ organisationId }: { organisationId: number }) {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [name, setName] = useState("");
  const [revealedKey, setRevealedKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadKeys = useCallback(async () => {
    try {
      setKeys(await getApiKeys(organisationId));
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to load API keys."));
    }
  }, [organisationId]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadKeys();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [loadKeys]);

  const handleCreate = async () => {
    setLoading(true);
    setError("");
    try {
      const created = await createApiKey(organisationId, { name: name.trim() || null });
      setRevealedKey(created.raw_key);
      setName("");
      await loadKeys();
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to create an API key."));
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (apiKeyId: number) => {
    setLoading(true);
    setError("");
    try {
      await revokeApiKey(organisationId, apiKeyId);
      await loadKeys();
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to revoke this API key."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-700">{error}</p>}
      {revealedKey && <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-900"><p className="font-medium">Copy this API key now. It will not be shown again.</p><code className="mt-2 block break-all rounded bg-white p-2">{revealedKey}</code><button type="button" onClick={() => setRevealedKey("")} className="mt-2 text-sm font-medium text-orange-700">I have copied it</button></div>}
      <div className="flex gap-3"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Key name (optional)" className="flex-1 rounded-xl border border-gray-200 p-3 outline-none focus:border-orange-500" /><button type="button" onClick={handleCreate} disabled={loading} className="rounded-xl bg-orange-500 px-5 py-3 font-medium text-white hover:bg-orange-600 disabled:opacity-50">Create Key</button></div>
      {keys.length === 0 ? <p className="text-sm text-gray-500">No API keys yet.</p> : keys.map((key) => <div key={key.id} className="flex items-center justify-between rounded-xl border border-gray-200 p-4"><div><p className="font-medium text-gray-900">{key.name ?? "Unnamed key"}</p><p className="text-sm text-gray-500">{key.key_prefix}… · Created {formatDate(key.created_at)} · Last used {formatDate(key.last_used_at)}</p></div><button type="button" onClick={() => handleRevoke(key.id)} disabled={loading || !key.is_active} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50">{key.is_active ? "Revoke" : "Revoked"}</button></div>)}
    </div>
  );
}
