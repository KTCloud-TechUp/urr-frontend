"use client";

import { Button } from "@/shared/ui/button";

interface TimerExpiryModalProps {
  onReturnToSections: () => void;
  onExitBooking: () => void;
}

export function TimerExpiryModal({
  onReturnToSections,
  onExitBooking,
}: TimerExpiryModalProps) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] rounded-xl bg-white shadow-lg p-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="text-4xl">⏰</span>
            <h3 className="text-lg font-bold">선택 시간이 만료되었습니다</h3>
            <p className="text-sm text-muted-foreground">
              좌석이 해제되었습니다.
            </p>
            <div className="flex gap-3 pt-2 w-full">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={onExitBooking}
              >
                예매 종료
              </Button>
              <Button className="flex-1" onClick={onReturnToSections}>
                구역 선택으로 돌아가기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
