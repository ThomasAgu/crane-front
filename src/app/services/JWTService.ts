
export function getToken(): String {
  const jwt = localStorage.getItem("access_token");
  if (!jwt) throw new Error("No hay token en localStorage");
  return jwt;
}