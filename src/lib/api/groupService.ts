import apiRequest from './apiClient';
import { GroupCreateDto, GroupDto, GroupDtoDetails, UserGroupDto } from '../dto/GroupDto';

//GET
const getGroupsForUser = () => 
  apiRequest<GroupDto[]>('/groups');

const getGroup = (id: string) =>  {
   return apiRequest<GroupDtoDetails>(`/groups/${id}`);
}  

//POST
const createGroup = (data: GroupCreateDto) => 
  apiRequest<GroupDto>('/groups', 'POST', data);

const addUserFromGroup = (data: UserGroupDto) => 
  apiRequest<GroupDto>(`/groups/add_user/`, 'POST', data);

//DELETE
const removeUserFromGroup = (data: UserGroupDto) =>
  apiRequest<GroupDto>(`/groups/remove_user/`, 'POST', data);

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