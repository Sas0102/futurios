import api from "@/lib/api";
import { Plan, Subscription } from "../types/subscription";


export async function getPlans(): Promise<Plan[]> {

  const response = await api.get("/plans");

  return response.data;

}


export async function getSubscription(
  organisationId:number
): Promise<Subscription> {

  const response = await api.get(
    `/organisations/${organisationId}/subscription`
  );

  return response.data;

}
