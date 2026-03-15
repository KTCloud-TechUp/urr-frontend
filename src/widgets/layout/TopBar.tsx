"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui";
import { getArtistById } from "@/shared/lib/mocks/artists";
import { useNotifications } from "@/features/notification";

interface BreadcrumbItem {
  label: string;
  href: string;
}

function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return [];

  const crumbs: BreadcrumbItem[] = [];

  if (segments[0] === "events") {
    crumbs.push({ label: "공연", href: "/events" });
    if (segments[1]) {
      crumbs.push({ label: "예매", href: `/events/${segments[1]}` });
    }
  } else if (segments[0] === "artists") {
    crumbs.push({ label: "아티스트", href: "/artists" });
    if (segments[1]) {
      const artist = getArtistById(segments[1]);
      crumbs.push({
        label: artist?.name ?? segments[1],
        href: `/artists/${segments[1]}`,
      });
      if (segments[2] === "community") {
        crumbs.push({ label: "소통", href: `/artists/${segments[1]}/community` });
      } else if (segments[2] === "events") {
        crumbs.push({ label: "공연", href: `/artists/${segments[1]}/events` });
      } else if (segments[2] === "transfers") {
        crumbs.push({ label: "양도", href: `/artists/${segments[1]}/transfers` });
      }
    }
  } else if (segments[0] === "my-page") {
    crumbs.push({ label: "마이페이지", href: "/my-page" });
    if (segments[1] === "wallet") {
      crumbs.push({ label: "티켓 월렛", href: "/my-page/wallet" });
    } else if (segments[1] === "transfers") {
      crumbs.push({ label: "양도 내역", href: "/my-page/transfers" });
    } else if (segments[1] === "settings") {
      crumbs.push({ label: "설정", href: "/my-page/settings" });
    }
  } else if (segments[0] === "membership") {
    crumbs.push({ label: "멤버십", href: "/membership" });
  } else if (segments[0] === "notifications") {
    crumbs.push({ label: "알림", href: "/notifications" });
  }

  return crumbs;
}

export function TopBar() {
  const crumbs = useBreadcrumbs();
  const { unreadCount } = useNotifications();

  return (
    <header className="h-14 shrink-0 border-b border-border bg-background flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm min-w-0">
        {crumbs.length > 0 ? (
          crumbs.map((crumb, index) => (
            <Fragment key={crumb.href}>
              {index > 0 && (
                <ChevronRight size={14} className="text-muted-foreground shrink-0" />
              )}
              {index === crumbs.length - 1 ? (
                <span className="font-medium text-foreground truncate">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-muted-foreground hover:text-foreground transition-colors truncate"
                >
                  {crumb.label}
                </Link>
              )}
            </Fragment>
          ))
        ) : (
          <span className="font-medium text-foreground">홈</span>
        )}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="icon" asChild className="size-9">
          <Link href="/search">
            <Search size={18} />
          </Link>
        </Button>

        <Button variant="ghost" size="icon" asChild className="size-9 relative">
          <Link href="/notifications">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 size-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-medium flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
        </Button>
      </div>
    </header>
  );
}
