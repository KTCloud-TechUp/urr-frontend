"use client";

import { CircleAlert } from "lucide-react";
import { BookingProvider, useBooking } from "@/features/booking/model/BookingContext";
import { Button } from "@/shared/ui/button";
import { LeftPanel } from "./LeftPanel";
import { RightMain } from "./RightMain";
import { BookingModal } from "./BookingModal";

function PaymentFailedModal() {
  const { paymentFailed, clearPaymentFailed } = useBooking();

  if (!paymentFailed) return null;

  const handleClose = () => {
    clearPaymentFailed();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] rounded-xl bg-white shadow-lg p-8 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col items-center gap-4 text-center">
            <CircleAlert size={48} className="text-destructive" />
            <h3 className="text-lg font-bold">결제에 실패했습니다</h3>
            <p className="text-sm text-muted-foreground">
              결제 처리 중 오류가 발생했습니다.
              <br />
              다시 예매를 시도해주세요.
            </p>
            <Button className="w-full mt-2" onClick={handleClose}>
              확인
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingWidgetInner() {
  const { bookingState } = useBooking();
  return (
    <div className="flex h-full">
      <LeftPanel />
      <RightMain />
      <PaymentFailedModal />
      {bookingState === "queue" && <BookingModal />}
    </div>
  );
}

interface BookingWidgetProps {
  eventId: string;
}

export function BookingWidget({ eventId }: BookingWidgetProps) {
  return (
    <BookingProvider eventId={eventId}>
      <BookingWidgetInner />
    </BookingProvider>
  );
}
