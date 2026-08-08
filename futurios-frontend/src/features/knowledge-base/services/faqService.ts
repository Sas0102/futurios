import api from "@/lib/api";

import { CreateFAQRequest, FAQ } from "../types/faq";

export const getFAQs = async (organisationId: number): Promise<FAQ[]> => {
  const response = await api.get(`/organisations/${organisationId}/faqs`);
  return response.data;
};

export const createFAQ = async (
  organisationId: number,
  data: CreateFAQRequest
): Promise<FAQ> => {
  const response = await api.post(
    `/organisations/${organisationId}/faqs`,
    data
  );
  return response.data;
};
