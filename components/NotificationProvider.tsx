"use client";
import React, { useState, useEffect } from "react";
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

  const addNotification = (
    notification: Omit<Notification, "id" | "read" | "createdAt">,
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      read: false,
      createdAt: new Date(),
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Show popup for new notification
    setCurrentNotification(newNotification);

    // Auto-hide popup after 5 seconds
    setTimeout(() => {
      setCurrentNotification(null);
    }, 5000);

    // Automatically show hired form for hired notifications
    if (
      notification.type === "application_hired" &&
      notification.requiresResponse
    ) {
      setTimeout(() => {
        setSelectedHiredNotification(newNotification);
        setShowHiredForm(true);
      }, 5500); // Show after popup disappears
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  // Initialize Socket.IO connection
  const { isConnected, isAuthenticated, on, off } = useSocket({
    clerkId: isLoaded && user ? user.id : null,
    role: (user?.publicMetadata?.role as string) || "jobseeker",
    onConnect: () => {
      console.log("Socket.IO connected successfully");
    },
    onDisconnect: () => {
      console.log("Socket.IO disconnected");
    },
    onError: (error) => {
      console.error("Socket.IO error:", error);
    },
  });

  // Listen for application status notifications
  useEffect(() => {
    if (!isConnected || !isAuthenticated) return;

    const handleApplicationReviewing = (data: any) => {
      console.log("Application reviewing notification:", data);
      addNotification({
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
        type: "application_hired",
        title: "🎊 Job Offer Received!",
        message: data.message,
        requiresResponse: true,
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

    // Cleanup
    return () => {
      off("application_reviewing", handleApplicationReviewing);
      off("application_shortlisted", handleApplicationShortlisted);
      off("application_interviewed", handleApplicationInterviewed);
      off("application_rejected", handleApplicationRejected);
      off("application_hired", handleApplicationHired);
    };
  }, [isConnected, isAuthenticated, on, off]);

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
      value={{ notifications, addNotification, markAllAsRead, markAsRead }}
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
