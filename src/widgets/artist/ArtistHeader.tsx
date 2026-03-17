"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Users } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";
import { TierBadge } from "@/entities/user";
import { getArtistGradient } from "@/shared/lib/mocks/home";
import { formatCompactNumber } from "@/shared/lib/format";
import type { Artist, Membership } from "@/shared/types";

interface ArtistHeaderProps {
  artist: Artist;
  membership?: Membership;
  isFollowing: boolean;
  onFollowToggle: () => void;
}

export function ArtistHeader({ artist, membership, isFollowing, onFollowToggle }: ArtistHeaderProps) {
  const router = useRouter();

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{ background: getArtistGradient(artist.id) }}
    >
      {artist.banner && (
        <Image
          src={artist.banner}
          alt={artist.name}
          fill
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="relative z-10 flex items-end justify-between px-8 pb-7 pt-32">
        {/* Left: Avatar + Info */}
        <div className="flex items-end gap-5">
          {artist.avatar ? (
            <Image
              src={artist.avatar}
              alt={artist.name}
              width={88}
              height={88}
              className="size-[88px] rounded-full border-[3px] border-white/30 shrink-0 object-cover"
            />
          ) : (
            <div
              className="size-[88px] rounded-full border-[3px] border-white/30 flex items-center justify-center text-2xl text-white font-bold shrink-0 backdrop-blur-sm"
              style={{ background: getArtistGradient(artist.id) }}
            >
              {artist.name.charAt(0)}
            </div>
          )}

          <div className="space-y-2 pb-1">
            <div className="flex items-center gap-3">
              <h1 className="text-[28px] font-bold text-white leading-tight">{artist.name}</h1>
              {membership?.isActive && <TierBadge tier={membership.tier} size="sm" />}
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-sm text-white/70">
                <Users size={14} />
                팔로워 {formatCompactNumber(artist.followerCount)}명
              </span>
              {artist.bio && (
                <>
                  <span className="text-white/30">·</span>
                  <span className="text-sm text-white/60 line-clamp-1 max-w-[400px]">
                    {artist.bio}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 pb-1">
          {!membership?.isActive && (
            <Button
              variant="secondary"
              size="sm"
              className="text-xs h-8 bg-white/15 text-white border-white/20 hover:bg-white/25 backdrop-blur-sm"
              onClick={() => router.push(`/membership?artistId=${artist.id}`)}
            >
              멤버십 가입
            </Button>
          )}
          <Button
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            onClick={onFollowToggle}
            className={cn(
              "gap-1.5 h-8",
              isFollowing
                ? "bg-white/15 text-white border-white/20 hover:bg-white/25 backdrop-blur-sm"
                : "bg-white text-foreground hover:bg-white/90",
            )}
          >
            <Heart size={14} className={cn(isFollowing && "fill-current text-red-400")} />
            {isFollowing ? "팔로우 중" : "팔로우"}
          </Button>
        </div>
      </div>
    </div>
  );
}
