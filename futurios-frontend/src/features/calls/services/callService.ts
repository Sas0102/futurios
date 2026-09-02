import api from "@/lib/api";

import {
  Appointment,
  CallbackRequest,
  CallSummary,
} from "../types/call";

export const getCallSummaries = async (
  organisationId: number
): Promise<CallSummary[]> => {
  const response = await api.get(
    `/organisations/${organisationId}/call-summaries`
  );
  return response.data;
};

export const getAppointments = async (
  organisationId: number
): Promise<Appointment[]> => {
  const response = await api.get(
    `/organisations/${organisationId}/appointments`
  );
  return response.data;
};

export const getCallbackRequests = async (
  organisationId: number
): Promise<CallbackRequest[]> => {
  const response = await api.get(
    `/organisations/${organisationId}/callback-requests`
  );
  return response.data;
};
