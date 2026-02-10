import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

interface Props {
  object: string;
  action: string;
  children: React.ReactNode;
  loadingFallback?: React.ReactNode;
}

export const RequirePermission = ({
  object,
  action,
  children,
  loadingFallback = null
}: Props) => {
  const { hasPermission, loading, permissions } = usePermissions();
  
  if (loading) return loadingFallback;
  if (!hasPermission(object, action)) return null;
  return <>{children}</>;
};
