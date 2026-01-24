"use client";

import { PermissionsProvider } from "./PermissionsProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PermissionsProvider>
      {children}
    </PermissionsProvider>
  );
}