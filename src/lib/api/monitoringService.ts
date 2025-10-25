import apiRequest from "./baseService";

//POST
export const startMonitoring = () =>
  apiRequest<void>("/monitoring", "POST");

export const stopMonitoring = () =>
  apiRequest<void>("/monitoring/stop", "POST");

export const restartMonitoring = () =>
  apiRequest<void>("/monitoring/restart", "POST");

export const getMonitoring = () =>
  apiRequest<void>("/monitoring/alert", "POST");
