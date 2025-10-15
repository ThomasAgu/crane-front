import { RolesDto } from "../dto/RolesDto";
import { getToken } from "@/src/app/services/JWTService";
import { API_URL } from "./baseService";

export async function getRoles(): Promise<RolesDto[]> {
  const token = getToken();

  const response = await fetch(`${API_URL}/roles`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  if (!response.ok) throw new Error("No se pudieron obtener los roles");
  return response.json();
}

export async function createRole(name: string): Promise<void> {
  const token = getToken();

  const response = await fetch(`${API_URL}/roles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) throw new Error("No se pudo crear el rol");
}

export async function deleteRole(roleId: number): Promise<void> {
  const token = getToken();

  const response = await fetch(`${API_URL}/roles/${roleId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  });

  if (!response.ok) throw new Error("No se pudo eliminar el rol");
}

export async function getRolesForUser(userID: number): Promise<RolesDto[]> {
  const token = getToken();

  const response = await fetch(`${API_URL}/roles/user/${userID}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  if (!response.ok) throw new Error("No se pudieron obtener los roles");
  return response.json();
}

export async function appendRoleToUser(userID: number, roleID: number) {
  const token = getToken();

  const response = await fetch(`${API_URL}/roles/${roleID}/user/${userID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ userID, roleID }),
  });

  if (!response.ok) throw new Error("No se pudo agregar el rol al usuario");
}

export async function removeRoleToUser(userID: number, roleID: number) {
  const token = getToken();

  const response = await fetch(`${API_URL}/roles/${roleID}/user/${userID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ userID, roleID }),
  });

  if (!response.ok) throw new Error("No se pudo remover el rol al usuario");
}


