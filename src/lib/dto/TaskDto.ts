export interface TaskDto {
  id: number;
  name: string;
  description: string;
}

export interface TaskDetailsDto {
  id: number;
  created_at: Date;
  group_id: number;
  creator_id: number;
  deliver_date: Date;
  publish_date: Date;
  task: TaskDto;
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