import React, { createContext, useContext, useState, useEffect } from 'react';
import { NotificationDto } from '@/lib/dto/NotificationDto';
import {NotificationService} from '@/lib/api/notificationService';

interface NotificationContextType {
  notifications: NotificationDto[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);

  const fetchNotifications = async () => {
    try {
      const data = await NotificationService.getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await NotificationService.readNotification(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read_by_user: true } : n)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await NotificationService.readAllNotifications();
      setNotifications(prev => prev.map(n => ({ ...n, read_by_user: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const removeNotification = async (id: string) => {
    try {
      await NotificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Efecto para la carga inicial y un polling opcional de 1 minuto
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); 
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read_by_user).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications debe usarse dentro de NotificationProvider");
  return context;
};