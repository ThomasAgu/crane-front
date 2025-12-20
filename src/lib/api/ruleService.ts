import apiRequest from "./apiClient";

//POST
const startRules = () =>
  apiRequest<void>("/rules", "POST");

const stopRules = () =>
  apiRequest<void>("/rules/stop", "POST");

const restartRules = () =>
  apiRequest<void>("/rules/restart", "POST");

export const RuleService = {
  start: startRules,
  stop: stopRules,
  restart: restartRules
};