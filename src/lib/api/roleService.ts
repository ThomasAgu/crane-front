import apiRequest from "./apiClient";
import { RolesDto } from "../dto/RolesDto";

//GET
const getRoles = () =>
  apiRequest<RolesDto[]>("/roles");

const getRole = (id: string) =>
  apiRequest<void>(`/roles/${id}`);

const getUserRoles = (userID: number) =>
  apiRequest<RolesDto[]>(`/roles/user/${userID}`);

//POST
const createRole = (name: string) =>
  apiRequest<void>("/roles", "POST", { name });

const appendRoleToUser = (userID: number, roleID: number) =>
  apiRequest<void>(`/roles/${roleID}/user/${userID}`, "POST", { userID, roleID });

//DELETE
const deleteRole = (roleId: number, userId: number) =>
  apiRequest<void>(`/roles/${roleId}/user/${userId}`, "DELETE");

const removeRoleToUser = (userID: number, roleID: number) =>
  apiRequest<void>(`/roles/${roleID}/user/${userID}`, "DELETE", { userID, roleID });

//PATCH
const updateRole = (roleID: number) =>
  apiRequest<void>(`/roles/${roleID}`, "PUT");

export const RoleService = {
  getAll: getRoles,
  get: getRole,
  getUserRoles,
  create: createRole,
  appendToUser: appendRoleToUser,
  delete: deleteRole,
  removeUser: removeRoleToUser,
  update: updateRole
};