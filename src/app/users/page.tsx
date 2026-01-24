"use client";
import styles from "./users.module.css"

import { useEffect, useState } from "react";
import { RoleService } from "@/src/lib/api/roleService";
import { UserService } from "@/src/lib/api/userService";

import { RolesDto } from "@/src/lib/dto/RolesDto";
import { PermissionDto } from "@/src/lib/dto/PermissionDto";
import { UserDataDto } from "@/src/lib/dto/UserDto";

import NavBar from "../../components/layout/NavBar";
import { RolesMiniTable } from "./RolesMiniTable";
import { PermissionService } from "@/src/lib/api/permissionService";
import { RolePermissionsTable } from "@/src/app/users/RolePermissionTable";
import { UserTable } from "./UsersTable";
import { useAlert, AlertSnackbar } from "@/src/components/ui/AlertSnackbar";

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
      console.log("Usuarios cargados:", users);
    } catch (err) {
      console.error("❌ Error al obtener usuarios:", err);
    }
  };

  const fetchPermissions = async () => {
    try {
      const permissions = await PermissionService.getAll();
      console.log("Permisos cargados:", permissions);
      setPermissions(permissions);
    } catch (err) {
      console.error("❌ Error al obtener permisos:", err);
    }
  };

  const roleExist = (): boolean => {
    return roles.some((role) => role.name.toLowerCase() === newRole.trim().toLowerCase());
  }

  const handleCreateRole = async () => {
    if (!newRole.trim()) return;
    if (roleExist()) {
      showAlert(
        "El rol que intentas crear ya existe.",
        "warning",
        "Rol Duplicado"
      );
      return;
    }
    try {
      await RoleService.create(newRole);
      showAlert(
        "El rol ha sido creado exitosamente.",
        "success",
        "Rol Creado"
      );
      setNewRole("");
      await fetchRoles();
    } catch (err) {
      console.error("❌ Error al crear rol:", err);
    }
  };

  const canDeleteRole = (roleId: number): boolean => {
    const roleInUse = getAllRolesInUse().some((role) => role.id === roleId);
    const builtInRole = roles.find((role) => role.id === roleId)?.built_in;
    return !roleInUse && !!!builtInRole;
  };

  const handleDeleteRole = async (id: number) => {
    try {
      await RoleService.delete(Number(id));
      setRoles(roles.filter((r) => r.id !== id));
      showAlert(
        "El rol ha sido eliminado exitosamente.",
        "error",
        "Rol Eliminado"
      );
    } catch (err) {
      console.error("❌ Error al eliminar rol:", err);
    }
  };

  const getAllRolesInUse = (): RolesDto[] => {
    const usedRoleIds = users.flatMap((user) =>
      user.roles.map((role) => role.id),
    );
    return roles.filter((role) => usedRoleIds.includes(role.id));
  };

  useEffect(() => {
    fetchRoles();
    fetchUsers();
    fetchPermissions();
  }, []);

  return (
    <NavBar>
      <main className={`p-6 max-w-[1600px] mx-auto ${styles.mainContent}`}>
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[var(--darkest)]">Administracion</h1>
          <p className="text-[var(--greyest-blue)] italic">Administra usuarios, roles y sus permisos asociados.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-transparent rounded-xl shadow-sm border border-[var(--light-grey)] overflow-hidden">
            <div className="p-4 border-b border-[var(--light-grey)] bg-gray-50">
               <h2 className="text-lg font-semibold text-[var(--darker)]">Usuarios</h2>
            </div>
            <div className="max-h-[500px] overflow-auto">
              <UserTable users={users} roles={roles} fetchUsers={fetchUsers}/>
            </div>
          </div>

          {/* Fila 1 - Columna Derecha (Roles) - Ocupa 1/3 en Desktop */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--light-grey)] overflow-hidden">
            <div className="p-4 border-b border-[var(--light-grey)] bg-gray-50 flex justify-between items-center">
               <h2 className="text-lg font-semibold text-[var(--darker)]">Roles</h2>
            </div>
            <div className="p-4 bg-white">
               <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="flex-1 border border-[var(--light-grey)] rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-[var(--primary-blue)] outline-none"
                    placeholder="Nuevo rol..."
                  />
                  <button onClick={handleCreateRole} className="bg-[var(--primary-blue)] text-white px-4 rounded-lg hover:opacity-90 transition">
                    Agregar
                  </button>
               </div>
               <div className="max-h-[400px] overflow-auto">
                 <RolesMiniTable roles={roles} onDelete={handleDeleteRole} canDelete={canDeleteRole} />
               </div>
            </div>
          </div>

          {/* Fila 2 - Permisos (Ancho completo) */}
          <div className="lg:col-span-3">
             <RolePermissionsTable roles={roles} />
          </div>

          <AlertSnackbar
            alertState={alertState}
            handleCloseAlert={handleCloseAlert}
          />
        </div>
      </main>
    </NavBar>
  );
}
