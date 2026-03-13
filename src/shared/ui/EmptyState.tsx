import { type LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  iconContainer?: boolean;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, iconContainer, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6 text-center", className)}>
      {Icon && (
        iconContainer ? (
          <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Icon className="size-7 text-muted-foreground/50" />
          </div>
        ) : (
          <Icon className="size-10 text-muted-foreground/30 mb-4" />
        )
      )}
      {title && <p className="text-sm font-medium text-foreground mb-1">{title}</p>}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
