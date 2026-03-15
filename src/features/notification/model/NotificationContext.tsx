"use client";

import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useContext,
} from "react";
import type { ReactNode } from "react";
import type { Notification } from "@/shared/types";
import { mockNotifications } from "@/shared/lib/mocks/notifications";

export interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
}

export const NotificationContext =
  createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => (n.isRead ? n : { ...n, isRead: true })),
    );
  }, []);

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  return ctx;
}
