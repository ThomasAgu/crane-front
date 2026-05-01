"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { PermissionsProvider } from "./PermissionsProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  // Usamos useState para asegurar que el QueryClient se cree una sola vez por ciclo de vida de la página
  // Esto es crucial en Next.js (por el "use client") para evitar recrear el cache en cada render
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Configuraciones globales útiles:
        staleTime: 1000 * 60 * 5, // 5 minutos de "frescura" por defecto
        refetchOnWindowFocus: false, // Evita que pida data cada vez que cambias de pestaña
        retry: 1, // Reintenta una vez si falla
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <PermissionsProvider>
        {children}
      </PermissionsProvider>
      {/* Las Devtools son clave en desarrollo para ver si el cache está funcionando */}
    </QueryClientProvider>
  );
}