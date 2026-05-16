import React, { useEffect, useState, useCallback } from 'react';
import { PermissionsContext } from '../context/PermissionContext';
import { PermissionDto } from '../lib/dto/PermissionDto';
import { RoleService } from '../lib/api/roleService';

export const PermissionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [permissions, setPermissions] = useState<PermissionDto[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPermissions = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        setPermissions([]);
        setLoading(false);
        return;
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles = await RoleService.getUserRoles(payload.user_id);

      const permissionSet = new Map<string, PermissionDto>();

      for (const role of roles) {
        const perms = await RoleService.getPermissionsRoles(role.id);

        for (const perm of perms) {
          const key = `${perm.object}:${perm.action}`;
          if (!permissionSet.has(key)) {
            permissionSet.set(key, perm);
          }
        }
      }

      setPermissions([...permissionSet.values()]);
    } catch (err) {
      console.error("Error fetching permissions", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  const hasPermission = useCallback(
    (object: string, action: string) =>
      permissions.some(p => p.object === object && p.action === action),
    [permissions]
  );

  return (
    <PermissionsContext.Provider 
      value={{ 
        permissions, 
        hasPermission, 
        loading,
        refreshPermissions: loadPermissions
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};