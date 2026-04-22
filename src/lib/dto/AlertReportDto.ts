export type AlertStatus = "firing" | "resolved";
export type AlertSeverity = "critical" | "page" | string; 
// string fallback por si aparecen nuevos niveles

export interface AlertLabelsDto {
  alertname: string;
  code: string | null;
  entrypoint: string | null;
  instance: string;
  job: string;
  method: string | null;
  monitor: string;
  protocol: string | null;
  severity: string;
}

export interface AlertDto {
  id: number;
  alert_name: string;
  status: AlertStatus;
  severity: AlertSeverity;
  summary: string;
  description: string;
  labels: AlertLabelsDto;
  timestamp: string; // ISO datetime
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