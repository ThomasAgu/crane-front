import apiRequiest from "./apiClient";
import { NotificationDto } from "../dto/NotificationDto";

//GET
const getNotifications = () =>
  apiRequiest<NotificationDto[]>("/notifications", "GET");

  
//POST
const readNotification = (id: string) =>
  apiRequiest<void>(`/notifications/${id}/read`, "POST");

const readAllNotifications = () =>
  apiRequiest<void>("/notifications/read-all", "POST");

//DELETE
const deleteNotification = (id: string) =>
  apiRequiest<void>(`/notifications/${id}`, "DELETE");

export const NotificationService = {
  getNotifications,
  readNotification,
  readAllNotifications,
  deleteNotification,
};