export type AlertStatus = "firing" | "resolved";
export type AlertSeverity = "critical" | "page" | string; 
// string fallback por si aparecen nuevos niveles

export type AlertLabelsDto = Record<string, string | number | null>;

export interface AlertDto {
  id: number;
  alert_name: string | null;
  status: AlertStatus;
  severity: AlertSeverity;
  summary: string | null;
  description: string | null;
  labels: AlertLabelsDto;
  timestamp: string; // ISO datetime
  fingerprint?: string;
}

export interface AlertSummaryDto {
  total: number;
  firing: number;
  resolved: number;
}

export interface AlertReportDto {
  app_id: number;
  time_range: "1h" | "1d" | "1w" | "1m";
  generated_at: string;
  alerts: AlertDto[];
  summary: AlertSummaryDto;
}