import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { ApiRoute } from "../constants/routes.enum";

type AuthCallbacks = {
  setAccessToken: (token: string) => void;
  logout: () => void;
};

type StoreLike = {
  getState: () => { auth: { accessToken: string | null } };
};

function resolveAccessToken(store: StoreLike | null): string | null {
  const token = store?.getState().auth.accessToken;
  return token?.trim() ? token.trim() : null;
}

function attachBearerToken(config: InternalAxiosRequestConfig, token: string): void {
  const bearer = `Bearer ${token}`;
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }
  if (config.headers instanceof AxiosHeaders) {
    config.headers.set("Authorization", bearer);
  } else {
    (config.headers as Record<string, string>).Authorization = bearer;
  }
}

export const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

let authCallbacks: AuthCallbacks | null = null;
let boundStore: StoreLike | null = null;
let responseInterceptorId: number | null = null;

export const setupInterceptors = (store: StoreLike, callbacks: AuthCallbacks) => {
  boundStore = store;
  authCallbacks = callbacks;

  if (responseInterceptorId !== null) {
    api.interceptors.response.eject(responseInterceptorId);
  }

  responseInterceptorId = api.interceptors.response.use(
    (response) => response.data,
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

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
          } as InternalAxiosRequestConfig & { _retry?: boolean });

          const newAccessToken =
            (refreshResponse as { accessToken?: string })?.accessToken ??
            (refreshResponse as { data?: { accessToken?: string } })?.data?.accessToken;

          if (!newAccessToken) {
            throw new Error("Refresh response missing accessToken");
          }

          authCallbacks?.setAccessToken(newAccessToken);
          attachBearerToken(originalRequest, newAccessToken);
          return api(originalRequest);
        } catch (refreshError) {
          authCallbacks?.logout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

api.interceptors.request.use(
  (config) => {
    if (!boundStore) return config;
    const token = resolveAccessToken(boundStore);
    if (token) {
      attachBearerToken(config, token);
    }
    return config;
  },
  (error) => Promise.reject(error)
);
