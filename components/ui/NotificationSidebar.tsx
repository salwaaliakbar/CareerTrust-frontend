import React, { useState } from "react";
import { Notification } from "@/hooks/useNotificationState";

interface NotificationSidebarProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onOpenHiredForm?: (notification: Notification) => void;
}

const BellIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

/** Offer-response button — enabled if still requires response, disabled if already responded */
const OfferResponseButton = ({
  n,
  onOpenHiredForm,
  stopProp = false,
}: {
  n: Notification;
  onOpenHiredForm: (notification: Notification) => void;
  stopProp?: boolean;
}) => {
  if (n.type !== "application_hired" || !n.applicationId) return null;

  const canRespond = !!n.requiresResponse;

  return canRespond ? (
    <button
      onClick={(e) => {
        if (stopProp) e.stopPropagation();
        onOpenHiredForm(n);
      }}
      className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors"
    >
      <CheckIcon />
      Respond to Offer
    </button>
  ) : (
    <button
      disabled
      className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 text-gray-500 text-xs font-semibold rounded-lg cursor-not-allowed"
    >
      <CheckIcon />
      Already Responded
    </button>
  );
};

const NotificationSidebar: React.FC<NotificationSidebarProps> = ({
  notifications,
  onClose,
  onMarkAllRead,
  onMarkAsRead,
  onDelete,
  onOpenHiredForm,
}) => {
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);

  const handleCardClick = (n: Notification) => {
    if (!n.read && onMarkAsRead) onMarkAsRead(n.id);
    setActiveNotification(n);
  };

  return (
    <>
      {/* Sidebar panel */}
      <div className="fixed top-0 right-0 h-full w-[350px] bg-white shadow-2xl z-9998 flex flex-col border-l border-blue-100 animate-slide-in">
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
            <div className="text-gray-500 text-center mt-10">No notifications</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleCardClick(n)}
                className={`rounded-lg p-4 border cursor-pointer ${
                  n.read
                    ? "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                } shadow-sm flex flex-col gap-1 transition-colors`}
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700">
                    <BellIcon />
                  </span>
                  <span className="font-semibold text-blue-900 text-base flex-1">{n.title}</span>
                  {onDelete && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(n.id); }}
                      className="ml-auto p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Delete notification"
                    >
                      <TrashIcon />
                    </button>
                  )}
                </div>
                <div className="text-gray-700 text-sm mt-1 line-clamp-2">{n.message}</div>
                <div className="text-xs text-gray-400 mt-1">{n.createdAt.toLocaleString()}</div>

                {/* Offer response button in sidebar card */}
                {onOpenHiredForm && (
                  <OfferResponseButton n={n} onOpenHiredForm={onOpenHiredForm} stopProp />
                )}
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

      {/* Centered notification detail modal */}
      {activeNotification && (
        <div
          className="fixed inset-0 z-10001 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setActiveNotification(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20">
                  <BellIcon />
                </span>
                <h2 className="text-lg font-bold">{activeNotification.title}</h2>
              </div>
              <button
                onClick={() => setActiveNotification(null)}
                className="text-white/80 hover:text-white text-2xl font-bold leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-4">
              <p className="text-gray-700 text-base leading-relaxed">{activeNotification.message}</p>
              <p className="text-xs text-gray-400">{activeNotification.createdAt.toLocaleString()}</p>

              {/* Offer response inside modal */}
              {onOpenHiredForm && (
                <OfferResponseButton
                  n={activeNotification}
                  onOpenHiredForm={(notif) => {
                    setActiveNotification(null);
                    onOpenHiredForm(notif);
                  }}
                />
              )}

              <button
                onClick={() => setActiveNotification(null)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationSidebar;
