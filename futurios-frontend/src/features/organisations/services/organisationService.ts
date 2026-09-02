import api from "@/lib/api";

import {
  CreateOrganisationRequest,
  MyOrganisation,
  Organisation,
} from "../types/organisation";

export const createOrganisation = async (
  data: CreateOrganisationRequest
): Promise<Organisation> => {
  const response = await api.post("/organisations", data);
  return response.data;
};

export const getMyOrganisations = async (): Promise<MyOrganisation[]> => {
  const response = await api.get("/me/organisations");
  return response.data;
};
