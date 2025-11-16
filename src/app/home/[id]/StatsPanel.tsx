import React, { FC, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  Area,
  YAxis,
} from "recharts";
import { MiniChart } from "@/src/components/ui/MiniChart";
/* ----------------------------- MOCK DTO & DATA ----------------------------- */

/**
 * Mock definition for the container stats DTO based on user input.
 * In a real application, this would be imported.
 */
interface ContainerStatsDto {
  block_read: number;
  block_write: number;
  cpu_percentage: number;
  container: string;
  container_id: string;
  memory_percentage: number;
  memory_used: number;
  memory_limit: number;
  container_name: string;
  net_upload: number;
  net_download: number;
  timestamp?: string;
}

type HistItem = {
  container_id: string;
  container_name: string;
  series: number[]; 
  latest: ContainerStatsDto;
};

// Helper function to generate mock historical data for demonstration
const generateMockSeries = (length: number, base: number) =>
  Array.from({ length }).map((_, i) =>
    Math.max(
      1,
      base +
        (Math.sin(i * 0.5) * 10 + Math.cos(i * 0.3) * 5 + Math.random() * 5)
    )
  );

// Mock Data for the Dashboard to be runnable
const mockHistories: HistItem[] = [
  {
    container_id: "a1b2c3d4",
    container_name: "mysql-master",
    series: generateMockSeries(30, 25), // CPU-like base series
    latest: {
      block_read: 15000,
      block_write: 30000,
      cpu_percentage: 28.5,
      container: "mysql",
      container_id: "a1b2c3d4",
      memory_percentage: 45.2,
      memory_used: 1200000000,
      memory_limit: 2684354560,
      container_name: "mysql-master",
      net_upload: 45000,
      net_download: 82000,
    },
  },
  {
    container_id: "e5f6g7h8",
    container_name: "mysql-replica",
    series: generateMockSeries(30, 18), // CPU-like base series
    latest: {
      block_read: 8000,
      block_write: 15000,
      cpu_percentage: 19.1,
      container: "mysql",
      container_id: "e5f6g7h8",
      memory_percentage: 38.0,
      memory_used: 950000000,
      memory_limit: 2684354560,
      container_name: "mysql-replica",
      net_upload: 22000,
      net_download: 35000,
    },
  },
];

/* ----------------------------- COLORS & UTILS ----------------------------- */

const COLORS = {
  bg: "#1e1f29",
  surface: "#26272f",
  muted: "#9aa0ad",
  cpu: "#ef4444", // Red
  mem: "#3b82f6", // Blue
  net: "#10b981", // Emerald Green
  disk: "#f59e0b", // Amber/Orange
};

const fmt = (n: number, d = 1) => (isNaN(n) ? "0" : n.toFixed(d));

/* ----------------------------- MOCK MINI CHART COMPONENT ----------------------------- */


/* ----------------------------- KPI CARD ----------------------------- */

const KPI: FC<{
  title: string;
  value: string;
  sub?: string;
  color: string;
  data: { i: number; v: number }[];
}> = ({ title, value, sub, color, data }) => (
  <div className="flex flex-col bg-[rgba(255,255,255,0.02)] rounded-2xl p-4 shadow-xl border border-[rgba(255,255,255,0.05)] transition-all duration-300 hover:bg-[rgba(255,255,255,0.05)]">
    <div className="flex items-start justify-between">
      <div className="text-xs text-gray-300 font-medium tracking-wider">
        {title}
      </div>
      <div className="text-2xl font-bold text-white ml-4">{value}</div>
    </div>
    {sub && <div className="text-[11px] text-gray-400 mt-0.5">{sub}</div>}
    <div className="mt-4 -mb-2">
      <MiniChart data={data} color={color} />
    </div>
  </div>
);

/* ----------------------------- MAIN CHART ----------------------------- */

