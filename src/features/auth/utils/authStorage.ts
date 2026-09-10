import { AuthUser, LoginResponse } from "../types/auth";

const ACCESS_TOKEN_KEY = "access_token";
const USER_KEY = "user";
const CURRENT_ORGANISATION_ID_KEY = "current_organisation_id";

const getAuthStorage = (): Storage | null => {
  if (typeof window === "undefined") return null;

  return window.localStorage.getItem(ACCESS_TOKEN_KEY)
    ? window.localStorage
    : window.sessionStorage.getItem(ACCESS_TOKEN_KEY)
      ? window.sessionStorage
      : null;
};

export const getAccessToken = () => {
  return getAuthStorage()?.getItem(ACCESS_TOKEN_KEY) ?? null;
};

export const storeAuthSession = (
  session: LoginResponse,
  rememberMe = true
) => {
  if (typeof window === "undefined") return;

  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  const staleStorage = rememberMe ? window.sessionStorage : window.localStorage;

  storage.setItem(ACCESS_TOKEN_KEY, session.access_token);
  storage.setItem(USER_KEY, JSON.stringify(session.user));
  staleStorage.removeItem(ACCESS_TOKEN_KEY);
  staleStorage.removeItem(USER_KEY);
  staleStorage.removeItem(CURRENT_ORGANISATION_ID_KEY);
};

export const clearAuthSession = () => {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(CURRENT_ORGANISATION_ID_KEY);
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(CURRENT_ORGANISATION_ID_KEY);
};

export const getStoredUser = (): AuthUser | null => {
  const value = getAuthStorage()?.getItem(USER_KEY);
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const storeCurrentUser = (user: AuthUser) => {
  getAuthStorage()?.setItem(USER_KEY, JSON.stringify(user));
};

export const getActiveAuthStorage = () => getAuthStorage();
