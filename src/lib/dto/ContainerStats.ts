export interface ContainerStatsDto {
  timestamp?: string;
  container: string;
  container_id: string;
  container_name: string;
  
  cpu_percentage: number;
  
  memory_percentage: number;
  memory_used: number;
  memory_limit: number;
      
  net_upload: number;
  net_download: number;
  
  block_read: number;
  block_write: number;
}