const MainChart: FC<{
  seriesByContainer: Record<
    string,
    { name: string; data: { i: number; v: number }[] }
  >;
  metricLabel: string;
  color: string;
}> = ({ seriesByContainer, metricLabel, color }) => {
  const keys = Object.keys(seriesByContainer);
  const length = Math.max(
    ...keys.map((k) => seriesByContainer[k].data.length),
    0
  );

  // Aggregating data across all containers for the "Total" line
  const aggregated = Array.from({ length }).map((_, i) => {
    const item: any = { i };

    item.total = keys.reduce(
      (s, k) => s + (seriesByContainer[k].data[i]?.v ?? 0),
      0
    );

    // Also include individual container data for multi-line chart (optional but useful)
    keys.forEach((k) => {
      item[seriesByContainer[k].name] = seriesByContainer[k].data[i]?.v ?? 0;
    });

    return item;
  });

  return (
    <div className="w-full bg-[rgba(255,255,255,0.02)] rounded-2xl p-6 shadow-xl border border-[rgba(255,255,255,0.05)]">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold text-gray-100">
          {metricLabel} Usage Over Time
        </div>
        <div className="text-xs text-gray-400">
          Last {length} measurements (Total Aggregation)
        </div>
      </div>

      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={aggregated}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
            <XAxis
              dataKey="i"
              stroke="rgba(255,255,255,0.05)"
              tick={{ fill: "#9aa0ad", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <YAxis
              domain={["auto", "auto"]}
              stroke="rgba(255,255,255,0.05)"
              tick={{ fill: "#9aa0ad", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              // Custom formatter to add units (e.g., %)
              tickFormatter={(value) => {
                if (metricLabel === "CPU" || metricLabel === "MEMORY") return `${fmt(value, 0)}%`;
                return `${fmt(value, 0)}`; // Assuming KB/s for net/disk
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: COLORS.surface,
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: "#fff",
                fontSize: 12,
              }}
              labelFormatter={(i: number) => `Time Point ${i}`}
              formatter={(v: number, name: string) => {
                const unit = metricLabel === "CPU" || metricLabel === "MEMORY" ? "%" : " KB/s";
                const displayValue = fmt(v, metricLabel === "NET" || metricLabel === "DISK" ? 0 : 2);
                return [`${displayValue}${unit}`, name === 'total' ? 'Total Aggregated' : name];
              }}
            />
            {/* The main aggregated total line */}
            <Line
              type="monotone"
              dataKey="total"
              name="Total"
              stroke={color}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2, stroke: color, fill: COLORS.surface }}
            />
            {/* Optional: Add lines for individual containers */}
            {/* {keys.map((k, index) => (
              <Line
                key={k}
                type="monotone"
                dataKey={seriesByContainer[k].name}
                name={seriesByContainer[k].name}
                stroke={index % 2 === 0 ? '#4f46e5' : '#14b8a6'} // Example secondary colors
                strokeWidth={1}
                dot={false}
                opacity={0.6}
              />
            ))} */}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ----------------------------- DASHBOARD ----------------------------- */

/**
 * Shared logic to derive mock historical values for a single metric
 * based on the generic 'h.series' array.
 * This ensures the charts are visually distinct for each tab (Fix 1).
 */
const getSingleMetricValue = (
  series: number[],
  tab: "cpu" | "memory" | "net" | "disk",
  index: number
): number => {
  const v = series[index] ?? 0;
  if (v === 0) return 0;

  // Function to add small, deterministic noise for visual differentiation
  const applyNoise = (val: number, factor: number) => {
    // Noise based on the index to create a unique pattern
    const noise = (Math.sin(index * 0.5) * Math.cos(index * 0.3) * 0.1 * factor);
    return Math.max(0, val + noise);
  };

  switch (tab) {
    case "cpu":
      return Math.min(100, applyNoise(v, 1.2));
    case "memory":
      return Math.min(100, applyNoise(v * 0.7 + 25, 0.8));
    case "net":
      return applyNoise(v * 30 + 100, 2);
    case "disk":
      return applyNoise(v * 10 + 50, 1.5);
    default:
      return 0;
  }
};


export const StatsDashboard: FC<{ histories: HistItem[] }> = ({ histories }) => {
  const safe = histories ?? mockHistories;

  const [activeTab, setActiveTab] = useState<
    "cpu" | "memory" | "net" | "disk"
  >("cpu");

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

  const mainColor =
    activeTab === "cpu"
      ? COLORS.cpu
      : activeTab === "memory"
      ? COLORS.mem
      : activeTab === "net"
      ? COLORS.net
      : COLORS.disk;

  /* ----------------------------- RENDER ----------------------------- */

  return (
    <div className="min-h-screen bg-[#1e1f29] text-white p-6 md:p-10 flex flex-col gap-8 font-['Inter']">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.1)] pb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.08)] flex items-center justify-center text-2xl font-bold border border-gray-700 shadow-md text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-database-zap"><path d="M12 21v-8"/><path d="M21 17c0 2.21-3.13 4-7 4s-7-1.79-7-4 3.13-4 7-4 7 1.79 7 4Z"/><path d="M7 13c0 2.21 3.13 4 7 4s7-1.79 7-4"/><path d="M7 9c0 2.21 3.13 4 7 4s7-1.79 7-4"/><path d="M14 5c0 2.21-3.13 4-7 4S0 7.21 0 5s3.13-4 7-4 7 1.79 7 4Z"/><path d="M13 2L16 6H13z"/></svg>
          </div>
          <div>
            <div className="text-xl font-extrabold text-gray-50">MySQL Cluster</div>
            <div className="text-sm text-gray-400 mt-0.5">
              my-swarm / containers: {safe.length} — status:{" "}
              <span className="text-green-400 font-semibold">Healthy</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm text-gray-300 bg-[rgba(255,255,255,0.08)] px-4 py-2 rounded-lg hover:bg-[rgba(255,255,255,0.12)] transition shadow-lg">
            Refresh
          </button>
          <button className="text-sm text-gray-300 bg-[rgba(255,255,255,0.08)] px-4 py-2 rounded-lg hover:bg-[rgba(255,255,255,0.12)] transition shadow-lg">
            Settings
          </button>
        </div>
      </header>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPI
          title="CPU USAGE (AVG)"
          value={`${fmt(avg("cpu_percentage"), 1)}%`}
          sub="Average utilization across all containers"
          color={COLORS.cpu}
          data={kpiData.cpu}
        />

        <KPI
          title="MEMORY USAGE (AVG)"
          value={`${fmt(avg("memory_percentage"), 1)}%`}
          sub="Average of memory limits utilized"
          color={COLORS.mem}
          data={kpiData.memory}
        />

        <KPI
          title="NETWORK I/O (KB/s)"
          // The KPI value correctly calculates the average latest upload/download
          value={`${fmt(avg("net_upload") / 1024, 1)} / ${fmt(
            avg("net_download") / 1024,
            1
          )}`}
          sub="↑ Avg Upload / ↓ Avg Download"
          color={COLORS.net}
          data={kpiData.net}
        />

        <KPI
          title="DISK I/O (KB/s)"
          // The KPI value correctly calculates the average total I/O (read + write)
          value={`${fmt(
            (avg("block_read") + avg("block_write")) / 1024,
            1
          )}`}
          sub="Avg Read + Write Block I/O"
          color={COLORS.disk}
          data={kpiData.disk}
        />
      </div>

      {/* Main Chart */}
      <div>
        <div className="flex gap-2 mb-4">
          {(["cpu", "memory", "net", "disk"] as const).map((t) => (
            <button
              key={t}
              className={`text-sm px-4 py-2 rounded-xl transition font-medium capitalize shadow-lg ${
                activeTab === t
                  ? `bg-[rgba(255,255,255,0.15)] text-white`
                  : "bg-[rgba(255,255,255,0.05)] text-gray-400 hover:bg-[rgba(255,255,255,0.1)]"
              }`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <MainChart
          seriesByContainer={seriesByContainer}
          metricLabel={activeTab.toUpperCase()}
          color={mainColor}
        />
      </div>
    </div>
  );
};

export default StatsDashboard;