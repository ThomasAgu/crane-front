import React, { FC, useEffect, useMemo, useState } from "react";
import { ReportService } from "@/src/lib/api/reportService";
import { AppService } from "@/src/lib/api/appService";
import { StatsReportDto, ContainerDataPointDto } from "@/src/lib/dto/StatsReportDto";
import { KPICard } from "./KPICard";
import { MetricsDashboard } from "./OverlappedMetricsDashboard";
import { RealtimeDashboard } from "./RealtimeDashboard";
import { AlertDashboard } from "./AlertDashboard";
import { COLORS, fmt } from "./statsUtils";
import { ContainerStatsDto } from "@/src/lib/dto/ContainerStats";
import { TimeRange } from "@/src/lib/types/TimeRange";
import TimeRangeSelector from "./TimeRangeSelector";

export const StatsPanel: FC<{ appId: string }> = ({ appId }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("1h");
  const [statsData, setStatsData] = useState<StatsReportDto | null>(null);
  const [realtimeData, setRealtimeData] = useState<ContainerStatsDto[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<"cpu" | "memory" | "net" | "disk">("cpu");

  // Fetch stats data from API
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        if (timeRange === "0") {
          const data = await AppService.getStats(appId);
          setRealtimeData(Array.isArray(data) ? data : [data]);
        } else {
          // Historical data
          const data = await ReportService.getStats(appId, timeRange);
          setStatsData(data as StatsReportDto);
          console.log("Fetched stats data:", data);
          const statsReportData = data as StatsReportDto;
          if (!selectedService && statsReportData?.data_points && statsReportData.data_points.length > 0) {
            const firstServiceName = statsReportData.data_points[0].container_name;
            setSelectedService(firstServiceName);
          }
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Set up auto-refresh for real-time data (every 5 seconds)
    let intervalId: NodeJS.Timeout | undefined;
    if (timeRange === "0") {
      intervalId = setInterval(fetchStats, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [appId, timeRange]);

  // Get unique services from data points
  const uniqueServices = useMemo(() => {
    if (timeRange === "0" && realtimeData) {
      return realtimeData.map((container) => ({
        name: container.container_name,
        id: container.container_id,
      }));
    }
    
    if (!statsData?.data_points) return [];
    const serviceMap = new Map<string, string>();
    
    statsData.data_points.forEach((point) => {
      serviceMap.set(point.container_name, point.container_id);
    });
    
    return Array.from(serviceMap.entries()).map(([name, id]) => ({
      name,
      id,
    }));
  }, [statsData, realtimeData, timeRange]);

  // Filter data points by selected service
  const selectedServiceData = useMemo(() => {
    if (timeRange === "0") return null; // Real-time doesn't use this
    
    if (!statsData?.data_points || !selectedService) return [];
    return statsData.data_points.filter(
      (point) => point.container_name === selectedService
    );
  }, [statsData, selectedService, timeRange]);

  // Calculate KPI metrics from summary and data points
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

  if (timeRange === "0") {
    return (
      <div className="text-black p-6 flex flex-col gap-4 min-h-screen">
        <div>
          <h1 className="text-2xl font-bold mb-4">Estadísticas</h1>
          <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
        </div>

        <RealtimeDashboard data={realtimeData} loading={loading} />
      </div>
    );
  }

  // Historical mode
    return (
    <div className="text-black ps-6 flex flex-col gap-4 min-h-screen">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Estadísticas</h2>
        <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
      </div>

      {/* Service Selector */}
      {uniqueServices.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="text-2xl font-semibold text-darker">Servicio</label>
          <select
            value={selectedService || ""}
            onChange={(e) => setSelectedService(e.target.value)}
            className="px-4 py-3 text-xl rounded-lg text-darkest border border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:outline-none transition"
          >
            <option value="" className="text-gray-500">
              Seleccionar servicio...
            </option>
            {uniqueServices.map((service) => (
              <option key={service.id} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* KPI CARDS */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* KPI Left Column */}
        <div className="w-full xl:w-1/3">
          <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-2 gap-6 h-full">
            <KPICard
              title="CPU"
              value={`${fmt(kpiMetrics.cpu.avg, 2)}%`}
              stats={{
                min: kpiMetrics.cpu.min,
                max: kpiMetrics.cpu.max,
                avg: kpiMetrics.cpu.avg,
              }}
              color={COLORS.cpu}
              loading={loading}
            />
            <KPICard
              title="Memoria"
              value={`${fmt(kpiMetrics.memory.avg, 2)}%`}
              stats={{
                min: kpiMetrics.memory.min,
                max: kpiMetrics.memory.max,
                avg: kpiMetrics.memory.avg,
              }}
              color={COLORS.mem}
              loading={loading}
            />
            <KPICard
              title="Disco L/E"
              value={`${fmt(kpiMetrics.diskIO.readTotal, 1)} / ${fmt(
                kpiMetrics.diskIO.writeTotal,
                1
              )} (MB)`}
              color={COLORS.disk}
              loading={loading}
            />
            <KPICard
              title="Red S/B"
              value={`${fmt(kpiMetrics.network.uploadTotal, 1)} / ${fmt(
                kpiMetrics.network.downloadTotal,
                1
              )} (MB)`}
              color={COLORS.net}
              loading={loading}
            />
          </div>
        </div>

        {/* Alert Dashboard Right Column */}
        <div className="w-full xl:w-2/3">
          <AlertDashboard appId={appId} timeRange={timeRange} />
        </div>
      </div>

      {/* Metrics Dashboard */}
      {selectedServiceData && selectedServiceData.length > 0 && (
        <MetricsDashboard 
          timeRange={timeRange as any}
          data={selectedServiceData} 
          selectedMetric={selectedMetric}
          onMetricChange={setSelectedMetric}
          loading={loading}
        />
      )}
    </div>
  );
};

export default StatsPanel;