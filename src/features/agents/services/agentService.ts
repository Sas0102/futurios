import api from "@/lib/api";

import {
  Agent,
  CreateAgentRequest,
  UpdateAgentRequest,
} from "../types/agent";

// Get all agents of an organisation
export const getAgents = async (
  organisationId: number
): Promise<Agent[]> => {
  const response = await api.get(`/organisations/${organisationId}/agents`);
  return response.data;
};

// Get a single agent
export const getAgent = async (agentId: number): Promise<Agent> => {
  const response = await api.get(`/agents/${agentId}`);
  return response.data;
};

// Create agent
export const createAgent = async (
  organisationId: number,
  data: CreateAgentRequest
): Promise<Agent> => {
  const response = await api.post(
    `/agents?organisation_id=${organisationId}`,
    data
  );
  return response.data;
};

// Update agent
export const updateAgent = async (
  agentId: number,
  data: UpdateAgentRequest
): Promise<Agent> => {
  const response = await api.put(`/agents/${agentId}`, data);
  return response.data;
};

// Delete agent
export const deleteAgent = async (agentId: number): Promise<void> => {
  await api.delete(`/agents/${agentId}`);
};