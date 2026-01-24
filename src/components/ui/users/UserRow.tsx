import { UserDataDto } from "@/src/lib/dto/UserDto";
import { RoleLabel } from "./RoleLabel";
import { RoleSelector } from "./RoleSelector";
import { RoleService } from "@/src/lib/api/roleService";
import { RolesDto } from "@/src/lib/dto/RolesDto";
import { UserService } from "@/src/lib/api/userService";
import { useAlert, AlertSnackbar } from "@/src/components/ui/AlertSnackbar";
interface UserRowProps {
  user: UserDataDto;
  onUserUpdated: () => void;
  roles: RolesDto[];
}

export const UserRow: React.FC<UserRowProps> = ({ user, onUserUpdated, roles }) => {
  
  const { alertState, showAlert, handleCloseAlert } = useAlert();
  const handleRemoveRole = async (roleId: string) => {
    try {
      await RoleService.removeToUser(Number(user.id), Number(roleId));
      onUserUpdated();
    } catch (err) {
      console.error("❌ Error al eliminar rol del usuario:", err);
    }
  };

  const handleAddRole = async (roleId: string) => {
    try {
      await RoleService.appendToUser(Number(user.id), Number(roleId));
      onUserUpdated();
    } catch (err) {
      console.error("❌ Error al agregar rol al usuario:", err);
    }
  };

  const handleDisableUser = async () => {
    try {
      await UserService.disable(Number(user.id));
      onUserUpdated();
      showAlert(
        "El usuario ha sido deshabilitado exitosamente.",
        "info",
        "Usuario Deshabilitado"
      );
    }
    catch (err) {
      console.error("❌ Error al deshabilitar usuario:", err);
    }
  };

  const handleEnableUser = async () => {
    try {
      await UserService.enable(Number(user.id));
      onUserUpdated();
      showAlert(
        "El usuario ha sido habilitado exitosamente.",
        "success",
        "Usuario Habilitado"
      );
    }
    catch (err) {
      console.error("❌ Error al habilitar usuario:", err);
    }
  };

  return (
    <>
      <tr key={user.id}>
        <td className="border px-4 py-2 text-center">{user.id}</td>

        <td className="border px-4 py-2">{user.full_name}</td>

        <td className="border px-4 py-2">{user.email}</td>

        <td className="border px-4 py-2">{user.username}</td>

        <td className="border px-4 py-2 text-center">
          <label className="inline-flex items-center cursor-pointer">
            <span className="mr-2 text-sm font-medium">
              {user.is_active ? "Activo" : "Inactivo"}
            </span>
            <input
              type="checkbox"
              checked={user.is_active}
              onChange={() =>
                user.is_active ? handleDisableUser() : handleEnableUser()
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer 
                peer-checked:bg-green-600 relative transition">
              <div className="absolute top-[2px] left-[2px] peer-checked:translate-x-5 
                  bg-white w-5 h-5 rounded-full transition"></div>
            </div>
          </label>
        </td>



        <td className="border px-4 py-2">
          {user.roles.map((r) => (
            <RoleLabel 
              key={r.id} 
              id={r.id.toString()} 
              roleName={r.name} 
              onRemove={handleRemoveRole} 
              canRemove={user.roles.length > 1}/>
          ))}
          <RoleSelector 
            availableRoles={roles.filter(role => !user.roles.some(userRole => userRole.id === role.id))}
            onAddRole={handleAddRole}
            canAdd={user.roles.length < roles.length}
          />
        </td>

      </tr>
      <AlertSnackbar
        alertState={alertState}
        handleCloseAlert={handleCloseAlert}
      />
    </>

  )
}