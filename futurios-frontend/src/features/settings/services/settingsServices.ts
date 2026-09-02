import { SettingsData } from "../types/settings";

const unavailableSettingsEndpoint = () =>
  new Error("Settings endpoints are not available in the current backend.");

export const getSettings = async (): Promise<SettingsData> => {
  throw unavailableSettingsEndpoint();
};

export const updateProfile = async (data: {
  full_name: string;
  email: string;
}) => {
  void data;
  throw unavailableSettingsEndpoint();
};

export const updateOrganisation = async (
  organisationId: number,
  data: {
    name: string;
  }
) => {
  void organisationId;
  void data;
  throw unavailableSettingsEndpoint();
};
