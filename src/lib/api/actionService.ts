import apiRequest from "./apiClient";
import { ActionDto } from "../dto/ActionDto";

//GET
const get_all = () => apiRequest<ActionDto[]>("/action", "GET");

export const ActionService = {
  get_all
}