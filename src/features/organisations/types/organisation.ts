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

export interface Membership {
  id: number;
  user_id: number;
  organisation_id: number;
  role: "admin" | "member" | string;
  user_email: string;
  user_full_name: string;
}

export interface CreateMembershipRequest {
  email: string;
  role?: "admin" | "member";
}
