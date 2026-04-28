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
import { COLORS, fmt, downsample } from "./statsUtils";
import Loader from "@/src/components/ui/Loader";

interface MetricsDashboardProps {
  timeRange: "1m" | "1h" | "1d" | "1w" | "1M";
  data: ContainerDataPointDto[];
  selectedMetric?: "cpu" | "memory" | "net" | "disk";
  onMetricChange?: (metric: "cpu" | "memory" | "net" | "disk") => void;
  loading: boolean;
}

type MetricType = "cpu" | "memory" | "net" | "disk";

interface MetricConfig {
  label: string;
  unit: string;
  color: string;
  yAxisFormatter: (value: number) => string;
  tooltipFormatter: (value: number) => string;
}

const METRIC_CONFIG: Record<MetricType, MetricConfig> = {
  cpu: {
    label: "CPU",
    unit: "%",
    color: COLORS.cpu,
    yAxisFormatter: (value: number) => `${fmt(value, 0)}%`,
    tooltipFormatter: (value: number) => `${fmt(value, 1)}%`,
  },
  memory: {
    label: "Memoria",
    unit: "%",
    color: COLORS.mem,
    yAxisFormatter: (value: number) => `${fmt(value, 0)}%`,
    tooltipFormatter: (value: number) => `${fmt(value, 1)}%`,
  },
  net: {
    label: "Red",
    unit: "MB",
    color: COLORS.net,
    yAxisFormatter: (value: number) => `${fmt(value / 100, 1)}MB`,
    tooltipFormatter: (value: number) => `${fmt(value / 100, 2)} MB`,
  },
  disk: {
    label: "Disco",
    unit: "MB",
    color: COLORS.disk,
    yAxisFormatter: (value: number) => `${fmt(value / 10, 1)}MB`,
    tooltipFormatter: (value: number) => `${fmt(value / 10, 2)} MB`,
  },
};

/**
 * Single Metric Dashboard Component
 * Displays one metric (CPU, Memory, Network, or Disk) at a time
 */
export const MetricsDashboard: FC<MetricsDashboardProps> = ({
  timeRange,
  data,
  selectedMetric = "cpu",
  onMetricChange,
  loading
}) => {
  const [activeMetric, setActiveMetric] = useState<MetricType>(selectedMetric);

  // Transform data for the chart

  const chartData = useMemo(() => {
    const transformed = data.map((point) => ({
      timestamp: new Date(point.timestamp),
      cpu: point.cpu_percentage,
      memory: point.memory_percentage,
      net: point.net_upload_mb + point.net_download_mb,
      disk: point.block_read_mb + point.block_write_mb,
    }));

    return downsample(transformed, 100);
  }, [data]);

  const handleMetricChange = (metric: MetricType) => {
    setActiveMetric(metric);
    onMetricChange?.(metric);
  };

  const config = METRIC_CONFIG[activeMetric];

  return (
    <div className="w-full space-y-1 mt-6">
      {/* Metric Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["cpu", "memory", "net", "disk"] as MetricType[]).map((metric) => (
          <button
            key={metric}
            onClick={() => handleMetricChange(metric)}
            className="px-4 p-2 rounded-lg font-medium transition border rounded-lg cursor-pointer"
            style={{
              backgroundColor:
                activeMetric === metric
                  ? METRIC_CONFIG[metric].color
                  : "rgba(255,255,255,0.05)",
              color: activeMetric === metric ? "white" : "#9ca3af",
              border:
                activeMetric === metric
                  ? `2px solid`
                  : `2px solid ${METRIC_CONFIG[metric].color}`
            }}
          >
            <span className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ 
                  backgroundColor: 
                  activeMetric === metric 
                    ? "white" 
                    : METRIC_CONFIG[metric].color 
                  }}
              />
              {METRIC_CONFIG[metric].label}
            </span>
          </button>
        ))}
      </div>

      <div className="w-full bg-[rgba(255,255,255,0.02)] rounded-2xl p-6 shadow-xl border border-[rgba(255,255,255,0.05)] relative">\

        {loading && (
          <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center rounded-xl">
            <Loader loading={loading} width={40} height={40} />
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-lg font-semibold" style={{ color: config.color }}>
              {config.label}
            </div>
            <div className="text-sm text-darkest font-medium" style={{ color: config.color }}>
              {config.unit}
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {chartData.length} Mediciones
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData}
              margin={{ top: 10, right: 20, bottom: 40, left: 0 }}
            >
              <CartesianGrid
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="timestamp"
                stroke="rgba(255,255,255,0.05)"
                tick={{ fill: "#9aa0ad", fontSize: 11 }}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickFormatter={(value) => {
                  const d = new Date(value);
                  switch (timeRange) {
                    case "1h":
                      return d.toLocaleTimeString("es-AR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                    case "1d":
                      return d.toLocaleTimeString("es-AR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                    case "1w":
                      return d.toLocaleDateString("es-AR", {
                        weekday: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                    case "1m":
                      return d.toLocaleDateString("es-AR", {
                        day: "2-digit",
                        hour: "2-digit",
                        month: "short",
                      });
                    default:
                      return d.toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "short",
                      });
                  }
                }} 
              />
              <YAxis
                domain={["auto", "auto"]}
                stroke="rgba(255,255,255,0.05)"
                tick={{ fill: "#9aa0ad", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickFormatter={(value) => config.yAxisFormatter(value)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: COLORS.surface,
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 12,
                }}
                formatter={(value: number) => [
                  config.tooltipFormatter(value),
                  config.label,
                ]}
              />

              <Line
                type="monotone"
                dataKey={activeMetric}
                stroke={config.color}
                strokeWidth={2.5}
                dot={false}
                name={config.label}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                  stroke: config.color,
                  fill: COLORS.surface,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-lg space-y-1 ">
          <div>
            <span className="font-semibold text-gray-500">Unidad</span> <span className="font-semibold" style={{ color: config.color }}>
              {config.unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDashboard;
