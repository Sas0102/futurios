"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createAgent, updateAgent } from "../services/agentService";
import { getApiErrorMessage } from "@/lib/apiError";
import { readStoredOrganisationId } from "@/features/organisations/hooks/useCurrentOrganisation";
import {
  Agent,
  AgentStatus,
  BusinessHours,
  CreateAgentRequest,
  DayHours,
  UpdateAgentRequest,
} from "../types/agent";

type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

const DAY_LABELS: Record<DayKey, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const DAY_ORDER: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const defaultBusinessHours: BusinessHours = {
  mon: ["09:00", "17:00"],
  tue: ["09:00", "17:00"],
  wed: ["09:00", "17:00"],
  thu: ["09:00", "17:00"],
  fri: ["09:00", "17:00"],
  sat: [],
  sun: [],
};

// Only these are accepted by the backend — sending anything else returns 422.
const LANGUAGE_OPTIONS: { code: string; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "or", label: "Odia" },
];

export interface AgentFormProps {
  /** "create" (default) posts a new agent, "edit" PUTs a partial update to /agents/{id} */
  mode?: "create" | "edit";
  /** Existing agent to prefill the form with. Required when mode="edit". */
  initialData?: Agent;
  /** Only used for create — defaults to the selected organisation. */
  organisationId?: number;
  /** Where to redirect after a successful submit. */
  redirectTo?: string;
}

