import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/api";

export function useJobRecommendationPolling(clerkId: string, onNewRecommendation: () => void, interval = 10000, maxAttempts = 10) {
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const lastUpdatedAtRef = useRef<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const attemptsRef = useRef<number>(0);

  useEffect(() => {
    let isMounted = true;

    if (!clerkId) return;

    const checkForUpdate = async () => {
      try {
        attemptsRef.current += 1;
        const res = await axios.get(`${API_ENDPOINTS.JOB_RECOMMENDATION_STATUS}?clerkId=${clerkId}`);
        console.log("response: ", res)
        console.log("lastUpdatedAt (ref): ", lastUpdatedAtRef.current)
        const updatedAt = res.data.lastUpdatedAt;
        if (isMounted) {
          if (lastUpdatedAtRef.current && updatedAt && updatedAt !== lastUpdatedAtRef.current) {
            onNewRecommendation();
            // Stop polling immediately
            if (pollingRef.current) clearInterval(pollingRef.current);
            return;
          }
          setLastUpdatedAt(updatedAt);
          lastUpdatedAtRef.current = updatedAt;
          // Stop polling if max attempts reached
          if (attemptsRef.current >= maxAttempts && pollingRef.current) {
            clearInterval(pollingRef.current);
          }
        }
      } catch (err) {
        // Optionally handle error
      }
    };

    // Initial check
    checkForUpdate();

    // Start polling
    pollingRef.current = setInterval(checkForUpdate, interval);

    return () => {
      isMounted = false;
      if (pollingRef.current) clearInterval(pollingRef.current);
      attemptsRef.current = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clerkId]);

  return lastUpdatedAt;
}