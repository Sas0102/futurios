import api from "@/lib/api";
import {
  SignupRequest,
  SignupResponse,
  LoginRequest,
  LoginResponse,
  AuthUser,
} from "../types/auth";

// Signup
export const signup = async (
  data: SignupRequest
): Promise<SignupResponse> => {
  const response = await api.post("/signup", data);
  return response.data;
};

// Login
export const login = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post("/login", data);
  return response.data;
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  const response = await api.get("/auth/me");
  return response.data;
};
