"use client";

import { useEffect, useState } from "react";

import { getStoredUser } from "@/features/auth/utils/authStorage";
import { LoginResponse } from "@/features/auth/types/auth";
import { useCurrentOrganisation } from "@/features/organisations/hooks/useCurrentOrganisation";

export default function SettingsPage() {
  const {
    organisations,
    currentOrganisation,
    currentOrganisationId,
    selectOrganisation,
    loading,
    error,
  } = useCurrentOrganisation();

  const [user, setUser] = useState<LoginResponse["user"] | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setUser(getStoredUser());
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const handleSavePreferences = () => {
    setMessage("Notification preference saved on this browser.");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-500">
          View your account and organisation settings
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold text-gray-900">Profile</h2>

        <div className="space-y-5">
          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            <input
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-900 outline-none"
              value={user?.full_name ?? ""}
              readOnly
              placeholder="Login to view your name"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Email</label>
            <input
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-900 outline-none"
              value={user?.email ?? ""}
              readOnly
              placeholder="Login to view your email"
            />
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold text-gray-900">Organisation</h2>

        {loading && (
          <p className="text-sm text-gray-500">Loading organisations...</p>
        )}

        {!loading && error && (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {!loading && !error && organisations.length === 0 && (
          <p className="rounded-md bg-orange-50 p-3 text-sm text-orange-700">
            No organisation is associated with this login.
          </p>
        )}

        {!loading && !error && organisations.length > 0 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm text-gray-500">
                Current Organisation
              </label>
              <select
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white p-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                value={currentOrganisationId ?? ""}
                onChange={(event) =>
                  selectOrganisation(Number(event.target.value))
                }
              >
                {organisations.map((organisation) => (
                  <option key={organisation.id} value={organisation.id}>
                    {organisation.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-gray-500">Slug</label>
                <input
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-900 outline-none"
                  value={currentOrganisation?.slug ?? ""}
                  readOnly
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Role</label>
                <input
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-900 outline-none"
                  value={currentOrganisation?.role ?? ""}
                  readOnly
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold text-gray-900">Preferences</h2>

        <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
          <div>
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <p className="text-sm text-gray-500">
              Receive alerts for calls and system updates
            </p>
          </div>

          <button
            type="button"
            onClick={() => setNotifications((value) => !value)}
            className={`rounded-xl px-5 py-2 font-medium text-white transition ${
              notifications
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-gray-400"
            }`}
          >
            {notifications ? "ON" : "OFF"}
          </button>
        </div>

        <button
          type="button"
          onClick={handleSavePreferences}
          className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-medium text-white transition hover:bg-orange-600"
        >
          Save Preferences
        </button>

        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
      </div>
    </div>
  );
}
