import { useEffect, useRef, useState } from "react";
import axios from "axios";

export function useJobRecommendationPolling(clerkId: string, onNewRecommendation: () => void, interval = 10000) {
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkForUpdate = async () => {
      try {
        const res = await axios.get(`/api/jobRecommendationStatus?clerkId=${clerkId}`);
        const updatedAt = res.data.lastUpdatedAt;
        if (isMounted) {
          if (lastUpdatedAt && updatedAt && updatedAt !== lastUpdatedAt) {
            onNewRecommendation();
          }
          setLastUpdatedAt(updatedAt);
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clerkId]);

  return lastUpdatedAt;
}