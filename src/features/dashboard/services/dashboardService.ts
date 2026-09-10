import api from "@/lib/api";

export interface OrganisationUsage {
  organisation_id: number;
  total_agents: number;
  total_calls: number;
  calls_this_month: number;
}

export const getOrganisationUsage = async (
  organisationId: number
): Promise<OrganisationUsage> => {
  const response = await api.get(`/organisations/${organisationId}/usage`);
  return response.data;
};
