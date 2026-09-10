"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storeCurrentOrganisationId } from "@/features/organisations/hooks/useCurrentOrganisation";
import { createOrganisation } from "@/features/organisations/services/organisationService";
import { getApiErrorMessage } from "@/lib/apiError";

const organizationSchema = z
  .object({
    organization_name: z.string().min(2, "Organisation name required"),
    industry: z.string().min(1, "Please select an industry"),
    industry_other: z.string().optional(),
    company_size: z.string().min(1, "Please select a company size"),
  })
  .refine(
    (data) =>
      data.industry !== "Other" ||
      (data.industry_other && data.industry_other.trim().length >= 2),
    {
      message: "Please tell us your industry",
      path: ["industry_other"],
    }
  );

type OrganizationFormData = z.infer<typeof organizationSchema>;

const INDUSTRIES = [
  "Healthcare",
  "Real Estate",
  "Retail & E-commerce",
  "Hospitality",
  "Finance & Insurance",
  "Education",
  "Professional Services",
  "Other",
];

const COMPANY_SIZES = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "500+ employees",
];

const buildSlug = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const fieldClasses = `
  h-12
  w-full
  rounded-xl
  border
  border-white/[0.12]
  bg-black/30
  px-4
  text-base
  sm:text-sm
  text-white
  outline-none
  transition-all
  placeholder:text-white/25
  focus:border-orange-500/70
  focus:ring-2
  focus:ring-orange-500/20
`;

