"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Calendar, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { createTransferPost } from "@/features/transfer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { formatPrice, formatDateFull } from "@/shared/lib/format";
import type { Ticket, Event, TierLevel } from "@/shared/types";

interface TransferListingModalProps {
  ticket: (Ticket & { event: Event }) | null;
  userTier: TierLevel;
  userId?: number | string;
  open: boolean;
  onClose: () => void;
  onListed: (ticketId: string, price: number) => void;
}

type Step = "confirm" | "success";

export function TransferListingModal({
  ticket,
  userTier,
  userId,
  open,
  onClose,
  onListed,
}: TransferListingModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("confirm");

  const createMutation = useMutation({
    mutationFn: () =>
      createTransferPost(
        userId!,
        ticket!.event.artistId,
        ticket!.eventId,
        ticket!.showId ?? ticket!.event.dates[0]?.id ?? "0",
        ticket!.id,
      ),
    onSuccess: () => {
      onListed(ticket!.id, transferPrice);
      setStep("success");
    },
  });

  // Reset state when ticket changes or modal opens
  useEffect(() => {
    if (open && ticket) {
      const t = setTimeout(() => {
        setStep("confirm");
      }, 0);
      return () => clearTimeout(t);
    }
  }, [open, ticket]);

  if (!ticket) return null;

  const faceValue = ticket.price;
  const bookingFee =
    ticket.event.dates[0]?.bookingWindows.find((w) => w.tier === userTier)
      ?.fee ??
    ticket.tierFee ??
    0;
  const transferPrice = faceValue + bookingFee;
  const payout = transferPrice;

  // Date formatting
  const firstDate = ticket.event.dates[0]?.date ?? "";
  const dateStr = firstDate ? formatDateFull(firstDate) : "";

  function handleSubmit() {
    if (!userId) return;
    createMutation.mutate();
  }

  function handleViewListing() {
    onClose();
    router.push(`/artists/${ticket!.event.artistId}`);
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {step === "success" ? "양도 등록 완료" : "양도 등록"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            양도 등록 정보를 확인한 뒤 등록을 진행해주세요.
          </DialogDescription>
        </DialogHeader>

        {step === "confirm" && (
          <div className="space-y-5 py-2">
            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
              <h4 className="font-semibold text-sm line-clamp-1">
                {ticket.event.title}
              </h4>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar size={12} />
                <span>{dateStr}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin size={12} />
                <span>{ticket.event.venue}</span>
              </div>
              <p className="text-sm font-medium">
                {ticket.section} {ticket.row}열 {ticket.seatNumber}번
              </p>
              <p className="text-sm text-muted-foreground">
                정가: {formatPrice(faceValue)}
              </p>
              <p className="text-sm text-muted-foreground">
                최초 예매 수수료: {formatPrice(bookingFee)}
              </p>
              <p className="text-xs text-muted-foreground">
                이 티켓은 정가 + 최초 예매 수수료로 양도 판매가가 자동
                설정됩니다.
              </p>
              <p className="text-xs text-muted-foreground">
                회원 등급({userTier})에 따라 양도 서비스 이용료는 구매자가
                부담합니다.
              </p>
            </div>

            <div className="space-y-3 rounded-lg border border-border p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">양도 판매가</span>
                <span className="font-semibold tabular-nums">
                  {formatPrice(transferPrice)}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="text-sm font-semibold">판매자 실수령액</span>
                <span className="text-base font-bold tabular-nums">
                  {formatPrice(payout)}
                </span>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  등록 중...
                </>
              ) : (
                "양도 등록하기"
              )}
            </Button>
          </div>
        )}

        {/* Step 3: Success */}
        {step === "success" && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="size-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-success" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold">
                양도 등록이 완료되었습니다!
              </p>
              <p className="text-sm text-muted-foreground">
                아티스트의 양도 탭에서 등록 내역을 확인할 수 있습니다.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full mt-2">
              <Button onClick={handleViewListing}>등록 내역 보기</Button>
              <Button variant="ghost" onClick={onClose}>
                티켓 월렛으로 돌아가기
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
