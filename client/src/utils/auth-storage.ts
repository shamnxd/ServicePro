export const ACCESS_TOKEN_KEY = "accessToken";

export function readAccessToken(): string | null {
  try {
    const token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    return token && token.trim() ? token : null;
  } catch {
    return null;
  }
}

export function writeAccessToken(token: string | null): void {
  try {
    if (token && token.trim()) {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  } catch {
    /* ignore storage errors */
  }
}
