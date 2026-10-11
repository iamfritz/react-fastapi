import type { AuthProvider } from "react-admin";
import { API_BASE } from "../services/types";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type LoginResponse = {
  token: string;
  user: AdminUser;
};

function clearSession() {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
}

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: username, password }),
    });
    const result = (await response.json().catch(() => null)) as
      | LoginResponse
      | { detail?: { message?: string } }
      | null;

    if (!response.ok || !result || !("token" in result) || !result.token) {
      const message =
        result && "detail" in result
          ? result.detail?.message
          : undefined;
      throw new Error(message || "Unable to sign in with those credentials");
    }

    localStorage.setItem("admin_token", result.token);
    localStorage.setItem("admin_user", JSON.stringify(result.user));
  },
  logout: () => {
    clearSession();
    return Promise.resolve();
  },
  checkAuth: () =>
    getToken()
      ? Promise.resolve()
      : Promise.reject(new Error("Authentication required")),
  checkError: (error) => {
    if (error.status === 401) {
      clearSession();
      return Promise.reject(new Error("Session expired. Please sign in again."));
    }
    return Promise.resolve();
  },
  getIdentity: () => {
    const user = localStorage.getItem("admin_user");
    if (!user) {
      return Promise.reject(new Error("User identity is unavailable"));
    }
    try {
      return Promise.resolve(JSON.parse(user) as AdminUser);
    } catch (error) {
      clearSession();
      return Promise.reject(error);
    }
  },
  getPermissions: () => {
    const user = localStorage.getItem("admin_user");
    if (!user) {
      return Promise.reject(new Error("User permissions are unavailable"));
    }
    try {
      const { role } = JSON.parse(user) as AdminUser;
      return Promise.resolve(role);
    } catch (error) {
      clearSession();
      return Promise.reject(error);
    }
  },
};

function getToken() {
  return localStorage.getItem("admin_token");
}
