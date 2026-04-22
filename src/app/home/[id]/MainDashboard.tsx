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
import { COLORS, fmt, getTabColor } from "./statsUtils";

interface MainChartProps {
  seriesByContainer: Record<
    string,
    { name: string; data: { i: number; v: number }[] }
  >;
  metricLabel: string;
  color: string;
}

/**
 * Main Chart Component
 * Displays aggregated metrics over time for all containers
 */
const MainChart: FC<MainChartProps> = ({
  seriesByContainer,
  metricLabel,
  color,
}) => {
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
            <CartesianGrid
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="3 3"
            />
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
                if (metricLabel === "CPU" || metricLabel === "MEMORY")
                  return `${fmt(value, 0)}%`;
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
                const unit =
                  metricLabel === "CPU" || metricLabel === "MEMORY" ? "%" : " KB/s";
                const displayValue = fmt(
                  v,
                  metricLabel === "NET" || metricLabel === "DISK" ? 0 : 2
                );
                return [
                  `${displayValue}${unit}`,
                  name === "total" ? "Total Aggregated" : name,
                ];
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
              activeDot={{
                r: 6,
                strokeWidth: 2,
                stroke: color,
                fill: COLORS.surface,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface MetricTabsProps {
  activeTab: "cpu" | "memory" | "net" | "disk";
  onTabChange: (tab: "cpu" | "memory" | "net" | "disk") => void;
}

/**
 * Metric Tabs Component
 * Allows switching between different metric views
 */
const MetricTabs: FC<MetricTabsProps> = ({ activeTab, onTabChange }) => (
  <div className="flex gap-2 mb-4">
    {(["cpu", "memory", "net", "disk"] as const).map((t) => (
      <button
        key={t}
        className={`text-sm px-4 py-2 rounded-xl transition font-medium capitalize shadow-lg ${
          activeTab === t
            ? `bg-[rgba(255,255,255,0.15)] text-white`
            : "bg-[rgba(255,255,255,0.05)] text-gray-400 hover:bg-[rgba(255,255,255,0.1)]"
        }`}
        onClick={() => onTabChange(t)}
      >
        {t}
      </button>
    ))}
  </div>
);

interface MainDashboardProps {
  seriesByContainer: Record<
    string,
    { name: string; data: { i: number; v: number }[] }
  >;
  activeTab: "cpu" | "memory" | "net" | "disk";
  onTabChange: (tab: "cpu" | "memory" | "net" | "disk") => void;
}

/**
 * Main Dashboard Component
 * Combines metric tabs and the main chart display
 */
export const MainDashboard: FC<MainDashboardProps> = ({
  seriesByContainer,
  activeTab,
  onTabChange,
}) => {
  const mainColor = getTabColor(activeTab);

  return (
    <div>
      <MetricTabs activeTab={activeTab} onTabChange={onTabChange} />
      <MainChart
        seriesByContainer={seriesByContainer}
        metricLabel={activeTab.toUpperCase()}
        color={mainColor}
      />
    </div>
  );
};
