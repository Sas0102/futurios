import api from "@/lib/api";

import {
  CreateMembershipRequest,
  CreateOrganisationRequest,
  Membership,
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

export const getOrganisation = async (
  organisationId: number
): Promise<Organisation> => {
  const response = await api.get(`/organisations/${organisationId}`);
  return response.data;
};

export const getMembers = async (
  organisationId: number
): Promise<Membership[]> => {
  const response = await api.get(`/organisations/${organisationId}/members`);
  return response.data;
};

export const addMember = async (
  organisationId: number,
  data: CreateMembershipRequest
): Promise<Membership> => {
  const response = await api.post(
    `/organisations/${organisationId}/members`,
    data
  );
  return response.data;
};
