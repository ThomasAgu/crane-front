'use client';

import { useEffect, useState } from 'react';
import { RolesDto } from '@/src/lib/dto/RolesDto';
import { PermissionDto } from '@/src/lib/dto/PermissionDto';
import { RoleService } from '@/src/lib/api/roleService';
import { PermissionService } from '@/src/lib/api/permissionService';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';

interface Props {
  roles: RolesDto[];
}

export const RolePermissionsTable = ({ roles }: Props) => {
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const { refreshPermissions } = usePermissions();
  const [allPermissions, setAllPermissions] = useState<PermissionDto[]>([]);
  const [rolePermissions, setRolePermissions] = useState<PermissionDto[]>([]);

  const [loadingPermissions, setLoadingPermissions] = useState(false);

  const fetchAllPermissions = async () => {
    try {
      const perms = await PermissionService.getAll();
      setAllPermissions(perms);
    } catch (err) {
      console.error('Error al obtener todos los permisos:', err);
    }
  };

  const fetchRolePermissions = async (roleId: number) => {
    try {
      setLoadingPermissions(true);
      const perms = await RoleService.getPermissionsRoles(roleId);
      setRolePermissions(perms);
    } catch (err) {
      console.error('Error al obtener permisos del rol:', err);
    } finally {
      setLoadingPermissions(false);
    }
  };

  const handleSelectRole = (roleId: number) => {
    setSelectedRoleId(roleId);
    fetchRolePermissions(roleId);
  };

  const addPermission = async (permissionId: number) => {
    if (!selectedRoleId) return;

    try {
      await RoleService.appendPermissionToRole(selectedRoleId, permissionId);
      await fetchRolePermissions(selectedRoleId);
    } catch (err) {
      console.error('Error al agregar permiso:', err);
    }
  };

  const removePermission = async (permissionId: number) => {
    if (!selectedRoleId) return;

    try {
      await RoleService.removePermissionToRole(selectedRoleId, permissionId);
      await fetchRolePermissions(selectedRoleId);
    } catch (err) {
      console.error('Error al quitar permiso:', err);
    }
  };

  const handleClickActualizarPermisos = async () => {
    try {
      await PermissionService.save();
      await refreshPermissions();        // frontend refresca permisos actualizado
    }
    catch (err) {
      console.error("❌ Error al actualizar permisos:", err);
    }
  }

  useEffect(() => {
    fetchAllPermissions();
  }, []);

  const unassignedPermissions = allPermissions.filter(
    (p) => !rolePermissions.some((rp) => rp.id === p.id)
  );

  return (
  <div className="bg-white rounded-xl shadow-sm border border-[var(--light-grey)] mt-4">
    <div className="p-4 border-b rounded-xl border-[var(--light-grey)] flex items-center justify-between bg-gray-50">
      <h2 className="text-lg font-semibold">Permisos</h2>
      <select 
        className="border border-[var(--primary-blue)] rounded-lg px-2 p-2 bg-[var(--white)] text-[var(--primary-blue)] font-medium outline-none"
        onChange={(e) => handleSelectRole(Number(e.target.value))}
      >
        <option value="">Selecciona un Rol para editar</option>
        {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
      </select>
    </div>

    {selectedRoleId && (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Panel Disponibles */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[var(--greyest-blue)] uppercase">Disponibles</h3>
          <div className="border border-[var(--light-grey)] rounded-lg h-[400px] overflow-y-auto bg-gray-50/50 p-2">
            {unassignedPermissions.map(perm => (
              <div key={perm.id} className="flex items-center justify-between bg-white p-3 mb-2 rounded shadow-sm border border-transparent hover:border-[var(--primary-blue)] transition">
                <span className="text-sm font-medium">{perm.object} <b className="text-[var(--light-blue-grey)]">({perm.action})</b> | <i>{perm.description}</i></span>
                <button onClick={() => addPermission(perm.id)} className="text-[var(--primary-blue)] hover:bg-blue-50 p-1 rounded-full">
                  <PlusIcon size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Panel Asignados */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-green-600 uppercase">Asignados</h3>
          <div className="border border-[var(--success)]/20 rounded-lg h-[400px] overflow-y-auto bg-[var(--success)]/5 p-2">
            {rolePermissions.map(perm => (
              <div key={perm.id} className="flex items-center justify-between bg-white p-3 mb-2 rounded shadow-sm border border-transparent hover:border-[var(--primary-blue)] transition">
                <span className="text-sm font-medium">{perm.object}  <b className="text-[var(--light-blue-grey)]">({perm.action})</b>  | <i>{perm.description}</i></span>
                <button onClick={() => removePermission(perm.id)} className="text-[var(--error)] hover:bg-red-50 p-1 rounded-full">
                  <TrashIcon size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <button className="bg-[var(--primary-blue)] w-50 text-white px-4 py-2 rounded-lg hover:opacity-90 transition" onClick={handleClickActualizarPermisos}>Actualizar</button>
      </div>
    )}
  </div>
);
};
