"use client";

import { Ticket, ArrowLeftRight, TrendingUp, CreditCard, Crown } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { formatRelativeTime } from "@/shared/lib/format";
import type { Notification, NotificationType } from "@/shared/types";

const typeIcons: Record<NotificationType, React.ElementType> = {
  booking: Ticket,
  transfer: ArrowLeftRight,
  tier: TrendingUp,
  payment: CreditCard,
  membership: Crown,
};

interface NotificationCardProps {
  notification: Notification;
  isUnread?: boolean;
  onClick?: () => void;
  className?: string;
}

export function NotificationCard({
  notification,
  isUnread = false,
  onClick,
  className,
}: NotificationCardProps) {
  const Icon = typeIcons[notification.type];
  const timeAgo = formatRelativeTime(notification.timestamp);

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 rounded-lg px-4 py-3 cursor-pointer transition-colors hover:bg-accent/50",
        className,
      )}
    >
      {isUnread && (
        <span className="size-2 rounded-full bg-info shrink-0 mt-2" />
      )}
      <div
        className={cn(
          "size-10 rounded-full flex items-center justify-center shrink-0",
          isUnread
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground",
        )}
      >
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm line-clamp-1",
            isUnread ? "font-semibold" : "font-medium",
          )}
        >
          {notification.title}
        </p>
        <p className="text-[13px] text-muted-foreground line-clamp-1">
          {notification.description}
        </p>
      </div>
      <span className="text-xs text-muted-foreground shrink-0">{timeAgo}</span>
    </div>
  );
}
