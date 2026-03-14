import React from "react";
import { Notification } from "@/hooks/useNotificationState";

interface NotificationSidebarProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const NotificationSidebar: React.FC<NotificationSidebarProps> = ({
  notifications,
  onClose,
  onMarkAllRead,
  onMarkAsRead,
  onDelete,
}) => {
  return (
    <div className="fixed top-0 right-0 h-full w-[350px] bg-white shadow-2xl z-[9998] flex flex-col border-l border-blue-100 animate-slide-in">
      <div className="flex items-center justify-between px-6 py-4 border-b border-blue-50 bg-blue-50">
        <span className="font-bold text-lg text-blue-900">Notifications</span>
        <button
          className="text-blue-700 hover:text-blue-900 text-xl font-bold px-2"
          onClick={onClose}
          aria-label="Close notifications sidebar"
        >
          ×
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {notifications.length === 0 ? (
          <div className="text-gray-500 text-center mt-10">
            No notifications
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (!n.read && onMarkAsRead) onMarkAsRead(n.id);
              }}
              className={`rounded-lg p-4 border ${n.read ? "bg-gray-50 border-gray-200" : "bg-blue-50 border-blue-200 cursor-pointer hover:bg-blue-100"} shadow-sm flex flex-col gap-1 transition-colors`}
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </span>
                <span className="font-semibold text-blue-900 text-base flex-1">
                  {n.title}
                </span>
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(n.id);
                    }}
                    className="ml-auto p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Delete notification"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <div className="text-gray-700 text-sm mt-1">{n.message}</div>
              <div className="text-xs text-gray-400 mt-1">
                {n.createdAt.toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
      {notifications.length > 0 && (
        <button
          className="m-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all text-sm"
          onClick={onMarkAllRead}
        >
          Mark all as read
        </button>
      )}
    </div>
  );
};

export default NotificationSidebar;
