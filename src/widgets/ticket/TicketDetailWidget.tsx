"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Skeleton } from "@/shared/ui/skeleton";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { Badge } from "@/shared/ui/badge";
import { useCurrentUser } from "@/features/auth/model/useCurrentUser";
import { getMyReservations } from "@/features/reservation/api/getMyReservations";
import { getEventDetail } from "@/features/event/api/getEventDetail";
import { getShows } from "@/features/show/api/getShows";

interface TicketDetailWidgetProps {
  reservationId: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} (${weekdays[d.getDay()]}) ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function parseSeat(seatId: string) {
  const parts = seatId.split("-");
  if (parts.length >= 3) {
    return {
      section: parts.slice(0, parts.length - 2).join("-"),
      row: parts[parts.length - 2],
      number: parts[parts.length - 1],
    };
  }
  return { section: seatId, row: "-", number: "-" };
}

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: "예매 완료",
  PENDING: "결제 대기",
  CANCELLED: "취소됨",
  EXPIRED: "만료됨",
  FAILED: "실패",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  CONFIRMED: "default",
  PENDING: "secondary",
  CANCELLED: "destructive",
  EXPIRED: "outline",
  FAILED: "destructive",
};

export function TicketDetailWidget({ reservationId }: TicketDetailWidgetProps) {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.userId;

  const { data: reservations, isLoading: resLoading } = useQuery({
    queryKey: ["my-reservations", userId],
    queryFn: () => getMyReservations(userId!),
    enabled: !!userId,
  });

  const reservation = useMemo(
    () => reservations?.find((r) => r.reservationId === reservationId) ?? null,
    [reservations, reservationId],
  );

  const { data: eventData, isLoading: eventLoading } = useQuery({
    queryKey: ["event-detail", reservation?.eventId],
    queryFn: () => getEventDetail(0, String(reservation!.eventId)),
    enabled: !!reservation?.eventId,
  });

  const { data: shows, isLoading: showsLoading } = useQuery({
    queryKey: ["shows", reservation?.eventId],
    queryFn: () => getShows(String(reservation!.eventId)),
    enabled: !!reservation?.eventId,
  });

  const show = useMemo(
    () => shows?.find((s) => s.showId === reservation?.showId) ?? null,
    [shows, reservation],
  );

  const ticketUrl = `${typeof window !== "undefined" ? window.location.origin : "https://urr.guru"}/tickets/${reservationId}`;
  const seat = reservation ? parseSeat(reservation.seatId) : null;

  const isLoading = !userId || resLoading || eventLoading || showsLoading;

  if (isLoading) {
    return (
      <div className="max-w-[480px] mx-auto py-10 px-4 space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="max-w-[480px] mx-auto py-16 px-4 text-center space-y-3">
        <p className="text-lg font-semibold">티켓을 찾을 수 없습니다</p>
        <p className="text-sm text-muted-foreground">
          본인 소유의 티켓이 아니거나 존재하지 않는 예매번호입니다.
        </p>
        <Button variant="ghost" onClick={() => router.push("/my-page")}>
          마이페이지로
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-[480px] mx-auto py-8 px-4 space-y-6">
      {/* 뒤로 가기 */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        뒤로 가기
      </button>

      {/* QR 카드 */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <Badge variant={STATUS_VARIANT[reservation.status] ?? "outline"}>
            {STATUS_LABEL[reservation.status] ?? reservation.status}
          </Badge>
        </div>
        <QRCodeSVG value={ticketUrl} size={220} level="M" />
        <p className="text-[11px] text-muted-foreground font-mono text-center break-all">
          {reservationId}
        </p>
      </div>

      {/* 티켓 정보 카드 */}
      <div className="bg-white rounded-xl border border-border p-5 space-y-4">
        {/* 공연 정보 */}
        <div className="space-y-1.5">
          <h2 className="font-bold text-base leading-snug">
            {eventData?.title ?? "-"}
          </h2>
          {show?.startAt && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar size={13} className="shrink-0" />
              <span>{formatDate(show.startAt)}</span>
            </div>
          )}
          {eventData?.venueTemplateName && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={13} className="shrink-0" />
              <span>{eventData.venueTemplateName}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* 좌석 정보 */}
        {seat && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              좌석
            </p>
            <p className="text-sm font-medium">
              {seat.section !== "-" ? `${seat.section}구역 ` : ""}
              {seat.row}열 {seat.number}번
            </p>
          </div>
        )}

        <Separator />

        {/* 결제 정보 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">결제 상태</span>
            <span className="font-medium">
              {reservation.paymentStatus === "SUCCESS" ? "결제 완료" : reservation.paymentStatus}
            </span>
          </div>
          {reservation.paidAt && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">결제 일시</span>
              <span className="tabular-nums">{formatDate(reservation.paidAt)}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* 예매번호 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">예매번호</span>
          <span className="text-xs font-mono tabular-nums text-right break-all max-w-[240px]">
            {reservationId}
          </span>
        </div>
      </div>

      {/* 액션 버튼 */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => router.push("/my-page")}
      >
        티켓 월렛으로
      </Button>
    </div>
  );
}
