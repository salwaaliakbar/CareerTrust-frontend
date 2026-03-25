"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { useAppDispatch } from "@/redux/store/hooks";
import { applyOfferResponseOptimistic } from "@/redux/store/slices/dashboardSlice";
import { updateJobMatches } from "@/redux/store/slices/jobsSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

type JobRecommendationItem = {
  jobId: number;
  score?: number | null;
  matchPercentage?: number | null;  // Backend now returns normalized 0-100 scale
};

const normalizeMatchPercentage = (value: unknown): number => {
  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
    return 0;
  }
  const percent = value <= 1 ? value * 100 : value;
  return Math.max(0, Math.min(100, Math.round(percent)));
};

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentNotification, setCurrentNotification] =
    useState<Notification | null>(null);
  const [showHiredForm, setShowHiredForm] = useState(false);
  const [selectedHiredNotification, setSelectedHiredNotification] =
    useState<Notification | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const userInteractedRef = useRef(false);
  const recommendationAbortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const markInteraction = () => {
      userInteractedRef.current = true;
    };

    window.addEventListener("pointerdown", markInteraction, { once: true });
    window.addEventListener("keydown", markInteraction, { once: true });

    return () => {
      window.removeEventListener("pointerdown", markInteraction);
      window.removeEventListener("keydown", markInteraction);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        void audioContextRef.current.close();
      }
    };
  }, []);

  const playNotificationSound = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      const AudioContextCtor =
        window.AudioContext ||
        (window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;

      if (!AudioContextCtor) return;

      if (!audioContextRef.current || audioContextRef.current.state === "closed") {
        audioContextRef.current = new AudioContextCtor();
      }

      const audioContext = audioContextRef.current;
      if (!audioContext) return;

      if (audioContext.state === "suspended") {
        if (!userInteractedRef.current) return;
        void audioContext.resume();
      }

      const startAt = audioContext.currentTime + 0.01;
      const notesHz = [784, 988, 1175];
      const noteSpacing = 0.11;
      const noteDuration = 0.18;

      notesHz.forEach((frequency, index) => {
        const noteStart = startAt + index * noteSpacing;
        const noteEnd = noteStart + noteDuration;

        const bodyOsc = audioContext.createOscillator();
        bodyOsc.type = "sine";
        bodyOsc.frequency.setValueAtTime(frequency, noteStart);

        const shimmerOsc = audioContext.createOscillator();
        shimmerOsc.type = "triangle";
        shimmerOsc.frequency.setValueAtTime(frequency * 2, noteStart);

        const toneFilter = audioContext.createBiquadFilter();
        toneFilter.type = "lowpass";
        toneFilter.frequency.setValueAtTime(3200, noteStart);
        toneFilter.Q.setValueAtTime(0.8, noteStart);

        const noteGain = audioContext.createGain();
        noteGain.gain.setValueAtTime(0.0001, noteStart);
        noteGain.gain.exponentialRampToValueAtTime(0.07, noteStart + 0.015);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

        bodyOsc.connect(toneFilter);
        shimmerOsc.connect(toneFilter);
        toneFilter.connect(noteGain);
        noteGain.connect(audioContext.destination);

        bodyOsc.start(noteStart);
        shimmerOsc.start(noteStart);
        bodyOsc.stop(noteEnd);
        shimmerOsc.stop(noteEnd);
      });
    } catch (error) {
      // Browser autoplay policies may block synthesized sounds before user interaction.
      console.debug("Notification sound blocked:", error);
    }
  }, []);

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

      playNotificationSound();

      if (notification.type !== "job_recommendation") {
        setCurrentNotification(newNotification);

        setTimeout(() => {
          setCurrentNotification(null);
        }, 5000);
      }

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
    [playNotificationSound],
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

    const handleJobRecommendationReady = async (data: any) => {
      console.log("Job recommendation ready event:", data);
      if (!user?.id) return;

      try {
        // CRITICAL FIX #1: Cancel previous in-flight fetch to prevent race conditions
        // If multiple socket events arrive rapidly, only the latest one should update Redux
        recommendationAbortControllerRef.current?.abort();
        
        const controller = new AbortController();
        recommendationAbortControllerRef.current = controller;

        const eventMatchPercentage = normalizeMatchPercentage(
          data?.matchPercentage ?? data?.score,
        );

        // STEP 1: Optimistic update - immediately update Redux with job data from event
        if (data?.jobId) {
          // Dispatch immediate recommendation update even if user is on jobs page
          dispatch(updateJobMatches([
            {
              id: data.jobId,
              matchPercentage: eventMatchPercentage,
              ...(data?.job || {}),
            }
          ]));

          console.log(
            "Job recommendation updated optimistically in Redux:",
            { jobId: data.jobId, matchPercentage: eventMatchPercentage }
          );
        }

        // STEP 2: Fetch latest recommendations from backend in parallel
        // This ensures we have all recent recommendations, not just this one
        const res = await fetch(
          `/api/jobRecommendation/recommendations?clerkId=${user.id}`,
          { signal: controller.signal }  // ← CRITICAL FIX: Abort if new event arrives
        );

        // CRITICAL FIX #2: Check if this request was aborted (race condition)
        if (controller.signal.aborted) {
          console.log("Recommendation fetch cancelled due to newer event");
          return;
        }

        if (!res.ok) {
          throw new Error(`Failed to fetch recommendations (${res.status})`);
        }

        const body = await res.json();
        const recommendations: JobRecommendationItem[] = Array.isArray(
          body?.recommendations,
        )
          ? body.recommendations
          : [];

        // STEP 3: Update Redux with all recommendations (complete sync)
        // Backend now standardizes all scores to 0-100 scale, simple direct pass-through
        dispatch(
          updateJobMatches(
            recommendations.map((r) => ({
              id: r.jobId,
              matchPercentage: normalizeMatchPercentage(
                r.matchPercentage ?? r.score,
              ),
            })),
          ),
        );

        console.log("Redux updated with latest job recommendations:", {
          count: recommendations.length,
        });

        // STEP 4: Fetch full job details in background (if not already in state)
        if (data?.jobId && data?.job) {
          // Job data already in event, but optionally fetch fresh details
          // in background for any missing fields
          (async () => {
            try {
              // Skip background fetch if this request was aborted
              if (controller.signal.aborted) return;

              const jobRes = await fetch(`/api/jobs/${data.jobId}`);
              if (jobRes.ok) {
                const jobDetails = await jobRes.json();
                if (jobDetails?.data) {
                  dispatch(updateJobMatches([
                    {
                      id: data.jobId,
                      matchPercentage: eventMatchPercentage,
                      ...jobDetails.data,
                    }
                  ]));
                }
              }
            } catch (err) {
              // Silently fail - optimistic update already applied
              console.debug("Failed to fetch full job details:", err);
            }
          })();
        }

        // STEP 5: Show notification
        addNotification({
          type: "job_recommendation",
          title: "New Job Recommendations!",
          message: data?.job?.title 
            ? `New match: ${data.job.title} (${eventMatchPercentage}%)`
            : "Your recommendations were updated. Check the jobs page.",
        });
      } catch (error) {
        // Skip logging if error was due to abort (race condition safety)
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Recommendation update aborted (newer event arrived)");
          return;
        }
        console.error("Failed to sync job recommendations from socket event:", error);
      }
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
    on("job_recommendation_ready", handleJobRecommendationReady);

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
      off("job_recommendation_ready", handleJobRecommendationReady);
    };
    // on/off/addNotification are all stable (useCallback) — only the
    // connection state should gate re-registration of handlers.
  }, [isConnected, isAuthenticated, dispatch, user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

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

      dispatch(
        applyOfferResponseOptimistic({
          applicationId: selectedHiredNotification.applicationId,
          response,
        }),
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
