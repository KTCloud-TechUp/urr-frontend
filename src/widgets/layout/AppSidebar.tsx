"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  Crown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui";
import { Separator } from "@/shared/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { TierBadge } from "@/entities/user";
import { SidebarNavItem } from "./SidebarNavItem";
import { ArtistTreeItem } from "./ArtistTreeItem";
import { useLayout } from "./model/useLayout";
import { useCurrentUser } from "@/features/auth/model/useCurrentUser";
import { mockUser } from "@/shared/lib/mocks/user";
import { mockArtists } from "@/shared/lib/mocks/artists";
import { cn } from "@/shared/lib/utils";

const navItems = [
  { icon: Home, label: "홈", href: "/" },
  { icon: Calendar, label: "공연", href: "/events" },
  { icon: Users, label: "아티스트", href: "/artists" },
];

const MAX_VISIBLE_ARTISTS = 5;

export function AppSidebar() {
  const {
    isSidebarExpanded,
    toggleSidebar,
    isArtistExpanded,
    toggleArtist,
    expandArtist,
  } = useLayout();
  const pathname = usePathname();
  const [showAllArtists, setShowAllArtists] = useState(false);

  const collapsed = !isSidebarExpanded;
  const { data: meData } = useCurrentUser();
  const displayName = meData?.nickname ?? mockUser.name;

  // Resolve membership artists (only active memberships)
  const membershipArtists = mockUser.memberships
    .filter((m) => m.isActive)
    .map((m) => mockArtists.find((a) => a.id === m.artistId))
    .filter(Boolean) as typeof mockArtists;

  // Auto-expand artist tree when navigating to an artist page
  useEffect(() => {
    const match = pathname.match(/^\/artists\/([^/]+)/);
    if (match) {
      expandArtist(match[1]);
    }
  }, [pathname, expandArtist]);

  // Determine visible artists
  const visibleArtists =
    showAllArtists || membershipArtists.length <= MAX_VISIBLE_ARTISTS
      ? membershipArtists
      : membershipArtists.slice(0, MAX_VISIBLE_ARTISTS);
  const hiddenCount = membershipArtists.length - MAX_VISIBLE_ARTISTS;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen z-10 bg-sidebar border-r border-sidebar-border flex flex-col transition-[width] duration-250 ease-out overflow-hidden",
        collapsed ? "w-16" : "w-[220px]",
      )}
    >
      {/* Header: Logo + Collapse Toggle */}
      <div
        className={cn(
          "flex items-center shrink-0 h-14 border-b border-sidebar-border",
          collapsed ? "justify-center px-2" : "justify-between px-4",
        )}
      >
        {!collapsed && (
          <Link href="/" className="flex items-center">
            <img src="/logos/logo5.svg" alt="URR" className="h-10" />
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="size-8 flex items-center justify-center rounded-md text-sidebar-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
          aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Membership CTA */}
      <div className={cn("pt-3 pb-3 px-3", collapsed && "flex justify-center")}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/membership"
                className="h-[34px] w-10 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Crown size={16} />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              멤버십 가입
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button asChild size="sm" className="w-full gap-1.5 h-[34px]">
            <Link href="/membership">
              <Crown size={14} />
              멤버십 가입
            </Link>
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav
        className={cn(
          "flex flex-col gap-0.5 px-2",
          collapsed && "items-center",
        )}
      >
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className="px-3 py-2">
        <Separator className="bg-sidebar-border" />
      </div>

      {/* MY ARTISTS */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {!collapsed && (
          <div className="px-4 pb-1.5">
            <span className="text-[11px] font-semibold text-sidebar-muted-foreground uppercase tracking-wider">
              MY ARTISTS
            </span>
          </div>
        )}

        {membershipArtists.length === 0 ? (
          !collapsed && (
            <div className="px-4 py-3">
              <p className="text-[13px] text-sidebar-muted-foreground leading-relaxed">
                가입한 멤버십이 없습니다
              </p>
              <Link
                href="/membership"
                className="text-[13px] text-primary font-medium hover:underline mt-1 inline-block"
              >
                멤버십 가입하기
              </Link>
            </div>
          )
        ) : (
          <div
            className={cn(
              "flex flex-col gap-0.5",
              collapsed ? "items-center" : "px-2",
            )}
          >
            {visibleArtists.map((artist) => (
              <ArtistTreeItem
                key={artist.id}
                artist={artist}
                isExpanded={isArtistExpanded(artist.id)}
                onToggle={() => toggleArtist(artist.id)}
                collapsed={collapsed}
              />
            ))}

            {/* Show more toggle */}
            {hiddenCount > 0 && !collapsed && (
              <button
                onClick={() => setShowAllArtists(!showAllArtists)}
                className="flex items-center h-8 px-3 text-[13px] text-sidebar-muted-foreground hover:text-sidebar-foreground transition-colors cursor-pointer"
              >
                {showAllArtists ? "접기" : `더 보기 (+${hiddenCount})`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer: User Profile */}
      <div className="shrink-0 border-t border-sidebar-border">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/my-page"
                className="flex items-center justify-center h-14 hover:bg-sidebar-accent/50 transition-colors"
              >
                <Avatar className="size-8">
                  <AvatarImage src={mockUser.avatar} alt={displayName} />
                  <AvatarFallback className="text-xs font-medium bg-muted">
                    {displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              <div className="flex items-center gap-2">
                <span>{displayName}</span>
                <TierBadge tier={mockUser.tier} size="sm" />
              </div>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Link
            href="/my-page"
            className="flex items-center gap-3 px-4 h-14 hover:bg-sidebar-accent/50 transition-colors"
          >
            <Avatar className="size-8 shrink-0">
              <AvatarImage src={mockUser.avatar} alt={displayName} />
              <AvatarFallback className="text-xs font-medium bg-muted">
                {displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-medium text-sidebar-foreground truncate">
                {displayName}
              </span>
              <TierBadge tier={mockUser.tier} size="sm" />
            </div>
          </Link>
        )}
      </div>
    </aside>
  );
}
