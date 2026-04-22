// 1. Agregar un selector de tiempo
// 2. Agregar un dashboard de alertas
// 3. Modificar el layaout 
// 4. Agregar un selector de servicios por aplicacionm
// 5. Integrar el selector de recursos al dashboard principlal
// 6. Modificar el dashboard para mostrar multiples recursos en un mismo grafico (CPU, Memoria, Red, Disco) con la opcion de mostrar/ocultar cada uno
// 7. Agregar las consultas a la API para obtener los datos reales de los contenedores y alimentar el dashboard

import React, { FC, useEffect, useMemo, useState } from "react";
import { ReportService } from "@/src/lib/api/reportService";
import { ContainerStatsDto } from "@/src/lib/dto/ContainerStats";
import { KPICard } from "./KPICard";
import { MainDashboard } from "./MainDashboard";
import {
  COLORS,
  fmt,
  getSingleMetricValue,
  HistItem,
  getTabColor,
  StatsTime,
} from "./statsUtils";
import TimeRangeSelector from "./TimeRangeSelector";
import { TimeRange } from "@/src/lib/types/TimeRange";


export const StatsDashboard: FC<{ histories: HistItem[], appId: string }> = ({ 
  histories, 
  appId 
}) => {
  const safe = histories;

  const [activeTab, setActiveTab] = useState<
    "cpu" | "memory" | "net" | "disk"
  >("cpu");

  const [timeRange, setTimeRange] = useState<TimeRange>("1m");

  useEffect(() => {
    //llamar a la API para obtener los datos de stats segun el timeRange seleccionado
    ReportService.getStats(appId, timeRange).then((data) => {
      // Aquí deberías actualizar el estado con los nuevos datos obtenidos
      // Por ejemplo, podrías tener un estado específico para los datos de stats:
      // setStatsData(data);
      console.log(data)
    });
  }, [timeRange]);

  const buildMetricSeries = (h: HistItem, tab: string) => {
    if (!h.series) return [];
    
    // Map the generic series array to the specific metric's mock value
    return h.series.map((_, i) => ({
        i, 
        v: getSingleMetricValue(h.series, tab as "cpu" | "memory" | "net" | "disk", i)
    }));
  };

  const seriesByContainer = useMemo(() => {
    const map: Record<
      string,
      { name: string; data: { i: number; v: number }[] }
    > = {};

    safe.forEach((h) => {
      map[h.container_id] = {
        name: h.container_name,
        data: buildMetricSeries(h, activeTab) ?? [],
      };
    });

    return map;
  }, [safe, activeTab]);

  /**
   * Refactored KPI Series calculation (Fix 2).
   * Calculates the AVERAGE of the derived historical values for all containers
   * for each metric (CPU, Memory, Net, Disk).
   */
  const kpiData = useMemo(() => {
    const maxLen = Math.max(...safe.map(h => h.series?.length ?? 0), 0);

    const buildAggregatedSeries = (tab: "cpu" | "memory" | "net" | "disk") => {
      if (maxLen === 0) return [];
      
      return Array.from({ length: maxLen }).map((_, i) => {
        // Sum the mocked metric value for all containers at index i
        const totalValue = safe.reduce((sum, h) => {
          return sum + getSingleMetricValue(h.series, tab, i);
        }, 0);
        
        // Calculate the average across all containers at index i
        const avgValue = safe.length > 0 ? totalValue / safe.length : 0;
        
        return { i, v: avgValue };
      });
    };

    return {
      cpu: buildAggregatedSeries("cpu"),
      memory: buildAggregatedSeries("memory"),
      net: buildAggregatedSeries("net"),
      disk: buildAggregatedSeries("disk")
    };
  }, [safe]);


  /**
   * Helper to calculate the average of a specific latest stat across all containers.
   * This is correct for the KPI card's main number value.
   */
  const avg = (key: keyof ContainerStatsDto) =>
    safe.length
      ? safe.reduce((acc, h) => acc + Number(h.latest[key] ?? 0), 0) /
        safe.length
      : 0;

  /* ----------------------------- RENDER ----------------------------- */

  return (
    <div className="min-h-screen bg-[#1e1f29] text-white p-6 md:p-10 flex flex-col gap-8 font-['Inter']">
      
      
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Estadisticas</h1>
        <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
      </div>

      {/* KPI CARDS */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* KPI Left Column */}
        <div className="w-full xl:w-1/3">
          <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-2 gap-6 h-full">
            <KPICard
              title="CPU USAGE (AVG)"
              value={`${fmt(avg("cpu_percentage"), 1)}%`}
              sub="Average utilization across all containers"
              color={COLORS.cpu}
              data={kpiData.cpu}
            />
            <KPICard
              title="MEMORY USAGE (AVG)"
              value={`${fmt(avg("memory_percentage"), 1)}%`}
              sub="Average of memory limits utilized"
              color={COLORS.mem}
              data={kpiData.memory}
            />
            <KPICard
              title="NETWORK I/O (KB/s)"
              value={`${fmt(avg("net_upload") / 1024, 1)} / ${fmt(avg("net_download") / 1024, 1)}`}
              sub="↑ Avg Upload / ↓ Avg Download"
              color={COLORS.net}
              data={kpiData.net}
            />
            <KPICard
              title="DISK I/O (KB/s)"
              value={`${fmt((avg("block_read") + avg("block_write")) / 1024, 1)}`}
              sub="Avg Read + Write Block I/O"
              color={COLORS.disk}
              data={kpiData.disk}
            />
          </div>
        </div>

        {/* Alert Dashboard Right Column */}
        <div className="w-full xl:w-2/3">
          <div className="text-lg font-semibold text-gray-300 bg-primary h-full min-h-[400px] rounded-lg p-4">
            Alert dashboard
          </div>
        </div>
      </div>
      {/* Main Dashboard */}
      <MainDashboard
        seriesByContainer={seriesByContainer}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default StatsDashboard;