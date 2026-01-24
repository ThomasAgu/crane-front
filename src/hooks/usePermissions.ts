import { useContext } from 'react';
import { PermissionsContext } from './../context/PermissionContext';

export const usePermissions = () => useContext(PermissionsContext);

