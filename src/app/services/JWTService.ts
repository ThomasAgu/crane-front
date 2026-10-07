// Helper para manejar el estado y control de la sesion y JWT

export function setToken(token: string, tokenType: string, expirationTime: string): void {
  localStorage.setItem("access_token", token);
  localStorage.setItem("token_type", tokenType);
  localStorage.setItem("expiration_time", expirationTime);
}

export function removeToken(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_type");
  localStorage.removeItem("expiration_time");
}

export function getToken(): string {
  const jwt = localStorage.getItem("access_token");
  if (!jwt) throw new Error("No hay token en localStorage");
  return jwt;
}

export function isTokenExpired(): boolean {
  const expiresAt = localStorage.getItem("expiration_time");
  if (!expiresAt) return true;

  return Date.now() > new Date(expiresAt).getTime();
}