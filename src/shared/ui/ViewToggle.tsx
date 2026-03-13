"use client";

import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type ViewMode = "grid" | "list";

interface ViewToggleProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
  className?: string;
}

export function ViewToggle({ value, onChange, className }: ViewToggleProps) {
  return (
    <div className={cn("flex items-center border border-border rounded-lg overflow-hidden", className)}>
      <button
        onClick={() => onChange("grid")}
        className={cn(
          "h-8 px-2.5 transition-colors cursor-pointer",
          value === "grid" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent",
        )}
        aria-label="그리드 보기"
      >
        <LayoutGrid size={16} />
      </button>
      <button
        onClick={() => onChange("list")}
        className={cn(
          "h-8 px-2.5 transition-colors cursor-pointer",
          value === "list" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent",
        )}
        aria-label="리스트 보기"
      >
        <List size={16} />
      </button>
    </div>
  );
}
