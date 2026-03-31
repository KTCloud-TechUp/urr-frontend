import { cn } from "@/shared/lib/utils";
import type { TierLevel } from "@/shared/types";
import { TIER_LABELS, TIER_IMAGES } from "@/shared/types";

const tierStyles: Record<TierLevel, string> = {
  lightning: "bg-tier-lightning-bg text-tier-lightning",
  thunder: "bg-tier-thunder-bg text-tier-thunder",
  cloud: "bg-tier-cloud-bg text-tier-cloud",
  mist: "bg-tier-mist-bg text-tier-mist",
};

const sizeStyles = {
  sm: "text-xs px-2 py-0.5 gap-1",
  default: "text-xs px-2.5 py-1 gap-1.5",
  lg: "text-sm px-3 py-1.5 gap-1.5",
};

const iconSizes = {
  sm: 12,
  default: 14,
  lg: 16,
};

interface TierBadgeProps {
  tier: TierLevel;
  size?: "sm" | "default" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function TierBadge({
  tier,
  size = "default",
  showLabel = true,
  className,
}: TierBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold shrink-0",
        tierStyles[tier],
        sizeStyles[size],
        className,
      )}
      aria-label={`${TIER_LABELS[tier]} 등급`}
    >
      <img src={TIER_IMAGES[tier]} width={iconSizes[size]} height={iconSizes[size]} alt="" />
      {showLabel && <span>{TIER_LABELS[tier]}</span>}
    </span>
  );
}
