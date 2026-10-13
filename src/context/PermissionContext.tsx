import { createContext } from 'react';
import { PermissionDto } from '../lib/dto/PermissionDto';
import type { RolesDto } from '../lib/dto/RolesDto';

export interface PermissionsContextType {
  permissions: PermissionDto[];
  roles: RolesDto[];
  hasPermission: (object: string, action: string) => boolean;
  loading: boolean;
  refreshPermissions: () => Promise<void>; 
}

export const PermissionsContext = createContext<PermissionsContextType>({
  permissions: [],
  roles: [],
  hasPermission: () => false,
  loading: true,
  refreshPermissions: async () => {}
});