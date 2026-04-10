import React from "react";
import { Notification } from "@/hooks/useNotificationState";

interface NotificationPopupProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ notification, onClose }) => {
  const isJobRecommendation = notification.type === "job_recommendation";

  return (
    <div
      className={`fixed top-5 right-4 z-[9999] w-[calc(100vw-2rem)] max-w-md rounded-2xl border p-5 shadow-2xl backdrop-blur-sm animate-fade-in flex flex-col gap-3 ${
        isJobRecommendation
          ? "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-sky-50"
          : "border-blue-200 bg-white"
      }`}
    >
      {isJobRecommendation ? (
        <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500" />
      ) : null}

      <div className="flex items-start gap-3 pr-6">
        <span
          className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
            isJobRecommendation
              ? "bg-emerald-100 text-emerald-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </span>
        <div className="flex-1">
          {isJobRecommendation ? (
            <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Recommended for you
            </div>
          ) : null}
          <div
            className={`text-base font-semibold leading-snug ${
              isJobRecommendation ? "text-emerald-900" : "text-blue-900"
            }`}
          >
            {notification.title}
          </div>
        </div>
      </div>

      <div className="text-sm leading-relaxed text-slate-700">{notification.message}</div>

      {isJobRecommendation ? (
        <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-100">
          <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500" />
        </div>
      ) : null}

      <button
        className={`mt-1 self-end rounded-lg px-4 py-1.5 text-sm font-medium text-white transition-all ${
          isJobRecommendation
            ? "bg-emerald-600 hover:bg-emerald-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        onClick={onClose}
      >
        Dismiss
      </button>
    </div>
  );
};

export default NotificationPopup;
