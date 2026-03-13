"use client";

import { cn } from "@/shared/lib/utils";

interface FilterChipProps<T extends string> {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function FilterChip<T extends string>({
  options,
  value,
  onChange,
  className,
}: FilterChipProps<T>) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "h-8 px-3.5 rounded-full text-[13px] font-medium border transition-colors cursor-pointer",
            value === opt.value
              ? "border-foreground bg-foreground text-background"
              : "border-border text-foreground hover:bg-accent",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
