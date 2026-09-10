import api from "@/lib/api";
import { ApiKey, CreatedApiKey, CreateApiKeyRequest } from "../types/apiKey";

export const createApiKey = async (
  organisationId: number,
  data: CreateApiKeyRequest
): Promise<CreatedApiKey> => {
  const response = await api.post(`/organisations/${organisationId}/api-keys`, data);
  return response.data;
};

export const getApiKeys = async (organisationId: number): Promise<ApiKey[]> => {
  const response = await api.get(`/organisations/${organisationId}/api-keys`);
  return response.data;
};

export const revokeApiKey = async (
  organisationId: number,
  apiKeyId: number
): Promise<void> => {
  await api.delete(`/organisations/${organisationId}/api-keys/${apiKeyId}`);
};
