import React, { FC, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query"; 
import { ReportService } from "@/lib/api/reportService";
import { AppService } from "@/lib/api/appService";
import { StatsReportDto } from "@/lib/dto/StatsReportDto";
import { ContainerStatsDto } from "@/lib/dto/ContainerStats";
import { TimeRange } from "@/lib/types/TimeRange";
import { KPICard } from "./KPICard";
import { MetricsDashboard } from "./OverlappedMetricsDashboard";
import { RealtimeDashboard } from "./RealtimeDashboard";
import { AlertDashboard } from "./AlertDashboard";
import TimeRangeSelector from "./TimeRangeSelector";
import { COLORS, fmt } from "./statsUtils";

export const StatsPanel: FC<{ appId: string; appStatus: string }> = ({ appId, appStatus }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("1h");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<"cpu" | "memory" | "net" | "disk">("cpu");

  // --- QUERY 1: HISTORIAL (Cacheado) ---
  const { data: statsData, isLoading: loadingHistory } = useQuery({
    queryKey: ["stats", appId, timeRange], // Cache único por App y Rango
    queryFn: () => ReportService.getStats(appId, timeRange) as Promise<StatsReportDto>,
    enabled: timeRange !== "0", // No se ejecuta en modo Realtime
    staleTime: 1000 * 60 * 5,   // Considera la data "fresca" por 5 min
    gcTime: 1000 * 60 * 30,     // Mantiene el cache en memoria 30 min aunque no se use
  });

  // --- QUERY 2: REALTIME (Polling) ---
  const { data: realtimeData, isLoading: loadingRealtime } = useQuery({
    queryKey: ["realtime", appId],
    queryFn: async () => {
      const data = await AppService.getStats(appId);
      return (Array.isArray(data) ? data : [data]) as ContainerStatsDto[];
    },
    enabled: timeRange === "0", // Solo se ejecuta si es tiempo real
    refetchInterval: 5000,      // Polling cada 5 seg (reemplaza tu setInterval)
    refetchIntervalInBackground: false, // No gasta red si el usuario cambia de pestaña
  });

  // Estado unificado de carga
  const loading = loadingHistory || loadingRealtime;

  // Lógica para setear el primer servicio disponible (solo una vez por dataset)
  useEffect(() => {
    if (!selectedService) {
      if (timeRange !== "0" && statsData?.data_points?.length) {
        setSelectedService(statsData.data_points[0].container_name);
      } else if (timeRange === "0" && realtimeData?.length) {
        setSelectedService(realtimeData[0].container_name);
      }
    }
  }, [statsData, realtimeData, timeRange, selectedService]);


  const uniqueServices = useMemo(() => {
    if (timeRange === "0" && realtimeData) {
      return realtimeData.map((c) => ({ name: c.container_name, id: c.container_id }));
    }
    if (!statsData?.data_points) return [];
    const serviceMap = new Map<string, string>();
    statsData.data_points.forEach((p) => serviceMap.set(p.container_name, p.container_id));
    return Array.from(serviceMap.entries()).map(([name, id]) => ({ name, id }));
  }, [statsData, realtimeData, timeRange]);

  const selectedServiceData = useMemo(() => {
    if (timeRange === "0" || !statsData?.data_points || !selectedService) return [];
    return statsData.data_points.filter((p) => p.container_name === selectedService);
  }, [statsData, selectedService, timeRange]);

  const kpiMetrics = useMemo(() => {
      if (timeRange === "0" && realtimeData && selectedService) {
        const container = realtimeData.find((c) => c.container_name === selectedService);
        if (!container) {
          return {
            cpu: { min: 0, max: 0, avg: 0 },
            memory: { min: 0, max: 0, avg: 0 },
            diskIO: { readTotal: 0, writeTotal: 0 },
            network: { uploadTotal: 0, downloadTotal: 0 },
          };
        }
  
        const memoryPercentage = (container.memory_used / container.memory_limit) * 100;
  
        return {
          cpu: { min: container.cpu_percentage, max: container.cpu_percentage, avg: container.cpu_percentage },
          memory: { min: memoryPercentage, max: memoryPercentage, avg: memoryPercentage },
          diskIO: {
            readTotal: container.block_read / 1024 / 1024, // Convert to MB
            writeTotal: container.block_write / 1024 / 1024,
          },
          network: {
            uploadTotal: container.net_upload / 1024 / 1024, // Convert to MB
            downloadTotal: container.net_download / 1024 / 1024,
          },
        };
      }
  
      if (!statsData || !selectedService) {
        return {
          cpu: { min: 0, max: 0, avg: 0 },
          memory: { min: 0, max: 0, avg: 0 },
          diskIO: { readTotal: 0, writeTotal: 0 },
          network: { uploadTotal: 0, downloadTotal: 0 },
        };
      }
  
      const summary = statsData.summary?.[selectedService];
  
      // CPU metrics from summary
      const cpuMetrics = summary
        ? {
            min: summary.min_cpu,
            max: summary.max_cpu,
            avg: summary.avg_cpu,
          }
        : { min: 0, max: 0, avg: 0 };
  
      // Memory metrics from summary
      const memoryMetrics = summary
        ? {
            min: summary.min_memory,
            max: summary.max_memory,
            avg: summary.avg_memory,
          }
        : { min: 0, max: 0, avg: 0 };
  
      // Disk I/O totals (sum of read + write)
      const diskTotals = selectedServiceData && selectedServiceData.reduce(
        (acc, point) => ({
          read: acc.read + (point.block_read_mb || 0),
          write: acc.write + (point.block_write_mb || 0),
        }),
        { read: 0, write: 0 }
      ) || { read: 0, write: 0 };
  
      // Network I/O totals (sum of upload + download)
      const netTotals = selectedServiceData && selectedServiceData.reduce(
        (acc, point) => ({
          upload: acc.upload + (point.net_upload_mb || 0),
          download: acc.download + (point.net_download_mb || 0),
        }),
        { upload: 0, download: 0 }
      ) || { upload: 0, download: 0 };
  
      return {
        cpu: cpuMetrics,
        memory: memoryMetrics,
        diskIO: {
          readTotal: diskTotals.read,
          writeTotal: diskTotals.write,
        },
        network: {
          uploadTotal: netTotals.upload,
          downloadTotal: netTotals.download,
        },
      };
    }, [statsData, realtimeData, selectedService, selectedServiceData, timeRange]);
  
  // --- RENDERING ---

  if (timeRange === "0") {
    return (
      <div className="text-black p-6 flex flex-col gap-4 min-h-screen">
        <h1 className="text-xl font-bold mb-4">Estadísticas (Tiempo Real)</h1>
        <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} appStatus={appStatus} />
        <RealtimeDashboard data={realtimeData || null} loading={loading} />
      </div>
    );
  }

  return (
    <div className="text-black ps-6 flex flex-col gap-4 min-h-screen">
      {/* Header & Selector de servicio igual que antes */}
      <div>
        <h2 className="text-xl font-bold mb-4">Estadísticas Históricas</h2>
        <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} appStatus={appStatus} />
      </div>

      {/* Selector de Servicio */}
      {uniqueServices.length > 0 && (
        <div className="flex flex-col gap-2">
           <label className="text-xl font-semibold text-darker">Servicio</label>
           
           <select 
             value={selectedService || ""} 
             onChange={(e) => setSelectedService(e.target.value)}
             className="px-4 py-3 rounded-lg text-darkest border border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:outline-none transition cursor-pointer"
           >
             {uniqueServices.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
           </select>
        </div>
      )}

      {/* KPI Cards & Dashboards */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="w-full xl:w-1/3">
           <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-2 gap-6 h-full">
              <KPICard title="CPU" value={`${fmt(kpiMetrics.cpu.avg, 2)}%`} color={COLORS.cpu} loading={loading} stats={kpiMetrics.cpu} />
              <KPICard title="Memoria" value={`${fmt(kpiMetrics.memory.avg, 2)}%`} color={COLORS.mem} loading={loading} stats={kpiMetrics.memory} />
              <KPICard title="Disco L/E" value={`${fmt(kpiMetrics.diskIO.readTotal, 1)} / ${fmt(kpiMetrics.diskIO.writeTotal, 1)} MB`} color={COLORS.disk} loading={loading} />
              <KPICard title="Red S/B" value={`${fmt(kpiMetrics.network.uploadTotal, 1)} / ${fmt(kpiMetrics.network.downloadTotal, 1)} MB`} color={COLORS.net} loading={loading} />
           </div>
        </div>
        <div className="w-full xl:w-2/3">
          <AlertDashboard appId={appId} timeRange={timeRange} />
        </div>
      </div>

      {selectedServiceData.length > 0 && (
        <MetricsDashboard 
          timeRange={timeRange}
          data={selectedServiceData} 
          selectedMetric={selectedMetric}
          onMetricChange={setSelectedMetric}
          loading={loading}
        />
      )}
    </div>
  );
};