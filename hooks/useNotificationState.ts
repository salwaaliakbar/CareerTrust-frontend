import { createContext, useContext } from "react";

export type NotificationType =
  | "job_recommendation"
  | "application_received"
  | "application_reviewing"
  | "application_shortlisted"
  | "application_interviewed"
  | "application_rejected"
  | "application_hired"
  | "offer_response"
  | "exit_request_received"
  | "exit_request_approved"
  | "exit_request_rejected";

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
    notification: Omit<Notification, "id" | "read" | "createdAt"> & {
      id?: string;
    },
  ) => void;
  markAllAsRead: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  openHiredForm: (notification: Notification) => void;
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
