"use client";

import { ArrowLeft, Crown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { TierBadge } from "@/entities/user";
import { cn } from "@/shared/lib/utils";
import type { Artist, TierLevel } from "@/shared/types";
import { getMembershipPolicies } from "../api/getMembershipPolicies";

interface MembershipIntroStepProps {
  artist: Artist;
  onBack: () => void;
  onSubscribe: () => void;
}

const TIER_ORDER: TierLevel[] = ["LIGHTNING", "THUNDER", "CLOUD", "MIST"];

function formatTimeLabel(minutes: number): string {
  if (minutes === 0) return "최우선 오픈";
  if (minutes < 60) return `${minutes}분 먼저`;
  if (minutes % (60 * 24) === 0) return `${minutes / (60 * 24)}일 먼저`;
  if (minutes % 60 === 0) return `${minutes / 60}시간 먼저`;
  return `${minutes}분 먼저`;
}

export function MembershipIntroStep({
  artist,
  onBack,
  onSubscribe,
}: MembershipIntroStepProps) {
  const { data: policies } = useQuery({
    queryKey: ["membershipPolicies", artist.id],
    queryFn: () => getMembershipPolicies(artist.id),
  });

  const policyMap = Object.fromEntries(
    (policies ?? []).map((p) => [p.tier, p]),
  ) as Partial<
    Record<
      TierLevel,
      import("../api/getMembershipPolicies").MembershipTierPolicy
    >
  >;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          돌아가기
        </button>
        <div className="flex items-center gap-4">
          <Avatar className="size-14 shrink-0">
            <AvatarImage src={artist.avatar} alt={artist.name} />
            <AvatarFallback className="text-lg font-bold bg-muted">
              {artist.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{artist.name} 멤버십</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              멤버십 혜택을 확인하고 가입하세요
            </p>
          </div>
        </div>
      </div>

      {/* Benefits intro */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Crown size={18} className="text-primary" />
          <h2 className="text-lg font-bold">멤버십 혜택</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {artist.name} 멤버십에 가입하면 선예매 우선권, 양도 마켓 이용, 전용
          굿즈 구매 등 다양한 혜택을 누릴 수 있습니다. 가입 시 클라우드 등급으로
          시작하며, 멜론 연동을 통해 더 높은 등급을 받을 수 있습니다.
        </p>
      </div>

      {/* Tier comparison table */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold">티어별 혜택 비교</h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold">티어</th>
                <th className="text-left px-4 py-3 font-semibold">우선순위</th>
                <th className="text-left px-4 py-3 font-semibold">
                  예매 수수료
                </th>
                <th className="text-left px-4 py-3 font-semibold">
                  양도 수수료
                </th>
              </tr>
            </thead>
            <tbody>
              {TIER_ORDER.map((tier, idx) => {
                const policy = policyMap[tier];
                const isPresale = policy?.bookingType === "PRESALE";
                return (
                  <tr
                    key={tier}
                    className={cn(idx > 0 && "border-t border-border")}
                  >
                    <td className="px-4 py-3">
                      <TierBadge tier={tier} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      {!policy ? (
                        <span className="text-muted-foreground">—</span>
                      ) : isPresale ? (
                        <span className="text-sm text-muted-foreground">
                          {formatTimeLabel(policy.presaleOffsetMinutes)}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          일반예매
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {policy
                        ? `${policy.bookingFeeWon.toLocaleString()}원`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {policy
                        ? policy.transferFeeRate != null
                          ? `${policy.transferFeeRate}%`
                          : "불가"
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Price + CTA */}
      <div className="rounded-xl border border-primary/20 bg-primary/3 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">멤버십 가격</p>
            <p className="text-2xl font-bold mt-0.5">
              30,000원
              <span className="text-sm font-normal text-muted-foreground">
                /년
              </span>
            </p>
          </div>
          <Button size="lg" className="gap-2" onClick={onSubscribe}>
            <Crown size={16} />
            가입하기
          </Button>
        </div>
      </div>
    </div>
  );
}
