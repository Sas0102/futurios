"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storeCurrentOrganisationId } from "@/features/organisations/hooks/useCurrentOrganisation";
import { createOrganisation } from "@/features/organisations/services/organisationService";
import { getApiErrorMessage } from "@/lib/apiError";

const organizationSchema = z.object({
  organization_name: z.string().min(2, "Organization name required"),
  industry: z.string().min(2, "Industry required"),
  company_size: z.string().min(1, "Company size required"),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

const buildSlug = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function OrganizationForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
  });

  const onSubmit = async (data: OrganizationFormData) => {
    setLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      const organisation = await createOrganisation({
        name: data.organization_name.trim(),
        slug: buildSlug(data.organization_name) || "organisation",
      });

      storeCurrentOrganisationId(organisation.id);
      setMessage("Organisation created successfully");
      router.push("/dashboard");
    } catch (error: unknown) {
      console.log(error);
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to create organisation. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg border bg-white p-6">
      <h1 className="mb-6 text-2xl font-bold">Create Organization</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errorMessage && (
          <p className="text-sm text-red-500">{errorMessage}</p>
        )}

        {message && <p className="text-sm text-green-600">{message}</p>}

        <div>
          <Label>Organization Name</Label>
          <Input
            placeholder="Futurios Technologies"
            {...register("organization_name")}
          />
          {errors.organization_name && (
            <p className="text-sm text-red-500">
              {errors.organization_name.message}
            </p>
          )}
        </div>

        <div>
          <Label>Industry</Label>
          <Input placeholder="Healthcare" {...register("industry")} />
          {errors.industry && (
            <p className="text-sm text-red-500">{errors.industry.message}</p>
          )}
        </div>

        <div>
          <Label>Company Size</Label>
          <Input placeholder="10-50 employees" {...register("company_size")} />
          {errors.company_size && (
            <p className="text-sm text-red-500">
              {errors.company_size.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Continue"}
        </Button>
      </form>
    </div>
  );
}
