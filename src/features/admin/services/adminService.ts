import api from "@/lib/api";

export interface AdminOrganisation {
  id: number;
  name: string;
  slug: string;
}

export interface DemoRequest {
  id: number;
  name: string;
  email: string;
  company_name: string | null;
  phone_number: string | null;
  message: string | null;
  created_at: string;
}

export interface CreateDemoRequest {
  name: string;
  email: string;
  company_name?: string;
  phone_number?: string;
  message?: string;
}

export async function getAdminOrganisations(): Promise<AdminOrganisation[]> {
  const response = await api.get<AdminOrganisation[]>("/admin/organisations");
  return response.data;
}

export async function getDemoRequests(): Promise<DemoRequest[]> {
  const response = await api.get<DemoRequest[]>("/admin/demo-requests");
  return response.data;
}

export async function createDemoRequest(
  data: CreateDemoRequest
): Promise<DemoRequest> {
  const response = await api.post<DemoRequest>("/demo-requests", data);
  return response.data;
}
