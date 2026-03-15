"use client";

import { cn } from "@/shared/lib/utils";
import { Clock } from "lucide-react";
import { formatTimer } from "@/shared/lib/format";

const sizeStyles = {
  sm: "text-sm",
  default: "text-xl",
  lg: "text-[28px]",
};

interface TimerDisplayProps {
  seconds: number;
  size?: "sm" | "default" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function TimerDisplay({
  seconds,
  size = "default",
  showIcon = true,
  className,
}: TimerDisplayProps) {
  const colorClass =
    seconds <= 30
      ? "text-destructive"
      : seconds <= 60
        ? "text-warning"
        : "text-foreground";

  const iconSize = size === "sm" ? 14 : size === "lg" ? 24 : 18;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 font-mono font-semibold transition-colors duration-300",
        sizeStyles[size],
        colorClass,
        seconds <= 30 && "animate-pulse",
        className,
      )}
    >
      {showIcon && <Clock size={iconSize} />}
      <span className="tabular-nums">{formatTimer(seconds)}</span>
    </div>
  );
}
