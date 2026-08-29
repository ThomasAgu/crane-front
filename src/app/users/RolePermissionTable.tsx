'use client';

import { useEffect, useState } from 'react';
import { RolesDto } from '@/lib/dto/RolesDto';
import { PermissionDto } from '@/lib/dto/PermissionDto';
import { RoleService } from '@/lib/api/roleService';
import { PermissionService } from '@/lib/api/permissionService';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { CustomSelect } from '@/components/ui/users/CustomSelect';
import styles from './users.module.css';

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
      await refreshPermissions();
    } catch (err) {
      console.error('❌ Error al actualizar permisos:', err);
    }
  };

  useEffect(() => {
    fetchAllPermissions();
  }, []);

  const unassignedPermissions = allPermissions.filter(
    (p) => !rolePermissions.some((rp) => rp.id === p.id)
  );

  return (
    <div className={styles.permissionsCard}>
      <div className={styles.permissionsHeader}>
        <h2 className={styles.panelTitle}>Permisos</h2>
        <CustomSelect
          options={roles.map((r) => ({ value: r.id, label: r.name }))}
          value={selectedRoleId ?? ''}
          onChange={(roleId) => handleSelectRole(roleId)}
          placeholder="Selecciona un rol para editar"
          emptyText="No hay roles disponibles"
          triggerClassName={styles.permissionsSelect}
          menuClassName={styles.permissionsMenu}
        />
      </div>

      {selectedRoleId && (
        <div className={styles.permissionsGrid}>
          <div className={styles.permissionsColumn}>
            <h3 className={styles.permissionsColumnTitle}>Disponibles</h3>
            <div className={styles.permissionList}>
              {unassignedPermissions.map((perm) => (
                <div key={perm.id} className={styles.permissionItem}>
                  <span className={styles.permissionText}>
                    {perm.object} <b className={styles.permissionMeta}>({perm.action})</b> | <i>{perm.description}</i>
                  </span>
                  <button onClick={() => addPermission(perm.id)} className={styles.permissionActionButton}>
                    <PlusIcon size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.permissionsColumn}>
            <h3 className={`${styles.permissionsColumnTitle} ${styles.permissionsColumnTitleAssigned}`}>Asignados</h3>
            <div className={styles.permissionListAssigned}>
              {rolePermissions.map((perm) => (
                <div key={perm.id} className={styles.permissionItem}>
                  <span className={styles.permissionText}>
                    {perm.object} <b className={styles.permissionMeta}>({perm.action})</b> | <i>{perm.description}</i>
                  </span>
                  <button onClick={() => removePermission(perm.id)} className={styles.permissionRemoveButton}>
                    <TrashIcon size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button className={styles.updateButton} onClick={handleClickActualizarPermisos}>
            Actualizar
          </button>
        </div>
      )}

      {!selectedRoleId && (
        <div className={styles.emptyPermissionsState}>Selecciona un rol para gestionar sus permisos.</div>
      )}
    </div>
  );
};
