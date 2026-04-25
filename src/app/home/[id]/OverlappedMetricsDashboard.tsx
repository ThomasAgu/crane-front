import React, { FC, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ContainerDataPointDto } from "@/src/lib/dto/StatsReportDto";
import { COLORS, fmt } from "./statsUtils";

interface OverlappedMetricsDashboardProps {
  data: ContainerDataPointDto[];
}

interface MetricToggle {
  cpu: boolean;
  memory: boolean;
  net: boolean;
  disk: boolean;
}

/**
 * Overlapped Metrics Dashboard Component
 * Displays all metrics (CPU, Memory, Network, Disk) in a single chart with toggles
 */
export const OverlappedMetricsDashboard: FC<OverlappedMetricsDashboardProps> = ({
  data,
}) => {
  const [visibleMetrics, setVisibleMetrics] = useState<MetricToggle>({
    cpu: true,
    memory: true,
    net: false,
    disk: false,
  });

  // Transform data for the chart
  const chartData = useMemo(() => {
    return data.map((point, index) => ({
      index,
      timestamp: new Date(point.timestamp).toLocaleTimeString(),
      cpu: point.cpu_percentage,
      memory: point.memory_percentage,
      net: (point.net_upload_mb + point.net_download_mb) * 100, // Scale for visibility
      disk: (point.block_read_mb + point.block_write_mb) * 10, // Scale for visibility
    }));
  }, [data]);

  const toggleMetric = (metric: keyof MetricToggle) => {
    setVisibleMetrics((prev) => ({
      ...prev,
      [metric]: !prev[metric],
    }));
  };

  return (
    <div className="w-full space-y-6">
      {/* Metric Toggles */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => toggleMetric("cpu")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            visibleMetrics.cpu
              ? `bg-[${COLORS.cpu}] text-white`
              : "bg-[rgba(255,255,255,0.05)] text-gray-400 hover:bg-[rgba(255,255,255,0.1)]"
          }`}
          style={{
            backgroundColor: visibleMetrics.cpu ? COLORS.cpu : "rgba(255,255,255,0.05)",
            color: visibleMetrics.cpu ? "white" : "#9ca3af",
          }}
        >
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS.cpu }}
            />
            CPU
          </span>
        </button>

        <button
          onClick={() => toggleMetric("memory")}
          className={`px-4 py-2 rounded-lg font-medium transition`}
          style={{
            backgroundColor: visibleMetrics.memory ? COLORS.mem : "rgba(255,255,255,0.05)",
            color: visibleMetrics.memory ? "white" : "#9ca3af",
          }}
        >
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS.mem }}
            />
            Memory
          </span>
        </button>

        <button
          onClick={() => toggleMetric("net")}
          className={`px-4 py-2 rounded-lg font-medium transition`}
          style={{
            backgroundColor: visibleMetrics.net ? COLORS.net : "rgba(255,255,255,0.05)",
            color: visibleMetrics.net ? "white" : "#9ca3af",
          }}
        >
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS.net }}
            />
            Network
          </span>
        </button>

        <button
          onClick={() => toggleMetric("disk")}
          className={`px-4 py-2 rounded-lg font-medium transition`}
          style={{
            backgroundColor: visibleMetrics.disk ? COLORS.disk : "rgba(255,255,255,0.05)",
            color: visibleMetrics.disk ? "white" : "#9ca3af",
          }}
        >
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS.disk }}
            />
            Disk
          </span>
        </button>
      </div>

      {/* Chart */}
      <div className="w-full bg-[rgba(255,255,255,0.02)] rounded-2xl p-6 shadow-xl border border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold text-gray-100">
            Resources Overview
          </div>
          <div className="text-xs text-gray-400">
            {chartData.length} data points
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="index"
                stroke="rgba(255,255,255,0.05)"
                tick={{ fill: "#9aa0ad", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickFormatter={(value) => `${value}`}
              />
              <YAxis
                domain={["auto", "auto"]}
                stroke="rgba(255,255,255,0.05)"
                tick={{ fill: "#9aa0ad", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickFormatter={(value) => fmt(value, 0)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: COLORS.surface,
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 12,
                }}
                formatter={(value: number, name: string) => {
                  switch (name) {
                    case "cpu":
                    case "memory":
                      return [`${fmt(value, 1)}%`, name.toUpperCase()];
                    case "net":
                      return [`${fmt(value / 100, 2)} MB/s`, "Network"];
                    case "disk":
                      return [`${fmt(value / 10, 2)} MB/s`, "Disk"];
                    default:
                      return [fmt(value, 2), name];
                  }
                }}
              />

              {visibleMetrics.cpu && (
                <Line
                  type="monotone"
                  dataKey="cpu"
                  stroke={COLORS.cpu}
                  strokeWidth={2.5}
                  dot={false}
                  name="CPU"
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    stroke: COLORS.cpu,
                    fill: COLORS.surface,
                  }}
                />
              )}

              {visibleMetrics.memory && (
                <Line
                  type="monotone"
                  dataKey="memory"
                  stroke={COLORS.mem}
                  strokeWidth={2.5}
                  dot={false}
                  name="Memory"
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    stroke: COLORS.mem,
                    fill: COLORS.surface,
                  }}
                />
              )}

              {visibleMetrics.net && (
                <Line
                  type="monotone"
                  dataKey="net"
                  stroke={COLORS.net}
                  strokeWidth={2.5}
                  dot={false}
                  name="Net"
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    stroke: COLORS.net,
                    fill: COLORS.surface,
                  }}
                />
              )}

              {visibleMetrics.disk && (
                <Line
                  type="monotone"
                  dataKey="disk"
                  stroke={COLORS.disk}
                  strokeWidth={2.5}
                  dot={false}
                  name="Disk"
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    stroke: COLORS.disk,
                    fill: COLORS.surface,
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 text-xs text-gray-400 space-y-1">
          <div>
            <span className="font-semibold">Note:</span> Network and Disk values are
            scaled for chart visibility
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverlappedMetricsDashboard;
