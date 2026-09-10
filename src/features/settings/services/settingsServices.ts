import api from "@/lib/api";
import { SettingsData, UserProfile } from "../types/settings";

export const getSettings = async (organisationId: number): Promise<SettingsData> => {
  const [userResponse, organisationResponse] = await Promise.all([
    api.get<UserProfile>("/auth/me"),
    api.get(`/organisations/${organisationId}`),
  ]);
  return { user: userResponse.data, organisation: organisationResponse.data };
};

export const updateProfile = async (data: {
  full_name: string | null;
  email: string;
}): Promise<UserProfile> => {
  const response = await api.patch<UserProfile>("/auth/me", data);
  return response.data;
};
