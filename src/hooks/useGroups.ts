import { useCallback, useMemo, useState } from 'react';
import { GroupService } from '@/lib/api/groupService';
import { TaskService } from '@/lib/api/taskService';
import { UserService } from '@/lib/api/userService';
import type { GroupCreateDto, GroupDto, GroupDtoDetails, UserGroupDto } from '@/lib/dto/GroupDto';
import type { TaskCreateDto, TaskDetailsDto, TaskDto } from '@/lib/dto/TaskDto';
import type { UserDataDto } from '@/lib/dto/UserDto';

export function useGroups() {
  const [groups, setGroups] = useState<GroupDto[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupDtoDetails | null>(null);
  const [allUsers, setAllUsers] = useState<UserDataDto[]>([]);
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const groupMembers = useMemo(
    () => selectedGroup?.user_groups.map((relation) => relation.user) ?? [],
    [selectedGroup],
  );
  const groupTasks: TaskDetailsDto[] = selectedGroup?.tasks ?? [];

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await GroupService.getGroupsForUser();
      setGroups(data);
      return data;
    } catch (requestError) {
      setError('Error al cargar los grupos');
      console.error('Error loading groups:', requestError);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGroup = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await GroupService.getGroup(id);
      setSelectedGroup(data);
      return data;
    } catch (requestError) {
      setSelectedGroup(null);
      setError('Error al cargar el grupo');
      console.error('Error loading group:', requestError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllUsers = useCallback(async () => {
    try {
      const users = await UserService.getAll();
      setAllUsers(users);
      return users;
    } catch (requestError) {
      console.error('Error loading users:', requestError);
      return [];
    }
  }, []);

  const fetchGroupMembers = useCallback(async (groupId: number) => {
    const group = selectedGroup?.id === groupId
      ? selectedGroup
      : await fetchGroup(String(groupId));
    return group?.user_groups.map((relation) => relation.user) ?? [];
  }, [fetchGroup, selectedGroup]);

  const fetchTasks = useCallback(async () => {
    setTasksLoading(true);
    try {
      const data = await TaskService.getTasks();
      setTasks(data);
      return data;
    } catch (requestError) {
      console.error('Error loading tasks:', requestError);
      return [];
    } finally {
      setTasksLoading(false);
    }
  }, []);

  const createGroup = useCallback(async (data: GroupCreateDto) => {
    setError(null);
    try {
      const newGroup = await GroupService.createGroup(data);
      setGroups((currentGroups) => [...currentGroups, newGroup]);
      return newGroup;
    } catch (requestError) {
      setError('Error al crear el grupo');
      console.error('Error creating group:', requestError);
      throw requestError;
    }
  }, []);

  const addUserToGroup = useCallback(async (userId: number, groupId: number) => {
    setError(null);
    try {
      const data: UserGroupDto = { user_id: userId, group_id: groupId, role_id: 1 };
      await GroupService.addUserFromGroup(data);
      await fetchGroup(String(groupId));
    } catch (requestError) {
      setError('Error al agregar usuario al grupo');
      console.error('Error adding user to group:', requestError);
      throw requestError;
    }
  }, [fetchGroup]);

  const removeUserFromGroup = useCallback(async (userId: number, groupId: number) => {
    setError(null);
    try {
      const data: UserGroupDto = { user_id: userId, group_id: groupId, role_id: 0 };
      await GroupService.removeUserFromGroup(data);
      await fetchGroup(String(groupId));
    } catch (requestError) {
      setError('Error al eliminar usuario del grupo');
      console.error('Error removing user from group:', requestError);
      throw requestError;
    }
  }, [fetchGroup]);

  const deleteGroup = useCallback(async (id: string) => {
    setError(null);
    try {
      await GroupService.deleteGroup(id);
      const groupId = Number(id);
      setGroups((currentGroups) => currentGroups.filter((group) => group.id !== groupId));
      setSelectedGroup((currentGroup) => currentGroup?.id === groupId ? null : currentGroup);
    } catch (requestError) {
      setError('Error al eliminar el grupo');
      console.error('Error deleting group:', requestError);
      throw requestError;
    }
  }, []);

  const createTask = useCallback(async (data: TaskCreateDto) => {
    const newTask = await TaskService.createTask(data);
    setTasks((currentTasks) => [...currentTasks, newTask]);
    return newTask;
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await TaskService.deleteTask(id);
    const taskId = Number(id);
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  }, []);

  return {
    allUsers,
    addUserToGroup,
    createGroup,
    createTask,
    deleteGroup,
    deleteTask,
    error,
    fetchAllUsers,
    fetchGroup,
    fetchGroupMembers,
    fetchGroups,
    fetchTasks,
    groupMembers,
    groupTasks,
    groups,
    loading,
    selectedGroup,
    setSelectedGroup,
    tasks,
    tasksLoading,
    removeUserFromGroup,
  };
}