import React from "react";
import { Notification } from "@/hooks/useNotificationState";

interface NotificationPopupProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ notification, onClose }) => {
  return (
    <div className="fixed top-6 right-6 z-[9999] bg-white border border-blue-200 shadow-2xl rounded-xl p-5 min-w-[320px] animate-fade-in flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </span>
        <span className="font-semibold text-blue-900 text-lg">{notification.title}</span>
      </div>
      <div className="text-gray-700 text-base">{notification.message}</div>
      <button
        className="mt-2 self-end px-4 py-1.5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all text-sm"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export default NotificationPopup;
