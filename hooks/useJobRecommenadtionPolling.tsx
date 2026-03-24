import { useEffect, useRef, useState } from "react";
import axios from "axios";

type PollingEndReason = "success" | "timeout";

interface UseJobRecommendationPollingOptions {
  clerkId: string;
  pollSince?: string | null;
  onNewRecommendation: () => void | Promise<void>;
  onPollingEnd?: (reason: PollingEndReason) => void;
  interval?: number;
  maxAttempts?: number;
}

export function useJobRecommendationPolling({
  clerkId,
  pollSince = null,
  onNewRecommendation,
  onPollingEnd,
  interval = 10000,
  maxAttempts = 10,
}: UseJobRecommendationPollingOptions) {
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const lastUpdatedAtRef = useRef<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const attemptsRef = useRef<number>(0);
  const onNewRecommendationRef = useRef(onNewRecommendation);
  const onPollingEndRef = useRef(onPollingEnd);

  useEffect(() => {
    onNewRecommendationRef.current = onNewRecommendation;
  }, [onNewRecommendation]);

  useEffect(() => {
    onPollingEndRef.current = onPollingEnd;
  }, [onPollingEnd]);

  useEffect(() => {
    let isMounted = true;

    if (!clerkId) {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      attemptsRef.current = 0;
      return;
    }

    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    attemptsRef.current = 0;
    lastUpdatedAtRef.current = null;
    setLastUpdatedAt(null);

    const pollSinceMs = pollSince ? Date.parse(pollSince) : Number.NaN;

    const checkForUpdate = async () => {
      try {
        attemptsRef.current += 1;
        const res = await axios.get(
          `/api/jobRecommendation/status?clerkId=${clerkId}`,
        );

        const updatedAt = res.data?.lastUpdatedAt
          ? String(res.data.lastUpdatedAt)
          : null;

        if (isMounted) {
          const updatedAtMs = updatedAt ? Date.parse(updatedAt) : Number.NaN;
          const hasNewSincePollStart =
            updatedAt &&
            !Number.isNaN(updatedAtMs) &&
            !Number.isNaN(pollSinceMs) &&
            updatedAtMs > pollSinceMs;

          const hasChangedSinceLastCheck =
            !!lastUpdatedAtRef.current &&
            !!updatedAt &&
            updatedAt !== lastUpdatedAtRef.current;

          if (hasNewSincePollStart || hasChangedSinceLastCheck) {
            if (pollingRef.current) {
              clearInterval(pollingRef.current);
              pollingRef.current = null;
            }

            try {
              await Promise.resolve(onNewRecommendationRef.current());
            } finally {
              onPollingEndRef.current?.("success");
            }
            return;
          }

          setLastUpdatedAt(updatedAt);
          lastUpdatedAtRef.current = updatedAt;

          if (attemptsRef.current >= maxAttempts && pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
            onPollingEndRef.current?.("timeout");
          }
        }
      } catch (err) {
        if (attemptsRef.current >= maxAttempts && pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          onPollingEndRef.current?.("timeout");
        }
      }
    };

    checkForUpdate();
    pollingRef.current = setInterval(checkForUpdate, interval);

    return () => {
      isMounted = false;
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      attemptsRef.current = 0;
    };
  }, [clerkId, pollSince, interval, maxAttempts]);

  return lastUpdatedAt;
}