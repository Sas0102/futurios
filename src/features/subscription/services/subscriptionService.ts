import api from "@/lib/api";


export async function getPlans() {

  const response = await api.get("/plans");

  return response.data;

}


export async function getSubscription(
  organisationId:number
) {

  const response = await api.get(
    `/organisations/${organisationId}/subscription`
  );

  return response.data;

}