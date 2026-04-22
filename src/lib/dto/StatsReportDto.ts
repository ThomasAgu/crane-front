export interface ContainerDataPointDto {
  timestamp: string;              // ISO datetime
  container: string;
  container_id: string;
  container_name: string;

  cpu_percentage: number;

  memory_percentage: number;
  memory_used_mb: number;
  memory_limit_mb: number;

  net_upload_mb: number;
  net_download_mb: number;

  block_read_mb: number;
  block_write_mb: number;
}

export interface ContainerSummaryDto {
  avg_cpu: number;
  max_cpu: number;
  min_cpu: number;

  avg_memory: number;
  max_memory: number;
  min_memory: number;
}

export interface StatsSummaryDto {
  [containerName: string]: ContainerSummaryDto;
}

export interface StatsReportDto {
  app_id: number;
  time_range: "1h" | "1d" | "1w" | "1m";
  generated_at: string; 
  data_points: ContainerDataPointDto[];
  summary: StatsSummaryDto;
}