export default function OrganizationForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
  });

  const selectedIndustry = watch("industry");

  const onSubmit = async (data: OrganizationFormData) => {
    setLoading(true);
    setErrorMessage("");

    const resolvedIndustry =
      data.industry === "Other"
        ? data.industry_other?.trim() ?? ""
        : data.industry;

    try {
      const organisation = await createOrganisation({
        name: data.organization_name.trim(),
        slug: buildSlug(data.organization_name) || "organisation",
        // resolvedIndustry / data.company_size are collected here and ready
        // to send once the backend accepts them on Organisation creation.
      });

      storeCurrentOrganisationId(organisation.id);
      router.push("/dashboard");
    } catch (error: unknown) {
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
    <main className="relative min-h-dvh w-full overflow-hidden bg-black text-white">
      {/* =====================================================
          BACKGROUND GRID
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.035]
          [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]
          [background-size:60px_60px]
        "
      />

      {/* =====================================================
          ORANGE GLOWS
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-orange-500/[0.10]
          blur-[150px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-[250px]
          w-[600px]
          -translate-x-1/2
          rounded-full
          bg-orange-500/[0.06]
          blur-[100px]
        "
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-10
          flex
          min-h-dvh
          items-center
          justify-center
          px-4
          py-10
          sm:px-6
          sm:py-12
        "
      >
        <div className="w-full max-w-md">
          {/* =================================================
              STEP BADGE
          ================================================= */}

          <div className="mb-5 flex justify-center sm:mb-6">
            <span
              className="
                inline-flex
                items-center
                gap-2
                whitespace-nowrap
                rounded-full
                border
                border-white/[0.12]
                bg-white/[0.04]
                px-3
                py-1
                text-[11px]
                font-medium
                tracking-wide
                text-white/50
                sm:text-xs
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              Step 1 of 1 — Workspace setup
            </span>
          </div>

          {/* =================================================
              HEADING
          ================================================= */}

          <div className="mb-6 text-center sm:mb-8">
            <div
              className="
                mx-auto
                mb-4
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                border
                border-white/[0.10]
                bg-white/[0.045]
                shadow-[0_8px_30px_rgba(249,115,22,0.15)]
                sm:mb-5
                sm:h-14
                sm:w-14
              "
            >
              <Building2 className="h-5 w-5 text-orange-400 sm:h-6 sm:w-6" />
            </div>

            <h1
              className="
                text-[28px]
                font-semibold
                leading-tight
                tracking-[-0.03em]
                text-white
                sm:text-4xl
                sm:tracking-[-0.04em]
              "
            >
              Set up your workspace.
            </h1>

            <p
              className="
                mx-auto
                mt-3
                max-w-sm
                text-sm
                leading-relaxed
                text-white/50
              "
            >
              Tell us a bit about your business so we can tailor your voice
              agents.
            </p>
          </div>

          {/* =================================================
              FORM CARD
          ================================================= */}

          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-white/[0.10]
              bg-white/[0.045]
              p-5
              shadow-[0_25px_80px_rgba(0,0,0,0.45)]
              backdrop-blur-2xl
              sm:rounded-3xl
              sm:p-7
              md:p-8
            "
          >
            {/* Card top orange line */}

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-0
                h-px
                w-2/3
                -translate-x-1/2
                bg-gradient-to-r
                from-transparent
                via-orange-500/70
                to-transparent
              "
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
              {/* =============================================
                  ERROR MESSAGE
              ============================================= */}

              {errorMessage && (
                <div
                  className="
                    rounded-xl
                    border
                    border-red-500/20
                    bg-red-500/[0.08]
                    px-4
                    py-3
                  "
                >
                  <p className="text-sm text-red-300">{errorMessage}</p>
                </div>
              )}

              {/* =============================================
                  ORGANISATION NAME
              ============================================= */}

              <div className="space-y-2">
                <Label
                  htmlFor="organization_name"
                  className="text-sm font-medium text-white"
                >
                  Organisation name
                </Label>

                <Input
                  id="organization_name"
                  placeholder="Futurios Technologies"
                  autoComplete="organization"
                  {...register("organization_name")}
                  className={fieldClasses}
                />

                {errors.organization_name && (
                  <p className="text-xs text-red-400">
                    {errors.organization_name.message}
                  </p>
                )}
              </div>

              {/* =============================================
                  INDUSTRY
              ============================================= */}

              <div className="space-y-2">
                <Label htmlFor="industry" className="text-sm font-medium text-white">
                  Industry
                </Label>

                <div className="relative">
                  <select
                    id="industry"
                    defaultValue=""
                    {...register("industry")}
                    className={`${fieldClasses} appearance-none pr-10`}
                  >
                    <option value="" disabled className="bg-black text-white/40">
                      Select your industry
                    </option>
                    {INDUSTRIES.map((industry) => (
                      <option
                        key={industry}
                        value={industry}
                        className="bg-black text-white"
                      >
                        {industry}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    className="
                      pointer-events-none
                      absolute
                      right-3.5
                      top-1/2
                      h-4
                      w-4
                      -translate-y-1/2
                      text-white/30
                    "
                  />
                </div>

                {errors.industry && (
                  <p className="text-xs text-red-400">
                    {errors.industry.message}
                  </p>
                )}

                {/* =============================================
                    CUSTOM INDUSTRY (shown only when "Other" is picked)
                ============================================= */}

                {selectedIndustry === "Other" && (
                  <div className="animate-in fade-in slide-in-from-top-1 space-y-2 duration-200">
                    <Input
                      id="industry_other"
                      placeholder="Tell us your industry"
                      autoFocus
                      {...register("industry_other")}
                      className={fieldClasses}
                    />

                    {errors.industry_other && (
                      <p className="text-xs text-red-400">
                        {errors.industry_other.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* =============================================
                  COMPANY SIZE
              ============================================= */}

              <div className="space-y-2">
                <Label
                  htmlFor="company_size"
                  className="text-sm font-medium text-white"
                >
                  Company size
                </Label>

                <div className="relative">
                  <select
                    id="company_size"
                    defaultValue=""
                    {...register("company_size")}
                    className={`${fieldClasses} appearance-none pr-10`}
                  >
                    <option value="" disabled className="bg-black text-white/40">
                      Select company size
                    </option>
                    {COMPANY_SIZES.map((size) => (
                      <option key={size} value={size} className="bg-black text-white">
                        {size}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    className="
                      pointer-events-none
                      absolute
                      right-3.5
                      top-1/2
                      h-4
                      w-4
                      -translate-y-1/2
                      text-white/30
                    "
                  />
                </div>

                {errors.company_size && (
                  <p className="text-xs text-red-400">
                    {errors.company_size.message}
                  </p>
                )}
              </div>

              {/* =============================================
                  SUBMIT
              ============================================= */}

              <Button
                type="submit"
                disabled={loading}
                className="
                  h-12
                  w-full
                  rounded-xl
                  border-0
                  bg-orange-500
                  text-sm
                  font-semibold
                  text-white
                  shadow-[0_8px_30px_rgba(249,115,22,0.20)]
                  transition-all
                  duration-300
                  hover:bg-orange-400
                  hover:shadow-[0_8px_35px_rgba(249,115,22,0.30)]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white/30
                        border-t-white
                      "
                    />
                    Creating workspace...
                  </span>
                ) : (
                  "Continue to dashboard"
                )}
              </Button>
            </form>

            {/* =============================================
                BOTTOM TEXT
            ============================================= */}

            <div className="mt-7 border-t border-white/[0.08] pt-6">
              <p className="text-center text-xs text-white/35">
                You can invite teammates and change these details later
              </p>
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <p className="mt-7 text-center text-xs text-white/25">
            AI-powered voice conversations. Built for business.
          </p>
        </div>
      </div>
    </main>
  );
}