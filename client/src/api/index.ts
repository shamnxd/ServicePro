import axios, { AxiosHeaders } from "axios";
import { setCredentials, logOut } from "../store/slices/authSlice";
import { ApiRoute } from "../constants/routes.enum";

const ACCESS_TOKEN_KEY = "accessToken";

function getAccessToken(store: { getState: () => { auth: { accessToken: string | null } } }): string | null {
  const fromStore = store.getState().auth.accessToken;
  if (fromStore) return fromStore;
  try {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
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
  withCredentials: true, // Transmit HTTP-only cookies (refresh token)
});

/**
 * Configure request & response interceptors dynamically with the Redux Store
 */
export const setupInterceptors = (store: any) => {
  // Request Interceptor: Automatically attach Bearer token (Redux + sessionStorage)
  api.interceptors.request.use(
    (config) => {
      const token = getAccessToken(store);
      if (token) {
        attachBearerToken(config, token);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor: Self-healing token refresh logic on 401 Unauthorized
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

          store.dispatch(setCredentials({ accessToken: newAccessToken }));
          attachBearerToken(originalRequest, newAccessToken);
          return api(originalRequest);
        } catch (refreshError) {
          store.dispatch(logOut());
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};
