import axios from "axios";
import { getAccessToken } from "@/features/auth/utils/authStorage";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {

    if (typeof window !== "undefined") {

      const token = getAccessToken();

      if (token) {
        config.headers.Authorization =
          `Bearer ${token}`;
      }

    }

    return config;

  },
  (error) => {
    return Promise.reject(error);
  }
);


export default api;
