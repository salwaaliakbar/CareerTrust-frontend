"use client";

import { useEffect, useRef, useState } from "react";
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
  const { clerkId, role, onConnect, onDisconnect, onError } = options;
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Only initialize socket if clerkId is provided
    if (!clerkId) {
      return;
    }

    // Initialize socket connection
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);

      // Authenticate with the server
      socket.emit("authenticate", { clerkId, role: role || "jobseeker" });

      onConnect?.();
    });

    socket.on("authenticated", (data) => {
      console.log("Socket authenticated:", data);
      setIsAuthenticated(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
      setIsAuthenticated(false);
      onDisconnect?.();
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      onError?.(error as Error);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
      onError?.(error as Error);
    });

    // Cleanup on unmount
    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
      socketRef.current = null;
    };
  }, [clerkId, role, onConnect, onDisconnect, onError]);

  /**
   * Subscribe to a specific event
   */
  const on = (event: string, callback: (...args: unknown[]) => void) => {
    socketRef.current?.on(event, callback);
  };

  /**
   * Unsubscribe from a specific event
   */
  const off = (event: string, callback?: (...args: unknown[]) => void) => {
    if (callback) {
      socketRef.current?.off(event, callback);
    } else {
      socketRef.current?.off(event);
    }
  };

  /**
   * Emit an event to the server
   */
  const emit = (event: string, data?: unknown) => {
    socketRef.current?.emit(event, data);
  };

  return {
    isConnected,
    isAuthenticated,
    on,
    off,
    emit,
  };
};
