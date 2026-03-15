"use client";

import { Button } from "@/shared/ui/button";

interface QueueLeaveModalProps {
  onStay: () => void;
  onLeave: () => void;
}

export function QueueLeaveModal({ onStay, onLeave }: QueueLeaveModalProps) {
  return (
    <div className="fixed inset-0 z-40">
      <div className="fixed inset-0 bg-black/50" onClick={onStay} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] rounded-xl bg-white shadow-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <h3 className="text-lg font-semibold">대기열 이탈</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            대기열을 이탈하면 순번이 취소됩니다.
            <br />
            나가시겠습니까?
          </p>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={onLeave}>나가기</Button>
            <Button onClick={onStay}>머무르기</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
