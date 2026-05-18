import { User } from "./user.interface";

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  user: User;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
}
