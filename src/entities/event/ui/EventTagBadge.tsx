import { cn } from "@/shared/lib/utils";

interface EventTagBadgeProps {
  tag: string;
  className?: string;
}

export function EventTagBadge({ tag, className }: EventTagBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded",
        tag === "HOT" && "bg-destructive/10 text-destructive",
        tag === "NEW" && "bg-secondary/10 text-secondary",
        tag === "선예매" && "bg-booking-upcoming/10 text-booking-upcoming",
        tag === "양도가능" && "bg-success/10 text-success",
        !["HOT", "NEW", "선예매", "양도가능"].includes(tag) &&
          "bg-muted text-muted-foreground",
        className,
      )}
    >
      {tag}
    </span>
  );
}
