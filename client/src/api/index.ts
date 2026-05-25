import axios, { AxiosHeaders } from "axios";
import { ApiRoute } from "../constants/routes.enum";
import { readAccessToken, writeAccessToken } from "../utils/auth-storage";

type AuthCallbacks = {
  setAccessToken: (token: string) => void;
  logout: () => void;
};

type StoreLike = {
  getState: () => { auth: { accessToken: string | null } };
};

function resolveAccessToken(store?: StoreLike | null): string | null {
  const fromStorage = readAccessToken();
  if (fromStorage) return fromStorage;
  const fromStore = store?.getState().auth.accessToken;
  return fromStore && fromStore.trim() ? fromStore : null;
}

function attachBearerToken(config: import("axios").InternalAxRequestConfig, token: string) {
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }
  if (config.headers instanceof AxiosHeaders) {
    config.headers.set("Authorization", `Bearer ${token}`);
  } else {
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
}

export const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

let authCallbacks: AuthCallbacks | null = null;

/**
 * Wire interceptors after the Redux store exists. Callbacks avoid importing authSlice here
 * (circular dependency: authSlice → auth.api → index.ts).
 */
export const setupInterceptors = (store: StoreLike, callbacks: AuthCallbacks) => {
  authCallbacks = callbacks;

  api.interceptors.request.use(
    (config) => {
      const token = resolveAccessToken(store);
      if (token) {
        attachBearerToken(config, token);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response.data,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("/auth/login") &&
        !originalRequest.url?.includes("/auth/refresh")
      ) {
        originalRequest._retry = true;
        try {
          const refreshResponse = await api.post(ApiRoute.AUTH_REFRESH, {}, {
            _retry: true,
          } as import("axios").AxiosRequestConfig & { _retry?: boolean });

          const newAccessToken =
            refreshResponse?.accessToken ??
            (refreshResponse as { data?: { accessToken?: string } })?.data?.accessToken;

          if (!newAccessToken) {
            throw new Error("Refresh response missing accessToken");
          }

          writeAccessToken(newAccessToken);
          authCallbacks?.setAccessToken(newAccessToken);
          attachBearerToken(originalRequest, newAccessToken);
          return api(originalRequest);
        } catch (refreshError) {
          writeAccessToken(null);
          authCallbacks?.logout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};
