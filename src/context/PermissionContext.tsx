import { createContext } from 'react';
import { PermissionDto } from '../lib/dto/PermissionDto';

export interface PermissionsContextType {
  permissions: PermissionDto[];
  hasPermission: (object: string, action: string) => boolean;
  loading: boolean;
  refreshPermissions: () => Promise<void>; // <-- AGREGADO
}

export const PermissionsContext = createContext<PermissionsContextType>({
  permissions: [],
  hasPermission: () => false,
  loading: true,
  refreshPermissions: async () => {}
});