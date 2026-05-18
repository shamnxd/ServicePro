const API_BASE_URL = "http://localhost:5000/api/v1";

let inMemoryToken: string | null = null;
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

export function setInMemoryToken(token: string | null): void {
  inMemoryToken = token;
}

export function getInMemoryToken(): string | null {
  return inMemoryToken;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Native, resilient HTTP client wrapper with automatic silent token refresh
 */
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Setup headers
  const headers = new Headers(options.headers || {});
  if (inMemoryToken) {
    headers.set("Authorization", `Bearer ${inMemoryToken}`);
  }
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: "include", // Ensure httpOnly refresh cookies are transmitted
  };

  const response = await fetch(url, fetchOptions);

  if (response.status === 401 && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/refresh")) {
    // Session token expired, initiate silent refresh
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const newAccessToken = refreshData.accessToken;
          setInMemoryToken(newAccessToken);
          
          // Resolve queued retries
          isRefreshing = false;
          refreshQueue.forEach((callback) => callback(newAccessToken));
          refreshQueue = [];

          // Retry the original request
          headers.set("Authorization", `Bearer ${newAccessToken}`);
          const retryResponse = await fetch(url, { ...fetchOptions, headers });
          if (!retryResponse.ok) {
            const errBody = await retryResponse.json().catch(() => ({}));
            throw new ApiError(retryResponse.status, errBody.message || "Failed retry after token refresh");
          }
          return await retryResponse.json() as T;
        } else {
          isRefreshing = false;
          refreshQueue = [];
          setInMemoryToken(null);
          throw new ApiError(401, "Session expired");
        }
      } catch (err) {
        isRefreshing = false;
        refreshQueue = [];
        setInMemoryToken(null);
        throw err;
      }
    }

    // If another token refresh is already in-flight, queue this request
    return new Promise<T>((resolve, reject) => {
      refreshQueue.push((newAccessToken) => {
        headers.set("Authorization", `Bearer ${newAccessToken}`);
        fetch(url, { ...fetchOptions, headers })
          .then((res) => {
            if (res.ok) return res.json() as Promise<T>;
            throw new ApiError(res.status, "Request failed after refresh");
          })
          .then(resolve)
          .catch(reject);
      });
    });
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorBody.message || "An operational error occurred");
  }

  // Handle empty bodies (e.g. 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return await response.json() as T;
}