function businessHoursEqual(a: BusinessHours | null, b: BusinessHours | null) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export default function AgentForm({
  mode = "create",
  initialData,
  organisationId,
  redirectTo = "/dashboard/voice-agents",
}: AgentFormProps) {
  const router = useRouter();

  const isEdit = mode === "edit";

  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );

  const [status, setStatus] = useState<AgentStatus>(
    initialData?.status ?? "draft"
  );

  const [languages, setLanguages] = useState<string[]>(
    initialData?.languages ?? ["en"]
  );

  const [systemPrompt, setSystemPrompt] = useState(
    initialData?.system_prompt ?? ""
  );

  // structuredClone so local state never shares references with initialData
  // or the shared defaultBusinessHours constant.
  const [businessHours, setBusinessHours] = useState<BusinessHours>(() =>
    structuredClone(initialData?.business_hours ?? defaultBusinessHours)
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLanguageChange = (language: string, checked: boolean) => {
    if (checked) {
      setLanguages((prev) =>
        prev.includes(language) ? prev : [...prev, language]
      );
    } else {
      setLanguages((prev) => prev.filter((item) => item !== language));
    }
  };

  const isDayOpen = (day: DayKey) => businessHours[day].length === 2;

  const toggleDayOpen = (day: DayKey, open: boolean) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: open ? ["09:00", "17:00"] : [],
    }));
  };

  const updateDayTime = (day: DayKey, index: 0 | 1, value: string) => {
    setBusinessHours((prev) => {
      const current =
        prev[day].length === 2 ? [...prev[day]] : ["09:00", "17:00"];
      current[index] = value;
      return {
        ...prev,
        [day]: current as DayHours,
      };
    });
  };

  const validate = (): string | null => {
    // system_prompt and description are optional per the API contract.
    if (!name.trim()) return "Agent name is required";
    if (languages.length === 0) return "Select at least one language";

    for (const day of DAY_ORDER) {
      const hours = businessHours[day];
      if (hours.length === 2) {
        const [start, end] = hours;
        if (!start || !end) {
          return `Set both start and end time for ${DAY_LABELS[day]}`;
        }
        if (start >= end) {
          return `${DAY_LABELS[day]}: start time must be before end time`;
        }
      }
    }

    return null;
  };

  const buildCreatePayload = (): CreateAgentRequest => ({
    name: name.trim(),
    description: description.trim() || null,
    status,
    languages,
    system_prompt: systemPrompt.trim() || null,
    business_hours: businessHours,
  });

  // PUT is a partial update on the backend — only fields that actually
  // changed vs. initialData get sent, so untouched fields stay untouched.
  const buildUpdatePayload = (): UpdateAgentRequest => {
    const payload: UpdateAgentRequest = {};

    const trimmedName = name.trim();
    if (trimmedName !== (initialData?.name ?? "")) {
      payload.name = trimmedName;
    }

    const trimmedDescription = description.trim() || null;
    if (trimmedDescription !== (initialData?.description ?? null)) {
      payload.description = trimmedDescription;
    }

    if (status !== (initialData?.status ?? "draft")) {
      payload.status = status;
    }

    const initialLanguages = initialData?.languages ?? ["en"];
    if (JSON.stringify(languages) !== JSON.stringify(initialLanguages)) {
      payload.languages = languages;
    }

    const trimmedSystemPrompt = systemPrompt.trim() || null;
    if (trimmedSystemPrompt !== (initialData?.system_prompt ?? null)) {
      payload.system_prompt = trimmedSystemPrompt;
    }

    if (!businessHoursEqual(businessHours, initialData?.business_hours ?? null)) {
      payload.business_hours = businessHours;
    }

    return payload;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (isEdit && !initialData?.id) {
      setError("Missing agent id for edit mode");
      return;
    }

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      if (isEdit) {
        await updateAgent(initialData!.id, buildUpdatePayload());
      } else {
        await createAgent(
            organisationId ??
              initialData?.organisation_id ??
              (() => {
                const currentOrganisationId = readStoredOrganisationId();
                if (!currentOrganisationId) {
                  throw new Error("Select an organisation before creating an agent.");
                }
                return currentOrganisationId;
              })(),
            buildCreatePayload()
          );
      }

      setMessage(
        isEdit ? "Agent updated successfully" : "Agent created successfully"
      );

      setTimeout(() => {
        router.push(redirectTo);
      }, 1000);
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          isEdit
            ? "Failed to update agent. Please try again."
            : "Failed to create agent. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg rounded-xl border bg-white p-6">
      <h2 className="mb-6 text-2xl font-bold">
        {isEdit ? "Edit Voice Agent" : "Create Voice Agent"}
      </h2>

      {message && (
        <p className="mb-4 rounded-md bg-green-50 p-2 text-sm text-green-700">
          {message}
        </p>
      )}

      {error && (
        <p className="mb-4 rounded-md bg-red-50 p-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Agent Name */}
        <div>
          <Label htmlFor="agent-name">Agent Name</Label>
          <Input
            id="agent-name"
            placeholder="Front Desk Assistant"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="agent-description">Description</Label>
          <Input
            id="agent-description"
            placeholder="Handles customer calls"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="agent-status">Status</Label>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as AgentStatus)}
          >
            <SelectTrigger id="agent-status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Languages */}
        <div>
          <Label>Languages</Label>
          <div className="mt-3 space-y-2">
            {LANGUAGE_OPTIONS.map((lang) => (
              <div key={lang.code} className="flex items-center gap-2">
                <Checkbox
                  id={`lang-${lang.code}`}
                  checked={languages.includes(lang.code)}
                  onCheckedChange={(checked) =>
                    handleLanguageChange(lang.code, checked === true)
                  }
                />
                <Label htmlFor={`lang-${lang.code}`} className="font-normal">
                  {lang.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* System Prompt */}
        <div>
          <Label htmlFor="agent-system-prompt">System Prompt</Label>
          <Textarea
            id="agent-system-prompt"
            className="min-h-[120px]"
            placeholder="You are a helpful clinic receptionist..."
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
          />
        </div>

        {/* Business Hours */}
        <div>
          <Label>Business Hours</Label>
          <div className="mt-3 space-y-3">
            {DAY_ORDER.map((day) => {
              const open = isDayOpen(day);
              const [start, end] = open
                ? businessHours[day]
                : ["09:00", "17:00"];

              return (
                <div
                  key={day}
                  className="flex items-center gap-3 rounded-md border p-2"
                >
                  <div className="flex w-32 items-center gap-2">
                    <Checkbox
                      id={`day-${day}`}
                      checked={open}
                      onCheckedChange={(checked) =>
                        toggleDayOpen(day, checked === true)
                      }
                    />
                    <Label htmlFor={`day-${day}`} className="font-normal">
                      {DAY_LABELS[day]}
                    </Label>
                  </div>

                  <input
                    type="time"
                    aria-label={`${DAY_LABELS[day]} opening time`}
                    className="rounded-md border p-1 text-sm disabled:opacity-40"
                    value={start}
                    disabled={!open}
                    onChange={(e) => updateDayTime(day, 0, e.target.value)}
                  />

                  <span className="text-sm text-gray-500">to</span>

                  <input
                    type="time"
                    aria-label={`${DAY_LABELS[day]} closing time`}
                    className="rounded-md border p-1 text-sm disabled:opacity-40"
                    value={end}
                    disabled={!open}
                    onChange={(e) => updateDayTime(day, 1, e.target.value)}
                  />

                  {!open && (
                    <span className="ml-auto text-xs text-gray-400">
                      Closed
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Agent"}
        </Button>
      </form>
    </div>
  );
}
