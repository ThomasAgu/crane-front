export interface TaskDto {
  id: number;
  name: string;
  description: string;
}

export interface TaskCreateDto {
  name: string;
  description: string;
}

export interface TaskGroupCreateDto {
  task_id: number;
  group_id: number;
  deliver_date: string;
  publish_date: string;
}