export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
import { getToken } from "@/src/app/services/JWTService";

type HttpMethod = "GET" | "POST" | "DELETE" | "PUT" | "PATCH";

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
    const token = getToken();
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error en ${endpoint}: ${errorText}`);
  }

  return response.json();
}

export default apiRequest;