export interface ContainerStatsDto {
    block_read: number;
      block_write: number;
      cpu_percentage: number;
      container: string;
      container_id: string;
      memory_percentage: number;
      memory_used: number;
      memory_limit: number;
      container_name: string;
      net_upload: number;
      net_download: number;
      timestamp?: string;
}