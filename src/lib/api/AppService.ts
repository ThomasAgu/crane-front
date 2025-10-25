import apiRequest from "./baseService";
import { AppDto, CreateAppDto } from "../dto/AppDto";

//GET
export const getApps = () => apiRequest<AppDto[]>("/apps");

export const getApp = (id: string) => apiRequest<AppDto>(`/apps/${id}`);

//POST
export const createApp = (data: CreateAppDto) =>
  apiRequest<AppDto>("/apps", "POST", data);

export const restartApp = (id: string) =>
  apiRequest<string>(`/apps/${id}/restart`, "POST");

export const startApp = (id: string) =>
  apiRequest<string>(`/apps/${id}/start`, "POST");

export const stopApp = (id: string) =>
  apiRequest<string>(`/apps/${id}/stop`, "POST");

export const scaleApp = (id: string) =>
  apiRequest<string>(`/apps/${id}/scale`, "POST");

export const getLogs = (id: string) =>
  apiRequest<string>(`/apps/${id}/logs`, "POST");

export const getStats = (id: string) =>
  apiRequest<string>(`/apps/${id}/stats`, "POST");

export const refreshApps = () =>
  apiRequest<string>(`/apps/refresh`, "POST");

//DELETE
export const deleteApp = (id: string) =>
  apiRequest<string>(`/apps/${id}`, "DELETE");

//PATCH
export const updateApp = (data: AppDto) =>
  apiRequest<AppDto>(`/apps/${data.id}`, "PATCH", data);
