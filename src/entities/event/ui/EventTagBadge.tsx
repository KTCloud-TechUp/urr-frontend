import { cn } from "@/shared/lib/utils";

export type EventTag = "HOT" | "NEW" | "PRE_SALE" | "TRANSFER_AVAILABLE";

const tagConfig: Record<EventTag, { label: string; className: string }> = {
  HOT: { label: "HOT", className: "bg-destructive/10 text-destructive" },
  NEW: { label: "NEW", className: "bg-secondary/10 text-secondary" },
  PRE_SALE: { label: "선예매", className: "bg-booking-upcoming/10 text-booking-upcoming" },
  TRANSFER_AVAILABLE: { label: "양도가능", className: "bg-success/10 text-success" },
};

interface EventTagBadgeProps {
  tag: EventTag | string;
  className?: string;
}

export function EventTagBadge({ tag, className }: EventTagBadgeProps) {
  const config = tagConfig[tag as EventTag];
  return (
    <span
      className={cn(
        "inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded",
        config ? config.className : "bg-muted text-muted-foreground",
        className,
      )}
    >
      {config ? config.label : tag}
    </span>
  );
}
