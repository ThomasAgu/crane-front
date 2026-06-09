export interface GroupDto {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface GroupCreateDto {
  name: string;
  description: string;
}

export interface UserGroupDto {
  user_id: number;
  group_id: number;
  role_id: number;
}