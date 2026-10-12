import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppService } from "@/lib/api/appService";

export const APPS_QUERY_KEY = ["apps"] as const;

export function useApps() {
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

  return {
    apps,
    loading,
    error: error ? "No se pudieron cargar las aplicaciones" : null,
    refreshApps,
  };
}