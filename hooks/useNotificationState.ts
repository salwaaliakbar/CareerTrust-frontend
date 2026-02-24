import { createContext, useContext } from "react";

export type NotificationType =
  | "job_recommendation"
  | "application_reviewing"
  | "application_shortlisted"
  | "application_interviewed"
  | "application_rejected"
  | "application_hired";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  requiresResponse?: boolean; // For hired status
  applicationId?: number;
  jobId?: number;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, "id" | "read" | "createdAt">,
  ) => void;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
}

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export function useNotificationState() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotificationState must be used within a NotificationProvider",
    );
  return ctx;
}
