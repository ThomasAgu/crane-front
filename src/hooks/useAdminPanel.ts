import { useCallback, useEffect, useState } from "react";
import { RoleService } from "@/lib/api/roleService";
import { UserService } from "@/lib/api/userService";
import type { RolesDto } from "@/lib/dto/RolesDto";
import type { UserDataDto } from "@/lib/dto/UserDto";
import type { AlertSeverity } from "@/components/ui/AlertSnackbar";

type ShowAlert = (message: string, severity: AlertSeverity, title?: string) => void;

export function useAdminPanel(showAlert: ShowAlert) {
  const [roles, setRoles] = useState<RolesDto[]>([]);
  const [users, setUsers] = useState<UserDataDto[]>([]);
  const [newRole, setNewRole] = useState("");

  const fetchRoles = useCallback(async () => {
    try {
      const data = await RoleService.getAll();
      setRoles(data);
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await UserService.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  }, []);

  useEffect(() => {
    void fetchRoles();
    void fetchUsers();
  }, [fetchRoles, fetchUsers]);

  const handleCreateRole = useCallback(async () => {
    const roleName = newRole.trim();
    if (!roleName) return;

    if (roles.some((role) => role.name.toLowerCase() === roleName.toLowerCase())) {
      showAlert("El rol que intentas crear ya existe.", "warning", "Rol Duplicado");
      return;
    }

    try {
      await RoleService.create(roleName);
      showAlert("El rol ha sido creado exitosamente.", "success", "Rol Creado");
      setNewRole("");
      await fetchRoles();
    } catch (error) {
      console.error("Error al crear rol:", error);
    }
  }, [fetchRoles, newRole, roles, showAlert]);

  const getAllRolesInUse = useCallback(() => {
    const usedRoleIds = new Set(users.flatMap((user) => user.roles.map((role) => role.id)));
    return roles.filter((role) => usedRoleIds.has(role.id));
  }, [roles, users]);

  const canDeleteRole = useCallback((roleId: number) => {
    const roleInUse = getAllRolesInUse().some((role) => role.id === roleId);
    const builtInRole = roles.find((role) => role.id === roleId)?.built_in;
    return !roleInUse && !builtInRole;
  }, [getAllRolesInUse, roles]);

  const handleDeleteRole = useCallback(async (roleId: number) => {
    try {
      await RoleService.delete(roleId);
      setRoles((currentRoles) => currentRoles.filter((role) => role.id !== roleId));
    } catch (error) {
      console.error("Error al eliminar rol:", error);
      showAlert("No se pudo eliminar el rol.", "error", "Error");
    }
  }, [showAlert]);

  return {
    canDeleteRole,
    fetchRoles,
    fetchUsers,
    handleCreateRole,
    handleDeleteRole,
    newRole,
    roles,
    setNewRole,
    users,
  };
}