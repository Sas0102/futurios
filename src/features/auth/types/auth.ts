// ---------- Signup ----------

export interface SignupRequest {
  email: string;
  full_name: string;
  password: string;
}

export interface SignupResponse {
  id: number;
  email: string;
  full_name: string;
  is_super_admin: boolean;
}

// ---------- Login ----------

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    full_name: string;
    is_super_admin: boolean;
  };
}
