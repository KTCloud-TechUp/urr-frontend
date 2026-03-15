"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button, Separator, PaymentDialog, PriceDisplay, FaceValueBadge } from "@/shared/ui";
import { formatPrice, formatDateShort } from "@/shared/lib/format";
import { addMyTicket, addMyTransferRecord } from "@/shared/lib/mocks/my-page";
import { updateTransferListingStatus } from "@/shared/lib/mocks/artist-page";
import type { Event, TransferListing, Membership } from "@/shared/types";

type EnrichedTransfer = TransferListing & { event: Event };
type PurchaseStep = "summary" | "processing" | "complete";

interface TransferPurchaseSidebarProps {
  listing: EnrichedTransfer;
  membership?: Membership;
  artistId: string;
}

export function TransferPurchaseSidebar({
  listing,
  membership,
  artistId,
}: TransferPurchaseSidebarProps) {
  const router = useRouter();
  const [step, setStep] = useState<PurchaseStep>("summary");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const isMember = membership?.isActive === true;
  const pct = Math.round((listing.price / listing.faceValue) * 100);

  const firstDate = listing.event.dates[0]?.date ?? "";
  const dateStr = firstDate ? formatDateShort(firstDate) : "";

  function handlePaymentComplete() {
    setShowPaymentDialog(false);
    setStep("processing");

    setTimeout(() => {
      updateTransferListingStatus(artistId, listing.id, "sold");

      addMyTicket({
        id: `purchased-${listing.id}`,
        eventId: listing.eventId,
        section: listing.section,
        row: listing.seatInfo.match(/(\d+)열/)?.[1] ?? "",
        seatNumber: listing.seatInfo.match(/(\d+)번/)?.[1] ?? "",
        price: listing.faceValue,
        tierFee: 0,
        qrCode: `URR-TF-${listing.id}-${Date.now()}`,
        isTransferable: true,
        isUpcoming: true,
        event: listing.event,
      });

      addMyTransferRecord({
        id: `tf-rec-${listing.id}`,
        ticketId: `purchased-${listing.id}`,
        eventId: listing.eventId,
        role: "buyer",
        counterpartyName: "",
        price: listing.price,
        faceValue: listing.faceValue,
        platformFee: 0,
        section: listing.section,
        seatInfo: listing.seatInfo,
        status: "completed",
        createdAt: new Date().toISOString(),
        event: listing.event,
      });

      setStep("complete");
    }, 1500);
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Summary */}
      {step === "summary" && (
        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-semibold text-sm line-clamp-1">{listing.event.title}</h4>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
              <Calendar size={12} />
              <span>{dateStr}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {listing.section} · {listing.seatInfo}
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">양도 가격</span>
              <PriceDisplay amount={listing.price} size="lg" />
            </div>
            <div className="flex items-center gap-2">
              <FaceValueBadge percentage={pct} />
              <span className="text-xs text-muted-foreground">
                정가: {formatPrice(listing.faceValue)}
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">총 결제 금액</span>
            <span className="text-xl font-bold tabular-nums">{formatPrice(listing.price)}</span>
          </div>

          {isMember ? (
            <Button className="w-full h-12" onClick={() => setShowPaymentDialog(true)}>
              <CreditCard size={16} />
              결제하기
            </Button>
          ) : (
            <div className="space-y-3">
              <Button className="w-full h-12" disabled>
                결제하기
              </Button>
              <div className="flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-2.5">
                <span className="text-warning text-sm">⚠️</span>
                <p className="text-xs text-warning font-medium">
                  이 아티스트의 멤버십 가입이 필요합니다
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/artists/${artistId}`)}
              >
                멤버십 가입하기
              </Button>
            </div>
          )}

          <div className="flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2.5">
            <ShieldCheck size={14} className="text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              결제 금액은 양도 완료까지 에스크로에 안전하게 보관됩니다.
            </p>
          </div>
        </div>
      )}

      <PaymentDialog
        open={showPaymentDialog}
        title="양도 티켓 결제"
        orderDescription={`${listing.event.title} — ${listing.section} · ${listing.seatInfo}`}
        orderItems={[{ label: "양도 가격", amount: listing.price }]}
        totalAmount={listing.price}
        onComplete={handlePaymentComplete}
        onCancel={() => setShowPaymentDialog(false)}
      />

      {/* Processing */}
      {step === "processing" && (
        <div className="flex flex-col items-center gap-4 py-12 px-6 text-center">
          <Loader2 size={36} className="animate-spin text-primary" />
          <div className="space-y-1">
            <p className="text-base font-semibold">양도 처리 중...</p>
            <p className="text-sm text-muted-foreground">
              티켓 소유권을 이전하고 있습니다...
            </p>
          </div>
        </div>
      )}

      {/* Complete */}
      {step === "complete" && (
        <div className="flex flex-col items-center gap-4 py-8 px-6 text-center">
          <div className="size-14 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle2 size={28} className="text-success" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold">양도가 완료되었습니다!</p>
            <p className="text-sm text-muted-foreground">
              새로운 QR 티켓이 발급되었습니다.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-3 w-full text-left">
            <p className="text-sm font-semibold line-clamp-1">{listing.event.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {listing.section} · {listing.seatInfo}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full mt-2">
            <Button onClick={() => router.push("/my-page?tab=wallet")}>
              티켓 월렛에서 보기
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push(`/artists/${artistId}?tab=transfers`)}
            >
              양도 마켓으로 돌아가기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
