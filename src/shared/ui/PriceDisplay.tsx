import { cn } from "@/shared/lib/utils";

interface PriceDisplayProps {
  amount: number;
  size?: "sm" | "default" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "text-sm",
  default: "text-base",
  lg: "text-xl",
};

export function PriceDisplay({ amount, size = "default", className }: PriceDisplayProps) {
  return (
    <span className={cn("font-bold tabular-nums", sizeClasses[size], className)}>
      {amount.toLocaleString("ko-KR")}원
    </span>
  );
}
