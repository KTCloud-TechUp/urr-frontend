"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  ChevronRight,
  Crown,
  Ticket,
  ShoppingBag,
  MessageCircle,
  Mic2,
  Lock,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";
import { BookingStatusBadge } from "@/entities/event";
import { TransferCard } from "@/entities/transfer";
import { PostCard } from "@/entities/community";
import { TierBadge } from "@/entities/user";
import { getArtistGradient } from "@/shared/lib/mocks/home";
import { formatDateFull, formatDateShort } from "@/shared/lib/format";
import { TIER_LABELS, TIER_EMOJIS } from "@/shared/types";
import type {
  Artist,
  Event,
  Membership,
  TransferListing,
  CommunityPost,
} from "@/shared/types";
import type { ArtistExtendedInfo } from "@/shared/lib/mocks/artist-page";

type EnrichedTransfer = TransferListing & { event: Event };

interface ArtistHomeTabProps {
  artist: Artist;
  extendedInfo?: ArtistExtendedInfo;
  nextEvent?: Event;
  upcomingEvents: Event[];
  transferListings: EnrichedTransfer[];
  communityPosts: CommunityPost[];
  membership?: Membership;
  onNavigateTab: (tab: string) => void;
}

export function ArtistHomeTab({
  artist,
  extendedInfo,
  nextEvent,
  upcomingEvents,
  transferListings,
  communityPosts,
  membership,
  onNavigateTab,
}: ArtistHomeTabProps) {
  const router = useRouter();
  const listedTransfers = transferListings.filter((t) => t.status === "listed");
  const firstDate = nextEvent?.dates[0]?.date ?? "";
  const dateStr = firstDate ? formatDateFull(firstDate) : "";

  return (
    <div className="space-y-12">
      {/* ===== 1. Membership Section ===== */}
      {membership?.isActive ? (
        <section>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Crown size={20} className="text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold">
                      {TIER_LABELS[membership.tier]} 멤버십
                    </span>
                    <TierBadge tier={membership.tier} size="sm" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(membership.expiresAt).toLocaleDateString(
                      "ko-KR",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}{" "}
                    만료
                    <span className="mx-1.5 text-border">·</span>
                    {membership.tier === "lightning"
                      ? "최우선 예매 · 양도 수수료 5%"
                      : membership.tier === "thunder"
                        ? "우선 예매 · 양도 수수료 5%"
                        : membership.tier === "cloud"
                          ? "일반 예매 · 양도 수수료 10%"
                          : "일반 예매 · 양도 수수료 10%"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                {(["lightning", "thunder", "cloud", "mist"] as const).map(
                  (tier) => (
                    <div
                      key={tier}
                      className={cn(
                        "text-center",
                        tier === membership.tier
                          ? "text-foreground font-semibold"
                          : "opacity-40",
                      )}
                    >
                      <span className="text-base">{TIER_EMOJIS[tier]}</span>
                      <p className="text-[10px] mt-0.5">{TIER_LABELS[tier]}</p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section>
          <div className="rounded-xl border border-dashed border-primary/30 bg-primary/3 p-6">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="size-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Crown size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">
                    {artist.name} 멤버십에 가입하세요
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    선예매 우선권, 양도 마켓, 전용 굿즈 등 다양한 혜택
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="hidden lg:flex items-center gap-4 text-xs text-muted-foreground">
                  {(["lightning", "thunder", "cloud", "mist"] as const).map(
                    (tier) => (
                      <div key={tier} className="text-center">
                        <span className="text-base">{TIER_EMOJIS[tier]}</span>
                        <p className="text-[10px] mt-0.5">
                          {TIER_LABELS[tier]}
                        </p>
                      </div>
                    ),
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() =>
                    router.push(`/membership?artistId=${artist.id}`)
                  }
                >
                  멤버십 가입 — 30,000원/년
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== 2. 아티스트 소개 ===== */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Mic2 size={20} className="text-muted-foreground" />
          아티스트 소개
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {artist.bio}
        </p>
        {extendedInfo && (
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-xs text-muted-foreground">데뷔</span>
              <p className="font-medium mt-0.5">{extendedInfo.debutDate}</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <span className="text-xs text-muted-foreground">소속사</span>
              <p className="font-medium mt-0.5">{extendedInfo.agency}</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <span className="text-xs text-muted-foreground">장르</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {extendedInfo.genres.map((genre) => (
                  <span
                    key={genre}
                    className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ===== 3. 소통 프리뷰 ===== */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageCircle size={20} className="text-muted-foreground" />
            소통
          </h2>
          {membership?.isActive && communityPosts.length > 0 && (
            <button
              onClick={() => onNavigateTab("community")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5 cursor-pointer"
            >
              전체 보기
              <ChevronRight size={14} />
            </button>
          )}
        </div>
        {membership?.isActive ? (
          communityPosts.length > 0 ? (
            <div className="space-y-3">
              {[...communityPosts]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )
                .slice(0, 2)
                .map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    variant="compact"
                    artistGradient={getArtistGradient(artist.id)}
                  />
                ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                아직 소통 게시글이 없습니다
              </p>
            </div>
          )
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center space-y-3">
            <Lock size={24} className="mx-auto text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              멤버십 회원만 소통 콘텐츠를 이용할 수 있습니다
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/membership?artistId=${artist.id}`)}
            >
              멤버십 가입하기
            </Button>
          </div>
        )}
      </section>

      {/* ===== 4. 공연 ===== */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Ticket size={20} className="text-muted-foreground" />
            공연
          </h2>
          {upcomingEvents.length > 0 && (
            <button
              onClick={() => onNavigateTab("events")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5 cursor-pointer"
            >
              전체 보기
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {nextEvent ? (
          <div className="space-y-3">
            {/* Featured next event */}
            <Link
              href={`/events/${nextEvent.id}`}
              className="group block rounded-xl overflow-hidden border border-border bg-card hover:border-primary/20 transition-all"
            >
              <div className="flex">
                <div
                  className="w-[160px] shrink-0 relative overflow-hidden"
                  style={{ background: getArtistGradient(artist.id) }}
                >
                  {nextEvent.poster ? (
                    <Image
                      src={nextEvent.poster}
                      alt={nextEvent.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-white">
                        {nextEvent.title.split(" ")[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 p-5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors">
                        {nextEvent.title}
                      </h3>
                      <BookingStatusBadge status={nextEvent.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {dateStr}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        {nextEvent.venue}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button size="sm">예매하기</Button>
                  </div>
                </div>
              </div>
            </Link>

            {/* Additional upcoming events (compact list) */}
            {upcomingEvents.length > 1 && (
              <div className="rounded-lg border border-border overflow-hidden">
                {upcomingEvents.slice(1, 4).map((event, idx) => {
                  const evDate = event.dates[0]?.date ?? "";
                  const evDateStr = evDate ? formatDateShort(evDate) : "";
                  return (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className={cn(
                        "group flex items-center gap-3 px-4 py-3 hover:bg-accent/30 transition-colors",
                        idx > 0 && "border-t border-border",
                      )}
                    >
                      <div
                        className="size-9 rounded-lg shrink-0 overflow-hidden relative"
                        style={{ background: getArtistGradient(artist.id) }}
                      >
                        {event.poster ? (
                          <Image
                            src={event.poster}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-medium">
                            {event.title.split(" ")[0]?.slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {event.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {evDateStr} · {event.venue}
                        </p>
                      </div>
                      <BookingStatusBadge status={event.status} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-10 text-center">
            <Calendar
              size={32}
              className="mx-auto text-muted-foreground/30 mb-3"
            />
            <p className="text-sm text-muted-foreground">
              예정된 공연이 없습니다
            </p>
          </div>
        )}
      </section>

      {/* ===== 5. 양도 마켓 ===== */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag size={20} className="text-muted-foreground" />
            양도 마켓
          </h2>
          {membership?.isActive && listedTransfers.length > 0 && (
            <button
              onClick={() => onNavigateTab("transfers")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5 cursor-pointer"
            >
              {listedTransfers.length}건 전체 보기
              <ChevronRight size={14} />
            </button>
          )}
        </div>
        {membership?.isActive ? (
          listedTransfers.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {listedTransfers.slice(0, 3).map((listing) => (
                <TransferCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                현재 양도 가능한 티켓이 없습니다
              </p>
            </div>
          )
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center space-y-3">
            <Lock size={24} className="mx-auto text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              멤버십 회원만 양도 마켓을 이용할 수 있습니다
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/membership?artistId=${artist.id}`)}
            >
              멤버십 가입하기
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
