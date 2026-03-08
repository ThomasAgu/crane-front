import apiRequest from "./apiClient";
import { AlertDto } from "../dto/AlertDto";

//GET
const getAlertsForApp = (appId: string) =>
  apiRequest<AlertDto[]>(`/alert/${appId}`, "GET");

//POST
const create = (appId: string, alertData: any) => {
  return apiRequest<AlertDto>(`/alert/${appId}`, "POST", alertData);
}

//PATCH
const update = (appId: string, alertId: number, alertData: any) => {
  return apiRequest<AlertDto>(`/alert/${appId}/alert/${alertId}`, "PATCH", alertData.data);
}

//DELETE
const deleteAlert = (appId: string, alertId: number) => 
  apiRequest<void>(`/alert/${appId}/alert/${alertId}`, "DELETE");

export const AlertService = {
  getAlertsForApp,
  create,
  update,
  deleteAlert
}