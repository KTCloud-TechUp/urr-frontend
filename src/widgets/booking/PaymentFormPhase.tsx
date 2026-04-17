"use client";

import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { cn } from "@/shared/lib/utils";
import { formatPrice, formatDateDot } from "@/shared/lib/format";
import { PAYMENT_METHODS } from "@/shared/lib/constants";
import type { PaymentMethod } from "@/shared/lib/constants";
import type { BookingEvent } from "@/features/booking/model/BookingContext";
import type { EventDate } from "@/shared/types";

interface PaymentFormPhaseProps {
  event: BookingEvent | null;
  selectedDate: EventDate | null;
  seatDisplayNames: string[];
  hasUserTierWindow: boolean;
  subtotal: number;
  feeTotal: number;
  total: number;
  // Form state
  buyerName: string;
  buyerPhone: string;
  selectedMethod: PaymentMethod;
  termsAgreed: boolean;
  isFormValid: boolean;
  // Handlers
  onBack: () => void;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onMethodChange: (method: PaymentMethod) => void;
  onToggleTerms: () => void;
  onSubmit: () => Promise<void>;
}

export function PaymentFormPhase({
  event,
  selectedDate,
  seatDisplayNames,
  hasUserTierWindow,
  subtotal,
  feeTotal,
  total,
  buyerName,
  buyerPhone,
  selectedMethod,
  termsAgreed,
  isFormValid,
  onBack,
  onNameChange,
  onPhoneChange,
  onMethodChange,
  onToggleTerms,
  onSubmit,
}: PaymentFormPhaseProps) {
  return (
    <div className="fixed inset-0 z-40">
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[680px] rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-1 rounded-md hover:bg-accent transition-colors"
              >
                <ArrowLeft size={18} className="text-muted-foreground" />
              </button>
              <h2 className="text-lg font-bold">주문 결제</h2>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="flex-1 overflow-y-auto flex min-h-0">
            {/* Left: Form */}
            <div className="flex-1 px-6 py-5 space-y-6 overflow-y-auto border-r border-border">
              {/* Buyer info */}
              <div>
                <h3 className="text-sm font-bold mb-3">주문자 정보</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">
                        이름 *
                      </label>
                      <input
                        type="text"
                        value={buyerName}
                        onChange={(e) => onNameChange(e.target.value)}
                        placeholder="성함을 입력하세요"
                        className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">
                        전화번호 *
                      </label>
                      <input
                        type="text"
                        value={buyerPhone}
                        onChange={(e) => onPhoneChange(e.target.value)}
                        placeholder="010-0000-0000"
                        className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                        maxLength={13}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment method */}
              <div>
                <h3 className="text-sm font-bold mb-3">결제 수단</h3>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => onMethodChange(method.id)}
                      className={cn(
                        "h-11 px-3 rounded-lg border text-sm font-medium transition-all",
                        selectedMethod === method.id
                          ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                          : "border-border bg-white text-foreground hover:bg-muted/50",
                      )}
                    >
                      {method.color ? (
                        <span
                          style={{
                            color:
                              method.id === "kakao" ? "#000" : method.color,
                          }}
                        >
                          {method.label}
                        </span>
                      ) : (
                        method.label
                      )}
                    </button>
                  ))}
                </div>

                {selectedMethod === "card" && (
                  <p className="text-xs text-muted-foreground mt-3">
                    결제하기 버튼을 누르면 카드사 결제 창이 열립니다.
                  </p>
                )}
                {selectedMethod !== "card" && (
                  <p className="text-xs text-muted-foreground mt-3">
                    결제하기 버튼을 누르면{" "}
                    {PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label}{" "}
                    결제 창이 열립니다.
                  </p>
                )}
              </div>

              <Separator />

              {/* Terms agreement */}
              <div>
                <button
                  onClick={onToggleTerms}
                  className="flex items-center gap-2 group"
                >
                  <span
                    className={cn(
                      "size-5 rounded border flex items-center justify-center transition-colors shrink-0",
                      termsAgreed
                        ? "bg-primary border-primary"
                        : "border-border group-hover:border-muted-foreground",
                    )}
                  >
                    {termsAgreed && <Check size={14} className="text-white" />}
                  </span>
                  <span className="text-sm text-foreground">
                    [필수] 결제 서비스 이용 약관, 개인정보 처리 동의
                  </span>
                </button>
              </div>
            </div>

            {/* Right: Order summary */}
            <div className="w-[240px] shrink-0 px-5 py-5 bg-muted/30">
              <h3 className="text-sm font-bold mb-3">주문 상품</h3>

              {/* Event info */}
              <div className="mb-3">
                <p className="text-sm font-semibold leading-snug">
                  {event?.title}
                </p>
                {selectedDate && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {formatDateDot(selectedDate.date)}
                  </p>
                )}
              </div>

              {/* Seat list */}
              <div className="space-y-1 mb-4">
                {seatDisplayNames.map((name, i) => (
                  <p key={i} className="text-xs text-muted-foreground">
                    {name}
                  </p>
                ))}
              </div>

              <Separator className="mb-3" />

              {/* Price breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">티켓</span>
                  <span className="tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                {hasUserTierWindow && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">수수료</span>
                    <span className="tabular-nums">{formatPrice(feeTotal)}</span>
                  </div>
                )}
              </div>

              <Separator className="my-3" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">총액</span>
                <span className="text-lg font-bold tabular-nums text-primary">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="px-6 py-4 border-t border-border shrink-0">
            <Button
              className="w-full"
              size="lg"
              disabled={!isFormValid}
              onClick={onSubmit}
            >
              {formatPrice(total)} 결제하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
