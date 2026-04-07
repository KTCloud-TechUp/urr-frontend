"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button, SectionHeader } from "@/shared/ui";
import { ArtistCard } from "@/entities/artist";
import { getArtistGradient } from "@/shared/lib/mocks/home";
import { mockUser } from "@/shared/lib/mocks/user";
import { getHome } from "@/features/home/api/getHome";
import { useArtists } from "@/features/artist";
import type { Artist } from "@/shared/types";
import type { BannerEvent } from "@/entities/event";
import { HeroBannerCarousel } from "./HeroBannerCarousel";
import { HomePageSkeleton } from "./HomePageSkeleton";

function formatDateRange(openDate: string, endDate: string | null): string {
  const open = new Date(openDate);
  const openStr = `${open.getMonth() + 1}.${open.getDate()}`;
  if (!endDate || endDate === openDate) return openStr;
  const end = new Date(endDate);
  return `${openStr} ~ ${end.getMonth() + 1}.${end.getDate()}`;
}

function deriveStatus(openDate: string, endDate: string | null): BannerEvent["status"] {
  const today = new Date().toISOString().split("T")[0];
  if (openDate > today) return "upcoming";
  if (!endDate || endDate >= today) return "open";
  return "closed";
}

export function HomeWidget() {
  const { data: homeData, isLoading: homeLoading } = useQuery({
    queryKey: ["home"],
    queryFn: getHome,
    staleTime: 5 * 60 * 1000,
  });

  const { data: artists = [] } = useArtists();

  if (homeLoading || !homeData) return <HomePageSkeleton />;

  const hasFollowedArtists = mockUser.followedArtistIds.length > 0;

  const uniqueArtistIds = new Set<number>();
  const popularArtists: Artist[] = homeData.popularArtists
    .filter((a) => {
      if (uniqueArtistIds.has(a.artistId)) return false;
      uniqueArtistIds.add(a.artistId);
      return true;
    })
    .map((a) => ({
      id: String(a.artistId),
      name: a.artistName,
      avatar: a.profileImageUrl ?? "",
      banner: "",
      bio: "",
      followerCount: a.followerCount,
      category: (a.category as Artist["category"]) ?? "solo",
    }));

  const dedupById = <T extends { eventId: number }>(items: T[]): T[] => {
    const seen = new Set<number>();
    return items.filter((e) => {
      if (seen.has(e.eventId)) return false;
      seen.add(e.eventId);
      return true;
    });
  };

  const trendingEvents = dedupById(homeData.trendingEvents);
  const popularEventRanking = dedupById(homeData.popularEventRanking);
  const presaleOpeningSoon = dedupById(homeData.presaleOpeningSoon);

  const banners: BannerEvent[] = trendingEvents.slice(0, 4).map((e) => {
    const artist = artists.find((a) => a.id === String(e.artistId));
    return {
      id: String(e.eventId),
      artistId: String(e.artistId),
      artistName: e.artistName,
      title: e.eventTitle,
      venue: e.venueAddress ?? "",
      date: e.openDate + "T19:00:00",
      status: deriveStatus(e.openDate, e.endDate),
      bannerImage: artist?.banner || undefined,
    };
  });

  return (
    <div className="space-y-14">
      {/* ===== 1. 히어로 배너 캐러셀 ===== */}
      <HeroBannerCarousel banners={banners} />

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
        <SectionHeader
          title="인기 아티스트"
          linkHref="/artists"
          linkLabel="아티스트 더보기"
        />
        <div className="grid grid-cols-10 gap-2">
          {popularArtists.map((artist) => (
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
          {trendingEvents.map((event, index) => (
            <Link
              key={event.eventId}
              href={`/events/${event.eventId}`}
              className="group min-w-0"
            >
              <div className="relative w-full aspect-4/5 rounded-lg overflow-hidden">
                {event.posterImageUrl ? (
                  <Image
                    src={event.posterImageUrl}
                    alt={event.eventTitle}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ background: getArtistGradient(String(event.artistId)) }}
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <span
                  className="absolute bottom-2 left-3 text-4xl font-black text-white/90"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                >
                  {index + 1}
                </span>
              </div>
              <div className="mt-2.5 space-y-1.5">
                <p className="text-sm font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {event.eventTitle}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {event.venueAddress ?? ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDateRange(event.openDate, event.endDate)}
                </p>
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
          {popularEventRanking.map((event) => (
            <Link
              key={event.eventId}
              href={`/events/${event.eventId}`}
              className="group flex items-center gap-3 py-3 border-b border-border hover:bg-[#F3F2F0] transition-colors rounded-sm px-1 -mx-1"
            >
              <span className="text-sm font-bold text-foreground w-5 text-center shrink-0">
                {event.rank}
              </span>
              {event.posterImageUrl ? (
                <Image
                  src={event.posterImageUrl}
                  alt={event.artistName}
                  width={40}
                  height={40}
                  className="size-10 rounded-full shrink-0 object-cover"
                />
              ) : (
                <div
                  className="size-10 rounded-full shrink-0 flex items-center justify-center text-xs text-white font-medium"
                  style={{ background: getArtistGradient(String(event.artistId)) }}
                >
                  {event.artistName.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                  {event.eventTitle}
                </p>
                <p className="text-xs text-muted-foreground">
                  {event.artistName}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 5. 선예매 오픈 임박 ===== */}
      {presaleOpeningSoon.length > 0 && (
        <section className="space-y-4">
          <SectionHeader
            title="선예매 오픈 임박"
            linkHref="/events"
            linkLabel="공연 더보기"
          />
          <div className="grid grid-cols-3 gap-4">
            {presaleOpeningSoon.map((event) => (
              <Link
                key={event.eventId}
                href={`/events/${event.eventId}`}
                className="group flex gap-3 p-3 rounded-lg border border-border hover:bg-[#F3F2F0] transition-colors bg-card"
              >
                {event.posterImageUrl ? (
                  <div className="relative w-20 h-25 rounded-md shrink-0 overflow-hidden">
                    <Image
                      src={event.posterImageUrl}
                      alt={event.eventTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="w-20 h-25 rounded-md shrink-0 flex items-center justify-center text-white text-xs font-medium"
                    style={{ background: getArtistGradient(String(event.artistId)) }}
                  >
                    {event.eventTitle.split(" ")[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0 flex flex-col py-0.5">
                  <p className="text-xs font-semibold text-foreground">
                    {formatDateRange(event.openDate, event.endDate)}
                  </p>
                  <p className="text-sm font-semibold line-clamp-2 leading-tight mt-0.5 group-hover:text-primary transition-colors">
                    {event.eventTitle}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">선예매</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
