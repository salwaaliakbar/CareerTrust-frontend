"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import {
  Notification,
  NotificationContext,
} from "@/hooks/useNotificationState";
import { useSocket } from "@/hooks/useSocket";
import NotificationPopup from "./ui/NotificationPopup";
import HiredResponseForm from "./ui/HiredResponseForm";
import { submitOfferResponse } from "@/services/api/offer.service";
import Swal from "sweetalert2";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentNotification, setCurrentNotification] =
    useState<Notification | null>(null);
  const [showHiredForm, setShowHiredForm] = useState(false);
  const [selectedHiredNotification, setSelectedHiredNotification] =
    useState<Notification | null>(null);

  const openHiredForm = useCallback((notification: Notification) => {
    setSelectedHiredNotification(notification);
    setShowHiredForm(true);
  }, []);

  // Stable: uses functional update, so never needs notifications in deps
  const addNotification = useCallback(
    (
      notification: Omit<Notification, "id" | "read" | "createdAt"> & {
        id?: string;
      },
    ) => {
      const newNotification: Notification = {
        ...notification,
        id: notification.id ?? Math.random().toString(36).substr(2, 9),
        read: false,
        createdAt: new Date(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setCurrentNotification(newNotification);

      setTimeout(() => {
        setCurrentNotification(null);
      }, 5000);

      if (
        notification.type === "application_hired" &&
        notification.requiresResponse
      ) {
        setTimeout(() => {
          setSelectedHiredNotification(newNotification);
          setShowHiredForm(true);
        }, 5500);
      }
    },
    [],
  );

  const markAllAsRead = useCallback(async () => {
    // Optimistic local update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    // Persist to database
    if (!user) return;
    try {
      const token = await getToken();
      if (!token) return;
      await fetch(`${API_BASE}/notifications/${user.id}/read-all`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Failed to persist mark-all-as-read:", err);
    }
  }, [user, getToken]);

  const markAsRead = useCallback(
    async (id: string) => {
      // Optimistic local update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );

      // Persist to database
      try {
        const token = await getToken();
        if (!token) return;
        await fetch(`${API_BASE}/notifications/${id}/read`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } catch (err) {
        console.error("Failed to persist mark-as-read:", err);
      }
    },
    [getToken],
  );

  const deleteNotification = useCallback(
    async (id: string) => {
      // Optimistic local update
      setNotifications((prev) => prev.filter((n) => n.id !== id));

      // Persist to database
      try {
        const token = await getToken();
        if (!token) return;
        await fetch(`${API_BASE}/notifications/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } catch (err) {
        console.error("Failed to delete notification:", err);
      }
    },
    [getToken],
  );

  // ---------------------------------------------------------------
  // Fetch persisted notifications from the DB on mount
  // ---------------------------------------------------------------
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchStoredNotifications = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch(`${API_BASE}/notifications/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) return;

        const body = await res.json();
        const data: any[] = body?.data ?? [];

        const stored: Notification[] = data.map((n: any) => ({
          id: String(n.id),
          type: n.type,
          title: n.title,
          message: n.message,
          read: n.read,
          createdAt: new Date(n.createdAt),
          applicationId: n.applicationId ?? undefined,
          jobId: n.jobId ?? undefined,
          requiresResponse: n.data?.requiresResponse ?? false,
        }));

        setNotifications(stored);
      } catch (err) {
        console.error("Failed to load stored notifications:", err);
      }
    };

    fetchStoredNotifications();
  }, [isLoaded, user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------------------------------------------------------------
  // Socket.IO — stable callbacks so useSocket won't rebuild the
  // socket when this component re-renders due to state changes
  // ---------------------------------------------------------------
  const handleConnect = useCallback(() => {
    console.log("Socket.IO connected successfully");
  }, []);

  const handleDisconnect = useCallback(() => {
    console.log("Socket.IO disconnected");
  }, []);

  const handleError = useCallback((error: Error) => {
    console.error("Socket.IO error:", error);
  }, []);

  const { isConnected, isAuthenticated, on, off } = useSocket({
    clerkId: isLoaded && user ? user.id : null,
    role: (user?.publicMetadata?.role as string) || "jobseeker",
    onConnect: handleConnect,
    onDisconnect: handleDisconnect,
    onError: handleError,
  });

  // Listen for application status notifications
  useEffect(() => {
    if (!isConnected || !isAuthenticated) return;

    const handleApplicationReviewing = (data: any) => {
      console.log("Application reviewing notification:", data);
      addNotification({
        id: data.id ? String(data.id) : undefined,
        type: "application_reviewing",
        title: "Application Under Review",
        message: data.message,
        applicationId: data.applicationId,
        jobId: data.jobId,
      });
    };

    const handleApplicationShortlisted = (data: any) => {
      console.log("Application shortlisted notification:", data);
      addNotification({
        id: data.id ? String(data.id) : undefined,
        type: "application_shortlisted",
        title: "🎉 You've Been Shortlisted!",
        message: data.message,
        applicationId: data.applicationId,
        jobId: data.jobId,
      });
    };

    const handleApplicationInterviewed = (data: any) => {
      console.log("Application interviewed notification:", data);
      addNotification({
        id: data.id ? String(data.id) : undefined,
        type: "application_interviewed",
        title: "🎯 Interview Scheduled!",
        message: data.message,
        applicationId: data.applicationId,
        jobId: data.jobId,
      });
    };

    const handleApplicationRejected = (data: any) => {
      console.log("Application rejected notification:", data);
      addNotification({
        id: data.id ? String(data.id) : undefined,
        type: "application_rejected",
        title: "Application Update",
        message: data.message,
        applicationId: data.applicationId,
        jobId: data.jobId,
      });
    };

    const handleApplicationHired = (data: any) => {
      console.log("Application hired notification:", data);
      addNotification({
        id: data.id ? String(data.id) : undefined,
        type: "application_hired",
        title: "🎊 Job Offer Received!",
        message: data.message,
        requiresResponse: true,
        applicationId: data.applicationId,
        jobId: data.jobId,
      });
    };

    // Exit request handlers
    const handleExitRequestReceived = (data: any) => {
      console.log("Exit request received notification:", data);
      addNotification({
        id: data.id ? String(data.id) : undefined,
        type: "exit_request_received",
        title: data.title || "Exit Request Received",
        message: data.message,
      });
    };

    const handleExitRequestApproved = (data: any) => {
      console.log("Exit request approved notification:", data);
      addNotification({
        id: data.id ? String(data.id) : undefined,
        type: "exit_request_approved",
        title: data.title || "Exit Request Approved",
        message: data.message,
      });
    };

    const handleExitRequestRejected = (data: any) => {
      console.log("Exit request rejected notification:", data);
      addNotification({
        id: data.id ? String(data.id) : undefined,
        type: "exit_request_rejected",
        title: data.title || "Exit Request Rejected",
        message: data.message,
      });
    };

    // Offer response handler (employer receives jobseeker's accept/decline)
    const handleOfferResponse = (data: any) => {
      console.log("Offer response notification:", data);
      addNotification({
        id: data.id ? String(data.id) : undefined,
        type: "offer_response",
        title: data.title || "Offer Response Received",
        message: data.notificationMessage || data.message,
        applicationId: data.applicationId,
        jobId: data.jobId,
      });
    };

    // Register event listeners
    on("application_reviewing", handleApplicationReviewing);
    on("application_shortlisted", handleApplicationShortlisted);
    on("application_interviewed", handleApplicationInterviewed);
    on("application_rejected", handleApplicationRejected);
    on("application_hired", handleApplicationHired);
    on("exit_request_received", handleExitRequestReceived);
    on("exit_request_approved", handleExitRequestApproved);
    on("exit_request_rejected", handleExitRequestRejected);
    on("offer_response", handleOfferResponse);

    // Cleanup
    return () => {
      off("application_reviewing", handleApplicationReviewing);
      off("application_shortlisted", handleApplicationShortlisted);
      off("application_interviewed", handleApplicationInterviewed);
      off("application_rejected", handleApplicationRejected);
      off("application_hired", handleApplicationHired);
      off("exit_request_received", handleExitRequestReceived);
      off("exit_request_approved", handleExitRequestApproved);
      off("exit_request_rejected", handleExitRequestRejected);
      off("offer_response", handleOfferResponse);
    };
    // on/off/addNotification are all stable (useCallback) — only the
    // connection state should gate re-registration of handlers.
  }, [isConnected, isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOfferSubmit = async (
    response: "accept" | "decline",
    reason?: string,
  ) => {
    if (!selectedHiredNotification?.applicationId) {
      throw new Error("No application selected");
    }

    const success = await submitOfferResponse(
      selectedHiredNotification.applicationId,
      response,
      reason,
      getToken,
    );

    if (success) {
      await Swal.fire({
        icon: "success",
        title: response === "accept" ? "Offer Accepted!" : "Response Submitted",
        text:
          response === "accept"
            ? "Congratulations! The employer has been notified of your acceptance."
            : "Your response has been sent to the employer.",
        timer: 3000,
        showConfirmButton: false,
      });

      // Mark notification as requiring no more response
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === selectedHiredNotification.id
            ? { ...n, requiresResponse: false }
            : n,
        ),
      );

      setShowHiredForm(false);
      setSelectedHiredNotification(null);
    } else {
      throw new Error("Failed to submit response");
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAllAsRead,
        markAsRead,
        deleteNotification,
        openHiredForm,
      }}
    >
      {children}
      {currentNotification && (
        <NotificationPopup
          notification={currentNotification}
          onClose={() => setCurrentNotification(null)}
        />
      )}
      {showHiredForm && selectedHiredNotification && (
        <HiredResponseForm
          isOpen={showHiredForm}
          onClose={() => {
            setShowHiredForm(false);
            setSelectedHiredNotification(null);
          }}
          applicationId={selectedHiredNotification.applicationId!}
          jobTitle={
            selectedHiredNotification.message.match(/for (.+) at/)?.[1] ||
            "this position"
          }
          companyName={
            selectedHiredNotification.message.match(/at (.+)\./)?.[1] ||
            "the company"
          }
          onSubmit={handleOfferSubmit}
        />
      )}
    </NotificationContext.Provider>
  );
}
