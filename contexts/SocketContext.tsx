"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle2, Bell } from "lucide-react";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [liveToast, setLiveToast] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" 
      ? localStorage.getItem("munifix_authtoken") || localStorage.getItem("token") 
      : null;

    if (!token || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const SOCKET_URL = API_BASE_URL.replace(/\/api$/, "");

    console.log(`[Socket] Connecting to ${SOCKET_URL} with token`);
    const newSocket = io(SOCKET_URL, {
      auth: {
        token: token,
      },
      transports: ["polling", "websocket"],
    });

    newSocket.on("connect", () => {
      console.log("[Socket] Connected successfully, socket ID:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.warn("[Socket] Connection error:", err.message);
    });

    // Listen for direct personal notifications
    newSocket.on("notification", (data: any) => {
      console.log("[Socket] Live notification received:", data);
      
      // Save notification permanently in local storage for the frontend notification bell
      try {
        const stored = localStorage.getItem("munifix_local_notifications");
        const list = stored ? JSON.parse(stored) : [];
        const localNotification = {
          id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          message: data.message || "You have a new update.",
          complaint_id: data.complaint_id || null,
          created_at: new Date().toISOString(),
          is_read: false
        };
        list.unshift(localNotification);
        localStorage.setItem("munifix_local_notifications", JSON.stringify(list));
      } catch (err) {
        console.error("Failed to persist local notification:", err);
      }

      // Trigger a live, premium visual alert toast
      setLiveToast({
        title: data.title || "Live Alert",
        message: data.message || "You have a new update."
      });

      // Dispatch a custom event to notify components like Navbar to refresh
      window.dispatchEvent(new Event("munifix_new_notification"));

      // Auto-hide toast after 4 seconds
      setTimeout(() => {
        setLiveToast(null);
      }, 4000);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}

      {/* Floating Live Socket.io Notification Toast */}
      {liveToast && (
        <div className="fixed top-20 right-6 z-[9999] bg-slate-900 text-white p-4.5 rounded-2xl shadow-2xl flex items-start gap-3.5 max-w-sm animate-scale-up border border-slate-800">
          <div className="p-2 bg-brand-teal/20 text-brand-cyan rounded-xl shrink-0 mt-0.5 animate-pulse">
            <Bell className="w-5 h-5 text-brand-cyan" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-xs font-black tracking-wider uppercase text-emerald-400">
              {liveToast.title}
            </h4>
            <p className="text-xs text-slate-200 font-semibold leading-relaxed">
              {liveToast.message}
            </p>
          </div>
          <button 
            onClick={() => setLiveToast(null)}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer select-none font-bold text-xs"
          >
            ✕
          </button>
        </div>
      )}
    </SocketContext.Provider>
  );
};
