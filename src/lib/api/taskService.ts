import apiRequest from './apiClient';
import { TaskDto, TaskCreateDto, TaskGroupCreateDto } from '../dto/TaskDto';

//GET
const getTasks = (id: string) => 
  apiRequest<TaskDto[]>(`/tasks/${id}`);

//POST
const createTask = (data: TaskCreateDto) => 
  apiRequest<TaskDto>('/tasks', 'POST', data);

const assignTaskToGroup = (data: TaskGroupCreateDto) =>
  apiRequest<TaskDto>(`/tasks/${data.task_id}/assign_group/${data.group_id}`, 'POST', data);

//DELETE
const deleteTask = (id: string) => 
  apiRequest<TaskDto>(`/tasks/${id}`, 'DELETE');

const removeTaskFromGroup = (data: TaskGroupCreateDto) =>
  apiRequest<TaskDto>(`/tasks/${data.group_id}/remove/${data.task_id}`, 'DELETE');

export const TaskService = {
  getTasks,
  createTask,
  deleteTask,
  assignTaskToGroup,
  removeTaskFromGroup
}