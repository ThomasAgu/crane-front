import apiRequest from './apiClient';
import { GroupCreateDto, GroupDto, UserGroupDto } from '../dto/GroupDto';

//GET
const getGroupsForUser = () => 
  apiRequest<GroupDto[]>('/groups');
  

const getGroup = (id: string) => 
  apiRequest<GroupDto[]>(`/groups/${id}`);

//POST
const createGroup = (data: GroupCreateDto) =>
  apiRequest<GroupDto>('/groups', 'POST', data);

const addUserFromGroup = (data: UserGroupDto) =>
  apiRequest<GroupDto>(`/groups/${data.group_id}/add_user/${data.user_id}`, 'POST', data);

//DELETE
const removeUserFromGroup = (data: UserGroupDto) =>
  apiRequest<GroupDto>(`/groups/${data.group_id}/remove_user/${data.user_id}`, 'DELETE');

const deleteGroup = (id: string) => 
  apiRequest<GroupDto>(`/groups/${id}`, 'DELETE');


export const GroupService = {
  getGroupsForUser,
  getGroup,
  createGroup,
  addUserFromGroup,
  removeUserFromGroup,
  deleteGroup
}