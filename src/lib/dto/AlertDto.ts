export interface AlertDto {
  id: number;
  app_id: number;
  alert: string;
  for_time: number;
  summary: string;
  expr: string;
  severity: string;
  description: string;
  firing_action: string;
  resolved_action: string;
}