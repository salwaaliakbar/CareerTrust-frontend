
import { createContext, useContext } from "react";

export type NotificationType = "job_recommendation";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "read" | "createdAt">) => void;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotificationState() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotificationState must be used within a NotificationProvider");
  return ctx;
}
