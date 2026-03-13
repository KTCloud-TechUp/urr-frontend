"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import type { Artist } from "@/shared/types";

interface ArtistTreeItemProps {
  artist: Artist;
  isExpanded: boolean;
  onToggle: () => void;
  collapsed: boolean;
}

const subItems = [
  { label: "아티스트 홈", path: "", end: true },
  { label: "공연", path: "/events", end: false },
  { label: "양도", path: "/transfers", end: false },
];

export function ArtistTreeItem({
  artist,
  isExpanded,
  onToggle,
  collapsed,
}: ArtistTreeItemProps) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(`/artists/${artist.id}`);
  const basePath = `/artists/${artist.id}`;

  const avatar = (
    <Avatar className="size-6 shrink-0">
      <AvatarImage src={artist.avatar} alt={artist.name} />
      <AvatarFallback className="text-[10px] font-medium bg-muted">
        {artist.name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );

  // Collapsed: avatar only with tooltip
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={basePath}
            className={cn(
              "flex items-center justify-center size-10 rounded-md transition-colors duration-150",
              isActive ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50",
            )}
          >
            {avatar}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {artist.name}
        </TooltipContent>
      </Tooltip>
    );
  }

  // Expanded sidebar
  return (
    <div>
      {/* Artist root row */}
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center gap-2.5 w-full h-9 px-3 rounded-md transition-colors duration-150 text-left",
          isActive
            ? "bg-sidebar-accent/70 text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/50",
        )}
      >
        {avatar}
        <span className="text-sm font-medium truncate flex-1">{artist.name}</span>
        <ChevronDown
          size={14}
          className={cn(
            "shrink-0 text-sidebar-muted-foreground transition-transform duration-200",
            isExpanded && "rotate-180",
          )}
        />
      </button>

      {/* Sub-items with grid animation */}
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="py-0.5">
            {subItems.map((item) => {
              const href = `${basePath}${item.path}`;
              const itemActive = item.end
                ? pathname === href
                : pathname.startsWith(href);

              return (
                <Link
                  key={item.path}
                  href={href}
                  className={cn(
                    "flex items-center h-8 pl-11 pr-3 rounded-md text-[13px] transition-colors duration-150 relative",
                    itemActive
                      ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                      : "text-sidebar-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                  )}
                >
                  {itemActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-sidebar-primary rounded-r-full" />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
