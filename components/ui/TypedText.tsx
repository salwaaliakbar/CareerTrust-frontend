"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type TypedTextProps = {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
  className?: string;
  loop?: boolean;
  startDelayMs?: number;
  startWhen?: boolean;
  onComplete?: () => void;
};

export default function TypedText({
  words,
  typingSpeed = 80,
  deletingSpeed = 45,
  pauseMs = 1300,
  className = "",
  loop = true,
  startDelayMs = 0,
  startWhen = true,
  onComplete,
}: TypedTextProps) {
  const safeWords = useMemo(() => words.filter(Boolean), [words]);
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasStarted, setHasStarted] = useState(startWhen && startDelayMs === 0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const completionFiredRef = useRef(false);

  useEffect(() => {
    if (!startWhen || hasStarted) return;

    const starter = window.setTimeout(() => setHasStarted(true), Math.max(0, startDelayMs));
    return () => window.clearTimeout(starter);
  }, [hasStarted, startDelayMs, startWhen]);

  useEffect(() => {
    if (safeWords.length === 0 || !hasStarted || hasCompleted) return;

    const currentWord = safeWords[wordIndex % safeWords.length];
    const completedTyping = displayText === currentWord;
    const completedDeleting = displayText.length === 0;

    let timeoutMs = isDeleting ? deletingSpeed : typingSpeed;

    if (completedTyping && !isDeleting) {
      timeoutMs = pauseMs;
    }

    const timer = window.setTimeout(() => {
      if (!isDeleting) {
        if (completedTyping) {
          if (!loop) {
            setHasCompleted(true);
            if (!completionFiredRef.current) {
              completionFiredRef.current = true;
              onComplete?.();
            }
            return;
          }
          setIsDeleting(true);
        } else {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }
        return;
      }

      if (!completedDeleting) {
        setDisplayText(currentWord.slice(0, displayText.length - 1));
        return;
      }

      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % safeWords.length);
    }, timeoutMs);

    return () => window.clearTimeout(timer);
  }, [deletingSpeed, displayText, hasCompleted, hasStarted, isDeleting, loop, onComplete, pauseMs, safeWords, typingSpeed, wordIndex]);

  if (safeWords.length === 0) return null;

  return (
    <span className={className}>
      {displayText}
      {!hasCompleted && hasStarted && (
        <span className="ml-0.5 inline-block h-[1em] w-0.5 translate-y-0.5 bg-current align-middle animate-pulse" aria-hidden="true" />
      )}
    </span>
  );
}
