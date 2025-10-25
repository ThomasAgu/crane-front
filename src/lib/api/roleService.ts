import apiRequest from "./baseService";
import { RolesDto } from "../dto/RolesDto";

//GET
export const getRoles = () =>
  apiRequest<RolesDto[]>("/roles");

export const getRole = (id: string) =>
  apiRequest<void>(`/roles/${id}`);

export const getUserRoles = (userID: number) =>
  apiRequest<RolesDto[]>(`/roles/user/${userID}`);

//POST
export const createRole = (name: string) =>
  apiRequest<void>("/roles", "POST", { name });

export const appendRoleToUser = (userID: number, roleID: number) =>
  apiRequest<void>(`/roles/${roleID}/user/${userID}`, "POST", { userID, roleID });

//DELETE
export const deleteRole = (roleId: number, userId: number) =>
  apiRequest<void>(`/roles/${roleId}/user/${userId}`, "DELETE");

export const removeRoleToUser = (userID: number, roleID: number) =>
  apiRequest<void>(`/roles/${roleID}/user/${userID}`, "DELETE", { userID, roleID });

//PUT
export const updateRole = (roleID: number) =>
  apiRequest<void>(`/roles/${roleID}`, "PUT");
