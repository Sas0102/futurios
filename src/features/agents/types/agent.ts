// Business hours format:
// Open day: ["09:00", "17:00"]
// Closed day: []

export type DayHours = [] | [string, string];

export type AgentStatus = "active" | "draft" | "inactive";

export interface BusinessHours {
  mon: DayHours;
  tue: DayHours;
  wed: DayHours;
  thu: DayHours;
  fri: DayHours;
  sat: DayHours;
  sun: DayHours;
}

export interface Agent {
  id: number;
  organisation_id: number;
  name: string;
  description: string | null;
  status: AgentStatus;
  languages: string[];
  system_prompt: string | null;
  business_hours: BusinessHours | null;
}

/**
 * POST /agents?organisation_id={id}
 * name + status are required. Everything else is optional per the backend
 * contract — languages defaults to ["en"] server-side if omitted, and
 * business_hours can be omitted or null entirely.
 */
export interface CreateAgentRequest {
  name: string;
  description?: string | null;
  status: AgentStatus;
  languages?: string[];
  system_prompt?: string | null;
  business_hours?: BusinessHours | null;
}

/**
 * PUT /agents/{agent_id}
 * Partial update — only include the fields you want to change.
 * Everything else on the server is left untouched.
 */
export type UpdateAgentRequest = Partial<CreateAgentRequest>;

/** @deprecated use CreateAgentRequest / UpdateAgentRequest instead */
export type AgentPayload = CreateAgentRequest;