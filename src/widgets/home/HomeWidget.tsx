"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { Button, SectionHeader } from "@/shared/ui";
import { ArtistCard } from "@/entities/artist";
import { EventTagBadge, BOOKING_STATUS_LABELS } from "@/entities/event";
import { formatCompactNumber } from "@/shared/lib/format";
import { SKELETON_LOAD_DELAY } from "@/shared/lib/constants";
import {
  homeBannerEvents,
  homePopularArtists,
  homeTodayTicketing,
  homeRankingEvents,
  homePreSaleEvents,
  getArtistGradient,
} from "@/shared/lib/mocks/home";
import { mockUser } from "@/shared/lib/mocks/user";
import { HeroBannerCarousel } from "./HeroBannerCarousel";
import { HomePageSkeleton } from "./HomePageSkeleton";

export function HomeWidget() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), SKELETON_LOAD_DELAY);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <HomePageSkeleton />;

  const hasFollowedArtists = mockUser.followedArtistIds.length > 0;

  return (
    <div className="space-y-14">
      {/* ===== 1. 히어로 배너 캐러셀 ===== */}
      <HeroBannerCarousel banners={homeBannerEvents} />

      {/* 팔로우 아티스트 없을 때 CTA */}
      {!hasFollowedArtists && (
        <div className="rounded-xl border border-dashed border-border bg-accent/30 p-8 flex flex-col items-center gap-3 text-center">
          <p className="text-muted-foreground">
            아티스트를 팔로우하고 맞춤 공연 정보를 받아보세요
          </p>
          <Button asChild>
            <Link href="/artists">아티스트 찾기</Link>
          </Button>
        </div>
      )}

      {/* ===== 2. 인기 아티스트 ===== */}
      <section className="space-y-4">
        <SectionHeader title="인기 아티스트" linkHref="/artists" linkLabel="아티스트 더보기" />
        <div className="grid grid-cols-10 gap-2">
          {homePopularArtists.map((artist) => (
            <Link key={artist.id} href={`/artists/${artist.id}`}>
              <ArtistCard
                artist={artist}
                selected={false}
                className="w-full border-0 bg-transparent p-2 hover:bg-[#F3F2F0]"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 3. 지금 뜨는 공연 ===== */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">지금 뜨는 공연</h2>
        <div className="grid grid-cols-6 gap-3">
          {homeTodayTicketing.map((event, index) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="group min-w-0"
            >
              {/* 포스터 + 순위 */}
              <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden">
                {event.poster ? (
                  <Image
                    src={event.poster}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ background: getArtistGradient(event.artistId) }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span
                  className="absolute bottom-2 left-3 text-4xl font-black text-white/90"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                >
                  {index + 1}
                </span>
              </div>
              {/* 정보 */}
              <div className="mt-2.5 space-y-1.5">
                <p className="text-sm font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {event.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">{event.venue}</p>
                <p className="text-xs text-muted-foreground">{event.dateRange}</p>
                {event.tags && event.tags.length > 0 && (
                  <div className="flex gap-1 pt-0.5 flex-wrap">
                    {event.tags.map((tag) => (
                      <EventTagBadge key={tag} tag={tag} />
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 4. 인기 공연 랭킹 ===== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">인기 공연 랭킹</h2>
          <span className="text-xs text-muted-foreground">이번 주</span>
        </div>
        <div className="grid grid-cols-2 grid-rows-4 grid-flow-col gap-x-8 gap-y-0">
          {homeRankingEvents.map((event, index) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="group flex items-center gap-3 py-3 border-b border-border hover:bg-[#F3F2F0] transition-colors rounded-sm px-1 -mx-1"
            >
              <span className="text-sm font-bold text-foreground w-5 text-center shrink-0">
                {index + 1}
              </span>
              {event.profileImage ? (
                <Image
                  src={event.profileImage}
                  alt={event.artistName}
                  width={40}
                  height={40}
                  className="size-10 rounded-full shrink-0 object-cover"
                />
              ) : (
                <div
                  className="size-10 rounded-full shrink-0 flex items-center justify-center text-xs text-white font-medium"
                  style={{ background: getArtistGradient(event.artistId) }}
                >
                  {event.artistName.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                  {event.title}
                </p>
                <p className="text-xs text-muted-foreground">{event.artistName}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground tabular-nums">
                  조 {formatCompactNumber(event.viewCount)}
                </span>
                <span
                  className={cn(
                    "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                    event.status === "open" && "bg-booking-open/10 text-booking-open",
                    event.status === "upcoming" && "bg-booking-upcoming/10 text-booking-upcoming",
                    (event.status === "soldout" || event.status === "closed") &&
                      "bg-muted text-muted-foreground",
                  )}
                >
                  {BOOKING_STATUS_LABELS[event.status]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 5. 선예매 오픈 임박 ===== */}
      <section className="space-y-4">
        <SectionHeader title="선예매 오픈 임박" linkHref="/events" linkLabel="공연 더보기" />
        <div className="grid grid-cols-3 gap-4">
          {homePreSaleEvents.map((event) => (
            <Link
              key={`${event.id}-${event.openDateTime}`}
              href={`/events/${event.id}`}
              className="group flex gap-3 p-3 rounded-lg border border-border hover:bg-[#F3F2F0] transition-colors bg-card"
            >
              {event.poster ? (
                <div className="relative w-[80px] h-[100px] rounded-md shrink-0 overflow-hidden">
                  <Image
                    src={event.poster}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className="w-[80px] h-[100px] rounded-md shrink-0 flex items-center justify-center text-white text-xs font-medium"
                  style={{ background: getArtistGradient(event.artistId) }}
                >
                  {event.title.split(" ")[0]}
                </div>
              )}
              <div className="flex-1 min-w-0 flex flex-col py-0.5">
                <div>
                  <p className="text-xs font-semibold text-foreground">{event.openDateTime}</p>
                  <p className="text-sm font-semibold line-clamp-2 leading-tight mt-0.5 group-hover:text-primary transition-colors">
                    {event.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{event.ticketType}</p>
                </div>
                {event.tags.length > 0 && (
                  <div className="flex gap-1 mt-auto flex-wrap">
                    {event.tags.map((tag) => (
                      <EventTagBadge key={tag} tag={tag} />
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
