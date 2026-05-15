import { ContainerStatsDto } from "@/lib/dto/ContainerStats";

/**
 * Type for historical container data
 */
export type HistItem = {
  container_id: string;
  container_name: string;
  series: number[];
  latest: ContainerStatsDto;
};

/**
 * Color palette for the stats dashboard
 */
export const COLORS = {
  bg: "#1e1f29",
  surface: "#26272f",
  muted: "#9aa0ad",
  cpu: "#ef4444", // Red
  mem: "#3b82f6", // Blue
  net: "#10b981", // Emerald Green
  disk: "#f59e0b", // Amber/Orange
};

/**
 * Format number to fixed decimals
 * @param n - Number to format
 * @param d - Number of decimal places (default: 1)
 * @returns Formatted string
 */
export const fmt = (n: number, d = 1): string =>
  isNaN(n) ? "0" : n.toFixed(d);

/**
 * Derive mock historical values for a single metric based on the generic series array
 * Ensures charts are visually distinct for each tab
 * @param series - Array of historical values
 * @param tab - Metric tab (cpu, memory, net, disk)
 * @param index - Index in the series
 * @returns Normalized metric value
 */
export const getSingleMetricValue = (
  series: number[],
  tab: "cpu" | "memory" | "net" | "disk",
  index: number
): number => {
  const v = series[index] ?? 0;
  if (v === 0) return 0;

  switch (tab) {
    case "cpu":
      return Math.min(100);
    case "memory":
      return Math.min(100);
    case "net":
      return Math.min(100, v * 30 + 100);
    case "disk":
      return Math.min(100, v * 10 + 50);
    default:
      return 0;
  }
};

/**
 * Get the color for a given metric tab
 * @param tab - Metric tab (cpu, memory, net, disk)
 * @returns Color hex string
 */
export const getTabColor = (
  tab: "cpu" | "memory" | "net" | "disk"
): string => {
  switch (tab) {
    case "cpu":
      return COLORS.cpu;
    case "memory":
      return COLORS.mem;
    case "net":
      return COLORS.net;
    case "disk":
      return COLORS.disk;
    default:
      return COLORS.muted;
  }
};

// Downsampling adaptativo basado en el rango real de timestamps
export function downsample(data: any[], maxPoints: number = 300) {
  if (data.length <= maxPoints) return data;

  const factor = Math.floor(data.length / maxPoints);
  return data.filter((_, idx) => idx % factor === 0);
}
