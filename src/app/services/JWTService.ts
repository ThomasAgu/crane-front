
export function getToken(): string {
  const jwt = localStorage.getItem("access_token");
  if (!jwt) throw new Error("No hay token en localStorage");
  return jwt;
}

export function setToken(token: string, tokenType: string): void {
  localStorage.setItem("access_token", token);
  localStorage.setItem("token_type", tokenType);
}