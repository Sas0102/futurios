import api from "@/lib/api";

import {
  SimulateRequest,
  SimulateResponse,
} from "../types/simulation";

export const simulateAgentMessage = async (
  agentId: number,
  data: SimulateRequest
): Promise<SimulateResponse> => {
  const response = await api.post(`/agents/${agentId}/simulate`, data);
  return response.data;
};
