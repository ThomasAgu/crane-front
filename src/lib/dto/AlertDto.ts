export interface AlertDto {
  id: number;
  app_id: number;
  alert: string;
  for_time: string | number;
  summary: string;
  expr: string;
  severity: string;
  description: string;
  firing_action: string;
  resolved_action: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface AlertCreateDto {
  alert: string;
  expr: string;
  for_time: string;
  severity: string;
  summary: string;
  description: string;
  firing_action: string;
  resolved_action: string;
}
