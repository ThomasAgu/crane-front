import { getToken } from "@/src/app/services/JWTService";
import { API_URL } from "./baseService";
import { UserDto } from "../dto/UserDto";


// Funcion para get usuarios
export async function getUsers(): Promise<UserDto[]> {
  const token = getToken();

  const response = await fetch(`${API_URL}/user`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  if (!response.ok) throw new Error("No se pudieron obtener los usuarios");
  return response.json();
}
// Funcion para eliminar usuario