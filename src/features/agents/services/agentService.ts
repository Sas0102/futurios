import api from "@/lib/api";

import {
  Agent,
  CreateAgentRequest,
  SimulateAgentRequest,
  SimulateAgentResponse,
  UpdateAgentRequest,
  VoiceSession,
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

export const startAgentTestSession = async (
  agentId: number
): Promise<VoiceSession> => {
  const response = await api.post(`/agents/${agentId}/test-session`);
  return response.data;
};

export const simulateAgent = async (
  agentId: number,
  data: SimulateAgentRequest
): Promise<SimulateAgentResponse> => {
  const response = await api.post(`/agents/${agentId}/simulate`, data);
  return response.data;
};

export const sendAgentVoiceSession = async (
  agentId: number,
  audio: Blob
): Promise<VoiceSession> => {
  const formData = new FormData();
  formData.append("audio", audio, "recording.webm");

  const response = await api.post(`/agents/${agentId}/voice-sessions`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
