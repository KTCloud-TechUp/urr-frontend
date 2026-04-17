"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Crown } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";
import { TierBadge } from "@/entities/user";
import { formatDateCompact } from "@/shared/lib/format";
import { TIER_LABELS, TIER_IMAGES } from "@/shared/types";
import type { Artist, Membership } from "@/shared/types";

interface MembershipSectionProps {
  artist: Artist;
  membership?: Membership;
}

export function MembershipSection({ artist, membership }: MembershipSectionProps) {
  const router = useRouter();

  if (membership?.isActive) {
    return (
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
                  {formatDateCompact(membership.expiresAt)} 만료
                  <span className="mx-1.5 text-border">·</span>
                  {membership.tier === "LIGHTNING"
                    ? "최우선 예매 · 양도 수수료 5%"
                    : membership.tier === "THUNDER"
                      ? "우선 예매 · 양도 수수료 5%"
                      : "일반 예매 · 양도 수수료 10%"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              {(["LIGHTNING", "THUNDER", "CLOUD", "MIST"] as const).map((tier) => (
                <div
                  key={tier}
                  className={cn(
                    "text-center",
                    tier === membership.tier
                      ? "text-foreground font-semibold"
                      : "opacity-40",
                  )}
                >
                  <Image src={TIER_IMAGES[tier]} width={18} height={18} alt="" />
                  <p className="text-[10px] mt-0.5">{TIER_LABELS[tier]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
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
              {(["LIGHTNING", "THUNDER", "CLOUD", "MIST"] as const).map((tier) => (
                <div key={tier} className="text-center">
                  <Image src={TIER_IMAGES[tier]} width={18} height={18} alt="" />
                  <p className="text-[10px] mt-0.5">{TIER_LABELS[tier]}</p>
                </div>
              ))}
            </div>
            <Button
              size="sm"
              onClick={() => router.push(`/membership?artistId=${artist.id}`)}
            >
              멤버십 가입 — 30,000원/년
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
