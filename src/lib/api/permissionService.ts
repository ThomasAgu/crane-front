import apiRequest from "./apiClient";
import { PermissionDto } from "../dto/PermissionDto";

//GET
const getPermissions = () =>
  apiRequest<PermissionDto[]>("/permissions");

//POST
const savePermissions = () =>
  apiRequest<void>("/permissions", "POST");

export const PermissionService = {
  getAll: getPermissions,
  save: savePermissions,
};