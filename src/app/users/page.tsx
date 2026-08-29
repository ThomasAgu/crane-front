"use client";
import styles from "./users.module.css";

import { useEffect, useState } from "react";
import { RoleService } from "@/lib/api/roleService";
import { UserService } from "@/lib/api/userService";

import { RolesDto } from "@/lib/dto/RolesDto";
import { PermissionDto } from "@/lib/dto/PermissionDto";
import { UserDataDto } from "@/lib/dto/UserDto";

import NavBar from "../../components/layout/NavBar";
import { RolesMiniTable } from "./RolesMiniTable";
import { PermissionService } from "@/lib/api/permissionService";
import { RolePermissionsTable } from "@/app/users/RolePermissionTable";
import { UserTable } from "./UsersTable";
import { useAlert, AlertSnackbar } from "@/components/ui/AlertSnackbar";

export default function HomePage() {
  const [roles, setRoles] = useState<RolesDto[]>([]);
  const [newRole, setNewRole] = useState("");
  const [users, setUsers] = useState<UserDataDto[]>([]);
  const [permissions, setPermissions] = useState<PermissionDto[]>([]);
  const { alertState, showAlert, handleCloseAlert } = useAlert();

  const fetchRoles = async () => {
    try {
      const data = await RoleService.getAll();
      setRoles(data);
    } catch (err) {
      console.error("❌ Error al obtener roles:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const users = await UserService.getAll();
      setUsers(users);
    } catch (err) {
      console.error("❌ Error al obtener usuarios:", err);
    }
  };

  const fetchPermissions = async () => {
    try {
      const permissions = await PermissionService.getAll();
      setPermissions(permissions);
    } catch (err) {
      console.error("❌ Error al obtener permisos:", err);
    }
  };

  const roleExist = (): boolean => {
    return roles.some((role) => role.name.toLowerCase() === newRole.trim().toLowerCase());
  };

  const handleCreateRole = async () => {
    if (!newRole.trim()) return;
    if (roleExist()) {
      showAlert("El rol que intentas crear ya existe.", "warning", "Rol Duplicado");
      return;
    }

    try {
      await RoleService.create(newRole);
      showAlert("El rol ha sido creado exitosamente.", "success", "Rol Creado");
      setNewRole("");
      await fetchRoles();
    } catch (err) {
      console.error("❌ Error al crear rol:", err);
    }
  };

  const canDeleteRole = (roleId: number): boolean => {
    const roleInUse = getAllRolesInUse().some((role) => role.id === roleId);
    const builtInRole = roles.find((role) => role.id === roleId)?.built_in;
    return !roleInUse && !builtInRole;
  };

  const handleDeleteRole = async (id: number) => {
    try {
      await RoleService.delete(Number(id));
      setRoles((currentRoles) => currentRoles.filter((r) => r.id !== id));
    } catch (err) {
      console.error("❌ Error al eliminar rol:", err);
      showAlert("No se pudo eliminar el rol.", "error", "Error");
    }
  };

  const getAllRolesInUse = (): RolesDto[] => {
    const usedRoleIds = users.flatMap((user) => user.roles.map((role) => role.id));
    return roles.filter((role) => usedRoleIds.includes(role.id));
  };

  useEffect(() => {
    fetchRoles();
    fetchUsers();
    fetchPermissions();
  }, []);

  return (
    <NavBar>
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Administración</p>
          <h1 className={styles.title}>Usuarios y permisos</h1>
          <p className={styles.subtitle}>Administra usuarios, roles y accesos del sistema.</p>
        </header>

        <div className={styles.grid}>
          <section className={styles.usersPanel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Usuarios</h2>
            </div>
            <div className={styles.panelBody}>
              <UserTable users={users} roles={roles} fetchUsers={fetchUsers} onShowAlert={showAlert} />
            </div>
          </section>

          <aside className={styles.rolesPanel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Roles</h2>
            </div>
            <div className={styles.rolesPanelBody}>
              <div className={styles.createRoleRow}>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className={styles.roleInput}
                  placeholder="Nuevo rol..."
                />
                <button onClick={handleCreateRole} className={styles.primaryButton}>
                  Agregar
                </button>
              </div>
              <div className={styles.roleListWrap}>
                <RolesMiniTable roles={roles} onDelete={handleDeleteRole} canDelete={canDeleteRole} onShowAlert={showAlert} />
              </div>
            </div>
          </aside>

          <section className={styles.permissionsPanel}>
            <RolePermissionsTable roles={roles} />
          </section>

          <AlertSnackbar alertState={alertState} handleCloseAlert={handleCloseAlert} />
        </div>
      </main>
    </NavBar>
  );
}
