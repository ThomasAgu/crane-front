import { AlertReportDto } from "./AlertReportDto";
import { ContainerStatsDto } from "./ContainerStats";

export interface CombinedReportDto {
  app_id: number;
  time_range: "1h" | "1d" | "1w" | "1m";
  generated_at: string;
  stats: ContainerStatsDto[];
  alerts: AlertReportDto;
}