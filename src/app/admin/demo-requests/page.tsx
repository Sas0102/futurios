"use client";

import { useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/apiError";
import {
  DemoRequest,
  getDemoRequests,
} from "@/features/admin/services/adminService";

export default function DemoRequestsPage() {
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      setError("");

      try {
        setRequests(await getDemoRequests());
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, "Unable to load demo requests."));
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  if (loading) {
    return <div className="p-10 text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="p-10 text-red-400">{error}</div>;
  }

  return (
    <div className="p-10">
      <h1 className="mb-2 text-3xl font-bold text-white">Demo Requests</h1>
      <p className="mb-8 text-gray-400">Latest inbound product demo leads</p>

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-gray-400">
          No demo requests yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-gray-400">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Message</th>
                <th className="px-5 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-t border-white/10">
                  <td className="px-5 py-3 text-white">{request.name}</td>
                  <td className="px-5 py-3 text-gray-300">{request.email}</td>
                  <td className="px-5 py-3 text-gray-300">
                    {request.company_name}
                  </td>
                  <td className="px-5 py-3 text-gray-300">
                    {request.phone_number}
                  </td>
                  <td className="max-w-xs px-5 py-3 text-gray-300">
                    {request.message}
                  </td>
                  <td className="px-5 py-3 text-gray-400">
                    {new Date(request.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
