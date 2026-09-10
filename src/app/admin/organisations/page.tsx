"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import {
  AdminOrganisation,
  getAdminOrganisations,
} from "@/features/admin/services/adminService";

export default function SuperAdminOrgsPage() {
  const { isLoading: userLoading, isSuperAdmin } = useCurrentUser();
  const router = useRouter();

  const [orgs, setOrgs] = useState<AdminOrganisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userLoading) return;

    if (!isSuperAdmin) {
      router.replace("/");
      return;
    }

    getAdminOrganisations()
      .then(setOrgs)
      .catch((err) => {
        setError(
          err.response?.status === 403
            ? "You don't have access to this page."
            : "Something went wrong loading organisations."
        );
      })
      .finally(() => setLoading(false));
  }, [userLoading, isSuperAdmin, router]);

  if (userLoading || loading) {
    return <div className="p-10 text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="p-10 text-red-400">{error}</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-white mb-2">All Organisations</h1>
      <p className="text-gray-400 mb-8">Platform-wide view — super admin only</p>

      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Slug</th>
            </tr>
          </thead>
          <tbody>
            {orgs.map((org) => (
              <tr key={org.id} className="border-t border-white/10">
                <td className="px-5 py-3 text-gray-300">{org.id}</td>
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/organisations/${org.id}`}
                    className="text-white hover:text-orange-400 transition"
                  >
                    {org.name}
                  </Link>
                </td>
                <td className="px-5 py-3 text-gray-400">{org.slug}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
