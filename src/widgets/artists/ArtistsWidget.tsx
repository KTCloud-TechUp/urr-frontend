"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { ScrollableRow } from "@/shared/ui";
import { useArtists } from "@/features/artist";
import { useCurrentUser } from "@/features/auth/model/useCurrentUser";
import { getArtistGradient, newArtistCards } from "@/shared/lib/mocks/home";

const labelBadgeStyle: Record<string, string> = {
  "신인상 수상": "bg-white border-border text-destructive",
  "컴백 확정": "bg-white border-border text-secondary",
  "단독 콘서트": "bg-white border-border text-primary",
};

function getBadgeStyle(label: string) {
  return labelBadgeStyle[label] ?? "bg-white border-border text-foreground";
}

export function ArtistsWidget() {
  const router = useRouter();

  const { data: artists = [], isLoading } = useArtists();
  const { data: currentUser } = useCurrentUser();

  const rankingArtists = artists.slice(0, 10);
  const activeMembershipArtistIds = useMemo(
    () =>
      new Set(
        currentUser?.memberships
          .filter((membership) => new Date(membership.endDate) > new Date())
          .map((membership) => String(membership.artistId)) ?? [],
      ),
    [currentUser?.memberships],
  );

  return (
    <div className="space-y-16">
      {/* 1. 추천 아티스트 */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">추천 아티스트</h2>

        {isLoading ? (
          <div className="flex gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="shrink-0 w-31.25 space-y-2">
                <div className="w-full aspect-square rounded-lg bg-muted animate-pulse" />
                <div className="h-4 w-3/4 mx-auto bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <ScrollableRow className="flex gap-3">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                href={`/artists/${artist.id}`}
                className="group shrink-0 w-31.25"
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
                  {artist.avatar ? (
                    <Image
                      src={artist.avatar}
                      alt={artist.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center text-sm text-white font-medium"
                      style={{
                        background: getArtistGradient(String(artist.id)),
                      }}
                    >
                      {artist.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {artist.name}
                  </p>
                </div>
              </Link>
            ))}
          </ScrollableRow>
        )}

        {!isLoading && artists.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            아티스트가 없습니다.
          </div>
        )}
      </section>

      {/* 2. 주목할 만한 NEW 아티스트 */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">주목할 만한 NEW 아티스트</h2>
        <ScrollableRow className="flex gap-4">
          {newArtistCards.map((card) => (
            <div
              key={card.id}
              className="rounded-xl bg-[#F5F4F3] hover:bg-[#F0EFED] transition-colors px-5 pt-3 pb-4 flex flex-col shrink-0 w-110"
            >
              <span
                className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full border self-start mb-2",
                  getBadgeStyle(card.label),
                )}
              >
                {card.label}
              </span>
              <div className="flex gap-3">
                <div className="relative w-27.5 h-27.5 rounded-lg overflow-hidden shrink-0 bg-muted">
                  <Image
                    src={card.profileImage}
                    alt={card.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col h-27.5">
                  <h3 className="text-[15px] font-semibold line-clamp-2 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-[13px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                    {card.description}
                  </p>
                  <div className="flex gap-1.5 mt-auto">
                    <button
                      onClick={() =>
                        router.push(`/membership?artistId=${card.id}`)
                      }
                      className="px-3 py-1 rounded-full bg-foreground text-background text-[11px] font-semibold hover:bg-foreground/90 transition-colors cursor-pointer"
                    >
                      멤버십 가입
                    </button>
                    <button
                      onClick={() => router.push(`/artists/${card.id}`)}
                      className="px-3 py-1 rounded-full border border-border text-[11px] font-medium hover:bg-accent transition-colors cursor-pointer"
                    >
                      아티스트 홈
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ScrollableRow>
      </section>

      {/* 3. 팔로워 랭킹순 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">팔로워 랭킹순</h2>
          <span className="text-xs text-muted-foreground border border-border rounded-md px-3 py-1.5">
            이번 주
          </span>
        </div>

        <div className="grid grid-cols-2 grid-rows-5 grid-flow-col gap-x-8 gap-y-0">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-3 border-b border-border"
                >
                  <div className="w-5 h-3 bg-muted rounded animate-pulse" />
                  <div className="size-10 rounded-full bg-muted animate-pulse shrink-0" />
                  <div className="flex-1 h-3 bg-muted rounded animate-pulse" />
                </div>
              ))
            : rankingArtists.map((artist, index) => (
                <Link
                  key={artist.id}
                  href={`/artists/${artist.id}`}
                  className="group flex items-center gap-3 py-3 border-b border-border hover:bg-[#F3F2F0] transition-colors rounded-sm px-1 -mx-1"
                >
                  <span className="text-sm font-bold text-foreground w-5 text-center shrink-0">
                    {index + 1}
                  </span>
                  {artist.avatar ? (
                    <Image
                      src={artist.avatar}
                      alt={artist.name}
                      width={40}
                      height={40}
                      className="size-10 rounded-full shrink-0 object-cover"
                    />
                  ) : (
                    <div
                      className="size-10 rounded-full shrink-0 flex items-center justify-center text-xs text-white font-medium"
                      style={{
                        background: getArtistGradient(String(artist.id)),
                      }}
                    >
                      {artist.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {artist.name}
                    </p>
                  </div>
                  {activeMembershipArtistIds.has(String(artist.id)) ? (
                    <button
                      type="button"
                      className="shrink-0 px-3 py-1 rounded-full bg-muted text-muted-foreground text-[11px] font-semibold cursor-default"
                      disabled
                    >
                      가입중
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(`/membership?artistId=${artist.id}`);
                      }}
                      className="shrink-0 px-3 py-1 rounded-full bg-foreground text-background text-[11px] font-semibold hover:bg-foreground/90 transition-colors cursor-pointer"
                    >
                      멤버십 가입
                    </button>
                  )}
                </Link>
              ))}
        </div>
      </section>
    </div>
  );
}
