export interface PlanLimits {
  max_agents: number | null;
  max_calls_per_month: number | null;
  max_faqs: number | null;
  max_team_members: number | null;
  department_routing: boolean;
  api_access: boolean;
  analytics_retention_days: number | null;
}


export interface Plan {
  id: number;
  name: "base" | "growth" | "pro" | "custom" | string;
  display_name: string;
  price_per_month: number | null;
  limits: PlanLimits;
  is_active: boolean;
}

export interface Subscription {
  id: number;
  organisation_id: number;
  plan: Plan;
  started_at: string;
  custom_limits: Record<string, unknown> | null;
}
