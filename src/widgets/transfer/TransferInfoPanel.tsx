"use client";

import { useState } from "react";
import {
  Calendar,
  MapPin,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  Clock,
  Armchair,
  Info,
  ChevronRight,
  User,
} from "lucide-react";
import { StaticVenuePreview, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui";
import { TierBadge } from "@/entities/user";
import { formatPrice, formatDateFull, formatDateWithTime } from "@/shared/lib/format";
import { getSellerProfile } from "@/shared/lib/mocks/artist-page";
import type { Event, TransferListing, TierLevel } from "@/shared/types";

type EnrichedTransfer = TransferListing & { event: Event };

function sectionNameToId(section: string): string | null {
  if (section.includes("VIP")) return "sec-vip";
  if (section.includes("플로어") && section.includes("R")) return "sec-floor-r";
  if (section.includes("R")) return "sec-r";
  if (section.includes("S")) return "sec-s";
  if (section.includes("A")) return "sec-a";
  return null;
}

function getSectionDescription(section: string): string {
  if (section.includes("VIP")) return "무대 최근접 프리미엄 좌석";
  if (section.includes("플로어") && section.includes("R")) return "플로어 스탠딩 구역";
  if (section.includes("R")) return "무대 정면 중앙 구역";
  if (section.includes("S")) return "중간 거리 관람 구역";
  if (section.includes("A")) return "후방 관람 구역";
  return "";
}

function getSellerReliability(tier: TierLevel): { label: string; className: string } {
  switch (tier) {
    case "lightning":
      return { label: "최고 신뢰 판매자", className: "text-tier-lightning" };
    case "thunder":
      return { label: "우수 판매자", className: "text-tier-thunder" };
    case "cloud":
      return { label: "일반 판매자", className: "text-tier-cloud" };
    default:
      return { label: "신규 판매자", className: "text-tier-mist" };
  }
}

interface TransferInfoPanelProps {
  listing: EnrichedTransfer;
}

export function TransferInfoPanel({ listing }: TransferInfoPanelProps) {
  const [showProfile, setShowProfile] = useState(false);

  const highlightSection = sectionNameToId(listing.section);
  const sectionDesc = getSectionDescription(listing.section);
  const reliability = getSellerReliability(listing.sellerTier);
  const seller = getSellerProfile(listing.sellerId);

  const firstDate = listing.event.dates[0]?.date ?? "";
  const dateStr = firstDate ? formatDateFull(firstDate) : "";
  const registeredStr = formatDateWithTime(listing.createdAt);

  const rowMatch = listing.seatInfo.match(/(\d+)열/);
  const seatMatch = listing.seatInfo.match(/(\d+)번/);
  const zoneMatch = listing.seatInfo.match(/([A-Z])구역/);

  return (
    <div className="space-y-6">
      {/* Section 1: Event Details */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <Info size={18} className="text-primary" />
          공연 정보
        </h3>
        <h2 className="text-xl font-bold mb-3">{listing.event.title}</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={15} className="shrink-0" />
            <span>{dateStr}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={15} className="shrink-0" />
            <span>{listing.event.venue}</span>
          </div>
        </div>
      </div>

      {/* Section 2: Venue Map */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <Armchair size={18} className="text-primary" />
          좌석 위치
        </h3>
        <div className="flex justify-center">
          <StaticVenuePreview
            highlightSectionId={highlightSection}
            className="w-full max-w-[480px]"
          />
        </div>
        <div className="mt-4 text-center">
          <p className="text-lg font-bold">{listing.section}</p>
          <p className="text-sm text-muted-foreground">{listing.seatInfo}</p>
        </div>
      </div>

      {/* Section 3: Seat Details */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <Armchair size={18} className="text-primary" />
          좌석 상세
        </h3>
        <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
          <div>
            <span className="text-muted-foreground">구역</span>
            <p className="font-semibold mt-0.5">{listing.section}</p>
          </div>
          {zoneMatch && (
            <div>
              <span className="text-muted-foreground">블록</span>
              <p className="font-semibold mt-0.5">{zoneMatch[1]}구역</p>
            </div>
          )}
          {rowMatch && (
            <div>
              <span className="text-muted-foreground">열</span>
              <p className="font-semibold mt-0.5">{rowMatch[1]}열</p>
            </div>
          )}
          {seatMatch && (
            <div>
              <span className="text-muted-foreground">좌석 번호</span>
              <p className="font-semibold mt-0.5">{seatMatch[1]}번</p>
            </div>
          )}
          <div>
            <span className="text-muted-foreground">정가</span>
            <p className="font-semibold mt-0.5">{formatPrice(listing.faceValue)}</p>
          </div>
          {sectionDesc && (
            <div>
              <span className="text-muted-foreground">구역 설명</span>
              <p className="font-semibold mt-0.5">{sectionDesc}</p>
            </div>
          )}
        </div>
      </div>

      {/* Section 4: Seller Info */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <UserCheck size={18} className="text-primary" />
          판매자 정보
        </h3>
        <div className="space-y-4">
          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-3 w-full rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors text-left cursor-pointer"
          >
            <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              <User size={18} className="text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{seller.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <TierBadge tier={listing.sellerTier} size="sm" />
                <span className={`text-xs font-medium ${reliability.className}`}>
                  {reliability.label}
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-muted-foreground shrink-0" />
          </button>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>거래 {listing.sellerTransactionCount}회 완료</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock size={12} />
            <span>등록일: {registeredStr}</span>
          </div>
        </div>
      </div>

      {/* Seller Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>판매자 프로필</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                <User size={28} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-bold">{seller.name}</p>
                {seller.bio && (
                  <p className="text-sm text-muted-foreground mt-0.5">{seller.bio}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <TierBadge tier={listing.sellerTier} size="default" />
              <div>
                <span className={`text-sm font-semibold ${reliability.className}`}>
                  {reliability.label}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  거래 {listing.sellerTransactionCount}회 완료
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-border p-3 text-center">
                <p className="text-lg font-bold">{listing.sellerTransactionCount}</p>
                <p className="text-xs text-muted-foreground">총 거래</p>
              </div>
              <div className="rounded-lg border border-border p-3 text-center">
                <p className="text-lg font-bold">100%</p>
                <p className="text-xs text-muted-foreground">완료율</p>
              </div>
              <div className="rounded-lg border border-border p-3 text-center">
                <p className="text-lg font-bold">0</p>
                <p className="text-xs text-muted-foreground">신고</p>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/20 p-3">
              <ShieldCheck size={14} className="text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                URR은 모든 거래를 에스크로로 보호합니다.
                판매자의 거래 이력은 플랫폼에서 검증된 실제 데이터입니다.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Section 5: Escrow / Safety */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <ShieldCheck size={18} className="text-primary" />
          URR 안전거래
        </h3>
        <div className="flex items-center gap-2 mb-4">
          {["결제", "에스크로 보관", "티켓 이전", "판매자 정산"].map((step, i) => (
            <span key={step} className="contents">
              <span className="flex items-center gap-1.5">
                <span className="size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-xs font-medium">{step}</span>
              </span>
              {i < 3 && <ArrowRight size={12} className="text-muted-foreground shrink-0" />}
            </span>
          ))}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          결제 금액은 양도가 완료될 때까지 URR 에스크로에 안전하게 보관됩니다.
          티켓 소유권 이전이 확인된 후에야 판매자에게 정산됩니다.
        </p>
      </div>

      {/* Section 6: Transfer Policy */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-base font-semibold mb-3">양도 정책</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="size-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
            양도 가격은 정가의 50% ~ 150% 범위 내에서 설정됩니다.
          </li>
          <li className="flex items-start gap-2">
            <span className="size-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
            구매 확정 후에는 취소가 불가능합니다.
          </li>
          <li className="flex items-start gap-2">
            <span className="size-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
            양도 완료 시 새로운 QR 티켓이 발급되며, 기존 티켓은 무효화됩니다.
          </li>
          <li className="flex items-start gap-2">
            <span className="size-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
            멤버십 회원만 양도 마켓을 이용할 수 있습니다.
          </li>
        </ul>
      </div>
    </div>
  );
}
