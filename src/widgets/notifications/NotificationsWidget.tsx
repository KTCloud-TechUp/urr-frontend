"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { useNotifications } from "@/features/notification";
import { EmptyState } from "@/shared/ui/EmptyState";
import { NotificationCard } from "./NotificationCard";

export function NotificationsWidget() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const router = useRouter();

  // Mark all as read when page mounts
  useEffect(() => {
    if (unreadCount > 0) {
      markAllAsRead();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (notifications.length === 0) {
    return (
      <div className="max-w-[800px] mx-auto space-y-6">
        <h1 className="text-2xl font-bold">알림</h1>
        <EmptyState
          icon={Bell}
          description="아직 알림이 없습니다."
          className="py-20"
        />
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      <h1 className="text-2xl font-bold">알림</h1>
      <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            isUnread={!notification.isRead}
            onClick={() => router.push(notification.link)}
          />
        ))}
      </div>
    </div>
  );
}
