import { api } from "./index";
import { LoginRequest, LoginResponse, RefreshTokenResponse } from "../interfaces/auth.interface";

export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
  return await api.post("/auth/login", credentials);
}

export async function logoutApi(): Promise<void> {
  return await api.post("/auth/logout");
}

export async function refreshApi(): Promise<RefreshTokenResponse> {
  return await api.post("/auth/refresh");
}
