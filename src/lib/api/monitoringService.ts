import apiRequest from "./apiClient";

//POST
const startMonitoring = () =>
  apiRequest<void>("/monitoring", "POST");

const stopMonitoring = () =>
  apiRequest<void>("/monitoring/stop", "POST");

const restartMonitoring = () =>
  apiRequest<void>("/monitoring/restart", "POST");

const getMonitoring = () =>
  apiRequest<void>("/monitoring/alert", "POST");

export const MonitoringService = {
  startMonitoring,
  stopMonitoring,
  restartMonitoring,
  getMonitoring,
};