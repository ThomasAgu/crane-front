import apiRequest from "./baseService";

//POST
export const startRules = () =>
  apiRequest<void>("/rules", "POST");

export const stopRules = () =>
  apiRequest<void>("/rules/stop", "POST");

export const restarRules = () =>
  apiRequest<void>("/rules/restart", "POST");
