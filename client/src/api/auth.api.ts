import { api } from "./index";
import { User } from "../interfaces/user.interface";
import { LoginResponse, RefreshTokenResponse } from "../interfaces/auth.interface";

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  return await api.post("/auth/login", { email, password });
}

export async function logoutApi(): Promise<void> {
  return await api.post("/auth/logout");
}

export async function refreshApi(): Promise<RefreshTokenResponse> {
  return await api.post("/auth/refresh");
}
