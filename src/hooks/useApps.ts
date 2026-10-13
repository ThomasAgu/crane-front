import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppService } from "@/lib/api/appService";
import type { AppDto } from "@/lib/dto/AppDto";

export const APPS_QUERY_KEY = ["apps"] as const;

export function useApps() {
  const queryClient = useQueryClient();
  const {
    data: apps = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: APPS_QUERY_KEY,
    queryFn: AppService.getAll,
  });
  const refreshApps = useCallback(async () => {
    await refetch();
  }, [refetch]);
  const removeApp = useCallback((appId: AppDto["id"]) => {
    queryClient.setQueryData<AppDto[]>(APPS_QUERY_KEY, (currentApps = []) =>
      currentApps.filter((app) => app.id !== appId)
    );
  }, [queryClient]);

  return {
    apps,
    loading,
    error: error ? "No se pudieron cargar las aplicaciones" : null,
    refreshApps,
    removeApp,
  };
}