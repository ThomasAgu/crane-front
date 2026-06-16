import apiRequest from './apiClient';
import { TaskDto, TaskCreateDto, TaskGroupCreateDto } from '../dto/TaskDto';

//GET
const getTasks = () =>
  apiRequest<TaskDto[]>('/tasks');

//POST
const createTask = (data: TaskCreateDto) =>
  apiRequest<TaskDto>('/tasks', 'POST', data);

const assignTaskToGroup = (data: TaskGroupCreateDto) =>
  apiRequest<TaskDto>(`/tasks/assign`, 'POST', data);

const removeTaskFromGroup = (id: number) => 
  apiRequest<TaskDto>(`/tasks/remove/${id}`, 'POST');

//DELETE
const deleteTask = (id: string) => 
  apiRequest<TaskDto>(`/tasks/${id}`, 'DELETE');

export const TaskService = {
  getTasks,
  createTask,
  deleteTask,
  assignTaskToGroup,
  removeTaskFromGroup
}