// Clase para manejar las peticiones a la API, incluyendo el manejo de JWT y expiración de sesión.
import { getToken, isTokenExpired, removeToken } from "@/app/services/JWTService";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

type HttpMethod = "GET" | "POST" | "DELETE" | "PUT" | "PATCH";

export function handleLogout(): void {
  removeToken();
  if (typeof window !== "undefined" && window.location.pathname !== "/auth/login") {
    window.location.href = "/auth/login";
  }
}

async function apiRequest<T>(
  endpoint: string,
  method: HttpMethod = "GET",
  body?: unknown,
  auth: boolean = true
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    if (isTokenExpired()) {
      handleLogout();
      throw new Error("La sesión ha expirado.");
    }

    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && auth) {
    handleLogout();
    throw new Error("Sesión no autorizada o expirada.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.detail || errorData?.message || `Error ${response.status}: ${endpoint}`;
    throw new Error(errorMessage);
  }

  return response.json();
}

export default apiRequest;