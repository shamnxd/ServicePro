import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiFetch, setInMemoryToken, ApiError } from "../../lib/api";

export interface User {
  id: string;
  username: string;
  email: string;
}

interface LoginResponse {
  success: boolean;
  accessToken: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Utility helper to decode user payload claims securely from JWT
 */
function decodeJwt(token: string): User | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload) as User;
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Silent session restore check on mount
  useEffect(() => {
    async function restoreSession() {
      try {
        const response = await fetch("http://localhost:5000/api/v1/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          const token = data.accessToken;
          setInMemoryToken(token);
          const decodedUser = decodeJwt(token);
          if (decodedUser) {
            setUser(decodedUser);
          }
        }
      } catch (err) {
        console.warn("Silent session restoration failed", err);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setError(null);
    try {
      const data = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.success && data.accessToken) {
        setInMemoryToken(data.accessToken);
        setUser(data.user);
      } else {
        throw new Error("Invalid response schema from authentication server");
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during sign-in");
      }
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Failed to perform logout on server", err);
    } finally {
      setInMemoryToken(null);
      setUser(null);
      setError(null);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be consumed within an AuthProvider");
  }
  return context;
}
