import api from "@/lib/api";
import {
  SignupRequest,
  SignupResponse,
  LoginRequest,
  LoginResponse,
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