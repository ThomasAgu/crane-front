import { UserDataDto } from "@/lib/dto/UserDto";
import { RoleLabel } from "./RoleLabel";
import { RoleSelector } from "./RoleSelector";
import { RoleService } from "@/lib/api/roleService";
import { RolesDto } from "@/lib/dto/RolesDto";
import { UserService } from "@/lib/api/userService";
import type { AlertSeverity } from "@/components/ui/AlertSnackbar";
import styles from "@/app/users/users.module.css";

interface UserRowProps {
  user: UserDataDto;
  onUserUpdated: () => void;
  roles: RolesDto[];
  onShowAlert: (message: string, severity: AlertSeverity, title?: string) => void;
}

export const UserRow: React.FC<UserRowProps> = ({ user, onUserUpdated, roles, onShowAlert }) => {
  const handleRemoveRole = async (roleId: string) => {
    try {
      await RoleService.removeToUser(Number(user.id), Number(roleId));
      onUserUpdated();
      const removedRoleName = roles.find((role) => role.id === Number(roleId))?.name ?? "Rol";
      onShowAlert(`Se eliminó el rol "${removedRoleName}" del usuario.`, "info", "Rol removido");
    } catch (err) {
      console.error("❌ Error al eliminar rol del usuario:", err);
      onShowAlert("No se pudo eliminar el rol del usuario.", "error", "Error");
    }
  };

  const handleAddRole = async (roleId: string) => {
    try {
      await RoleService.appendToUser(Number(user.id), Number(roleId));
      onUserUpdated();
      const addedRoleName = roles.find((role) => role.id === Number(roleId))?.name ?? "Rol";
      onShowAlert(`Se asignó el rol "${addedRoleName}" al usuario.`, "success", "Rol asignado");
    } catch (err) {
      console.error("❌ Error al agregar rol al usuario:", err);
      onShowAlert("No se pudo asignar el rol al usuario.", "error", "Error");
    }
  };

  const handleDisableUser = async () => {
    try {
      await UserService.disable(Number(user.id));
      onUserUpdated();
      onShowAlert("El usuario ha sido deshabilitado exitosamente.", "info", "Usuario Deshabilitado");
    } catch (err) {
      console.error("❌ Error al deshabilitar usuario:", err);
      onShowAlert("No se pudo deshabilitar el usuario.", "error", "Error");
    }
  };

  const handleEnableUser = async () => {
    try {
      await UserService.enable(Number(user.id));
      onUserUpdated();
      onShowAlert("El usuario ha sido habilitado exitosamente.", "success", "Usuario Habilitado");
    } catch (err) {
      console.error("❌ Error al habilitar usuario:", err);
      onShowAlert("No se pudo habilitar el usuario.", "error", "Error");
    }
  };

  return (
    <tr key={user.id}>
      <td className={styles.td}>{user.full_name}</td>
      <td className={styles.td}>{user.email}</td>

      <td className={`${styles.td} ${styles.statusCell}`}>
        <div className={styles.statusLabelWrap}>
          <span className={`${styles.statusText} ${user.is_active ? styles.statusTextActive : styles.statusTextInactive}`}>
            {user.is_active ? "Activo" : "Inactivo"}
          </span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={user.is_active}
              onChange={() => (user.is_active ? handleDisableUser() : handleEnableUser())}
              className={styles.switchInput}
            />
            <span className={`${styles.switchTrack} ${user.is_active ? styles.switchTrackActive : ""}`} />
          </label>
        </div>
      </td>

      <td className={styles.tdRole}>
        <div className={styles.roleStack}>
          {user.roles.map((r) => (
            <RoleLabel
              key={r.id}
              id={r.id.toString()}
              roleName={r.name}
              onRemove={handleRemoveRole}
              canRemove={user.roles.length > 1}
            />
          ))}
          <RoleSelector
            availableRoles={roles.filter((role) => !user.roles.some((userRole) => userRole.id === role.id))}
            onAddRole={handleAddRole}
            canAdd={user.roles.length < roles.length}
          />
        </div>
      </td>
    </tr>
  );
};