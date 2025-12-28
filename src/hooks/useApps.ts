import { useState, useEffect, useCallback } from "react";
import { AppDto } from "@/src/lib/dto/AppDto";
import { AppService } from "@/src/lib/api/appService";

export function useApps() {
  const [apps, setApps] = useState<AppDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApps = useCallback(async () => {
    try {
      const data = await AppService.getAll();
      setApps(data);
    } catch (err) {
      console.error("Error cargando las apps:", err);
      setError("No se pudieron cargar las aplicaciones");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  return { 
    apps, 
    loading, 
    error, 
    refreshApps: fetchApps 
  };
}