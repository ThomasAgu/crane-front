import apiRequest from "./apiClient";
import { AppDto, CreateAppDto } from "../dto/AppDto";
import { ContainerStatsDto } from "../dto/ContainerStats";
//GET
const getApps = () => apiRequest<AppDto[]>("/apps");

const getApp = (id: string) => apiRequest<AppDto>(`/apps/${id}`);

//POST
const createApp = (data: CreateAppDto) => {
  apiRequest<AppDto>("/apps", "POST", data);
}

const restartApp = (id: string) =>
  apiRequest<string>(`/apps/${id}/restart`, "POST");

const startApp = (id: string) =>
  apiRequest<string>(`/apps/${id}/start`, "POST");

const stopApp = (id: string) =>
  apiRequest<string>(`/apps/${id}/stop`, "POST");

const scaleApp = (id: string) =>
  apiRequest<string>(`/apps/${id}/scale`, "POST");

const getLogs = (id: string) =>
  apiRequest<string>(`/apps/${id}/logs`, "POST");

const getStats = (id: string) =>
  apiRequest<ContainerStatsDto>(`/apps/${id}/stats`, "POST");

const refreshApps = () =>
  apiRequest<string>(`/apps/refresh`, "POST");

//DELETE
const deleteApp = (id: string) =>
  apiRequest<string>(`/apps/${id}`, "DELETE");

//PATCH
const updateApp = (data: AppDto) =>
  apiRequest<AppDto>(`/apps/${data.id}`, "PATCH", data);

export const AppService = {
  getAll: getApps,
  get: getApp,
  create: createApp,
  restart: restartApp,
  start: startApp,
  stop: stopApp,
  scale: scaleApp,
  getLogs: getLogs,
  getStats: getStats,
  refresh: refreshApps,
  delete: deleteApp,
  update: updateApp
};