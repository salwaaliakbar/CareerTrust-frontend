"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface UseSocketOptions {
  clerkId?: string | null;
  role?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const { clerkId, role } = options;

  // Store callbacks in refs so they never become stale deps and don't
  // trigger socket teardown/rebuild on every parent re-render.
  const onConnectRef = useRef(options.onConnect);
  const onDisconnectRef = useRef(options.onDisconnect);
  const onErrorRef = useRef(options.onError);
  useEffect(() => {
    onConnectRef.current = options.onConnect;
    onDisconnectRef.current = options.onDisconnect;
    onErrorRef.current = options.onError;
  });

  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Only re-create the socket when clerkId or role actually change
  useEffect(() => {
    if (!clerkId) {
      return;
    }

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
      socket.emit("authenticate", { clerkId, role: role || "jobseeker" });
      onConnectRef.current?.();
    });

    socket.on("authenticated", (data) => {
      console.log("Socket authenticated:", data);
      setIsAuthenticated(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
      setIsAuthenticated(false);
      onDisconnectRef.current?.();
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      onErrorRef.current?.(error as Error);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
      onErrorRef.current?.(error as Error);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setIsAuthenticated(false);
    };
    // Only clerkId and role should drive reconnection — callbacks are in refs
  }, [clerkId, role]);

  /** Subscribe to a specific Socket.IO event */
  const on = useCallback(
    (event: string, callback: (...args: unknown[]) => void) => {
      socketRef.current?.on(event, callback);
    },
    [],
  );

  /** Unsubscribe from a Socket.IO event */
  const off = useCallback(
    (event: string, callback?: (...args: unknown[]) => void) => {
      if (callback) {
        socketRef.current?.off(event, callback);
      } else {
        socketRef.current?.off(event);
      }
    },
    [],
  );

  /** Emit a Socket.IO event to the server */
  const emit = useCallback((event: string, data?: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  return {
    isConnected,
    isAuthenticated,
    on,
    off,
    emit,
  };
};
