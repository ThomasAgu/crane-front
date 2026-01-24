import apiRequest from "./apiClient";
import { RolesDto } from "../dto/RolesDto";
import { PermissionDto } from "../dto/PermissionDto";

//GET
const getRoles = () =>
  apiRequest<RolesDto[]>("/roles");

const getRole = (id: string) =>
  apiRequest<void>(`/roles/${id}`);

const getUserRoles = (userID: number) =>
  apiRequest<RolesDto[]>(`/roles/user/${userID}`);

const getPermissionsRoles = (roleID: number) =>
  apiRequest<PermissionDto[]>(`/roles/${roleID}/permissions`);

//POST
const createRole = (name: string) =>
  apiRequest<void>("/roles", "POST", { name });

const appendRoleToUser = (userID: number, roleID: number) =>
  apiRequest<void>(`/roles/${roleID}/user/${userID}`, "POST", { userID, roleID });

const appendPermissionToRole = (roleID: number, permissionID: number) =>
  apiRequest<void>(`/roles/${roleID}/permissions/${permissionID}`, "POST", { roleID, permissionID });

//DELETE
const deleteRole = (roleId: number) =>
  apiRequest<void>(`/roles/${roleId}`, "DELETE");

const removeRoleToUser = (userID: number, roleID: number) =>
  apiRequest<void>(`/roles/${roleID}/user/${userID}`, "DELETE", { userID, roleID });

const removePermissionToRole = (roleID: number, permissionID: number) =>
  apiRequest<void>(`/roles/${roleID}/permissions/${permissionID}`, "DELETE", { roleID, permissionID });

//PATCH
const updateRole = (roleID: number) =>
  apiRequest<void>(`/roles/${roleID}`, "PUT");

export const RoleService = {
  getAll: getRoles,
  get: getRole,
  getUserRoles,
  getPermissionsRoles,
  create: createRole,
  appendToUser: appendRoleToUser,
  appendPermissionToRole,
  delete: deleteRole,
  removeToUser: removeRoleToUser,
  removePermissionToRole,
  update: updateRole
};