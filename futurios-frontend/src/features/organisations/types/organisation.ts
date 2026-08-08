export interface Organisation {
  id: number;
  name: string;
  slug: string;
}

export interface MyOrganisation extends Organisation {
  role: "admin" | "member" | string;
}

export interface CreateOrganisationRequest {
  name: string;
  slug: string;
}
