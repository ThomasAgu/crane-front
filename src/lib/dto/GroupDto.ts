import { UserDataDto } from './UserDto';

export interface UserGroupRelation {
  user_id: number;
  group_id: number;
  role_id: number;
  user: UserDataDto;
}

export interface GroupDto {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  tasks: []
  user_groups: UserGroupRelation[]
}

export interface GroupDtoDetails {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_groups: UserGroupRelation[];
  tasks: [];
}

export interface GroupCreateDto {
  name: string;
  description: string;
  member_ids?: number[];
}

export interface UserGroupDto {
  user_id: number;
  group_id: number;
  role_id: number;
}