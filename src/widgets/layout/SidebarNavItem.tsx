"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { cn } from "@/shared/lib/utils";

interface SidebarNavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  collapsed: boolean;
}

export function SidebarNavItem({
  icon: Icon,
  label,
  href,
  collapsed,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-[10px] transition-colors duration-150",
              isActive
                ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50",
            )}
          >
            <Icon size={20} />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={12}>
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 h-10 px-3 rounded-md transition-colors duration-150 relative",
        isActive
          ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50",
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-sidebar-primary rounded-r-full" />
      )}
      <Icon size={20} className="shrink-0" />
      <span className="text-sm truncate">{label}</span>
    </Link>
  );
}
