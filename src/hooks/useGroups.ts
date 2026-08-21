import { useState, useEffect } from 'react';
import { GroupDto, GroupCreateDto, UserGroupDto } from '@/lib/dto/GroupDto';
import { GroupService } from '@/lib/api/groupService';
import { UserDataDto } from '@/lib/dto/UserDto';
import { UserService } from '@/lib/api/userService';

export function useGroups() {
  const [groups, setGroups] = useState<GroupDto[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupDto | null>(null);
  const [groupMembers, setGroupMembers] = useState<UserDataDto[]>([]);
  const [allUsers, setAllUsers] = useState<UserDataDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all groups
  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await GroupService.getGroupsForUser();
      setGroups(data);
    } catch (err) {
      setError('Error al cargar los grupos');
      console.error('Error loading groups:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific group
  const fetchGroup = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await GroupService.getGroup(id);
      if (Array.isArray(data) && data.length > 0) {
        setSelectedGroup(data[0]);
        return data[0];
      }
    } catch (err) {
      setError('Error al cargar el grupo');
      console.error('Error loading group:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      const users = await UserService.getAll();
      setAllUsers(users);
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  // Fetch group members
  const fetchGroupMembers = async (groupId: number) => {
    try {
      // This would need to be implemented in the backend
      // For now, we'll use allUsers and filter based on group
      setGroupMembers([]);
    } catch (err) {
      console.error('Error loading group members:', err);
    }
  };

  // Create a new group
  const createGroup = async (data: GroupCreateDto) => {
    setError(null);
    try {
      const newGroup = await GroupService.createGroup(data);
      setGroups([...groups, newGroup]);
      return newGroup;
    } catch (err) {
      setError('Error al crear el grupo');
      console.error('Error creating group:', err);
      throw err;
    }
  };

  // Add user to group
  const addUserToGroup = async (userId: number, groupId: number) => {
    setError(null);
    try {
      const data: UserGroupDto = { user_id: userId, group_id: groupId, role_id: 1 };
      await GroupService.addUserFromGroup(data);
      if (selectedGroup) {
        await fetchGroup(String(selectedGroup.id));
      }
    } catch (err) {
      setError('Error al agregar usuario al grupo');
      console.error('Error adding user to group:', err);
      throw err;
    }
  };

  // Remove user from group
  const removeUserFromGroup = async (userId: number, groupId: number) => {
    setError(null);
    try {
      const data: UserGroupDto = { user_id: userId, group_id: groupId, role_id: 1 };
      await GroupService.removeUserFromGroup(data);
      if (selectedGroup) {
        await fetchGroup(String(selectedGroup.id));
      }
    } catch (err) {
      setError('Error al eliminar usuario del grupo');
      console.error('Error removing user from group:', err);
      throw err;
    }
  };

  // Delete group
  const deleteGroup = async (id: string) => {
    setError(null);
    try {
      await GroupService.deleteGroup(id);
      setGroups(groups.filter(g => g.id !== parseInt(id)));
      if (selectedGroup && selectedGroup.id === parseInt(id)) {
        setSelectedGroup(null);
      }
    } catch (err) {
      setError('Error al eliminar el grupo');
      console.error('Error deleting group:', err);
      throw err;
    }
  };

  return {
    groups,
    selectedGroup,
    groupMembers,
    allUsers,
    loading,
    error,
    fetchGroups,
    fetchGroup,
    fetchAllUsers,
    fetchGroupMembers,
    createGroup,
    addUserToGroup,
    removeUserFromGroup,
    deleteGroup,
    setSelectedGroup,
  };
}
