import { cn } from "@/shared/lib/utils";

interface FaceValueBadgeProps {
  percentage: number;
  className?: string;
}

export function FaceValueBadge({ percentage, className }: FaceValueBadgeProps) {
  const label = percentage <= 100 ? `${percentage}%` : `${percentage}%`;
  const colorClass =
    percentage <= 100
      ? "bg-success/10 text-success"
      : percentage <= 130
        ? "bg-warning/10 text-warning"
        : "bg-destructive/10 text-destructive";

  return (
    <span
      className={cn(
        "inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded",
        colorClass,
        className,
      )}
    >
      {label}
    </span>
  );
}
