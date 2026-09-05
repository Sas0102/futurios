import { LoginResponse } from "../types/auth";

const ACCESS_TOKEN_KEY = "access_token";
const USER_KEY = "user";
const CURRENT_ORGANISATION_ID_KEY = "current_organisation_id";

export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const storeAuthSession = (session: LoginResponse) => {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(ACCESS_TOKEN_KEY, session.access_token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
};

export const clearAuthSession = () => {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(CURRENT_ORGANISATION_ID_KEY);
};

export const getStoredUser = (): LoginResponse["user"] | null => {
  if (typeof window === "undefined") return null;

  const value = window.localStorage.getItem(USER_KEY);
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};
