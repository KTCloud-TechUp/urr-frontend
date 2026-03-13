import { type LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description: string;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6 text-center", className)}>
      {Icon && <Icon className="size-10 text-muted-foreground/30 mb-4" />}
      {title && <p className="text-sm font-medium text-foreground mb-1">{title}</p>}
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
