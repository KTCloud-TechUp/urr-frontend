'use client'

import { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, Check, CreditCard } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { cn } from '@/shared/lib/utils'
import { formatPrice } from '@/shared/lib/format'
import { PAYMENT_METHODS } from '@/shared/lib/constants'
import { usePaymentForm } from '@/shared/lib/usePaymentForm'
import { PaymentProcessingOverlay } from '@/shared/ui/PaymentProcessingOverlay'

type Phase = 'form' | 'processing'

interface OrderItem {
  label: string
  amount: number
}

interface PaymentDialogProps {
  open: boolean
  title: string
  orderItems: OrderItem[]
  totalAmount: number
  onComplete: () => void
  onCancel: () => void
  /** Optional extra info displayed below order items */
  orderDescription?: string
}

export function PaymentDialog({
  open,
  title,
  orderItems,
  totalAmount,
  onComplete,
  onCancel,
  orderDescription,
}: PaymentDialogProps) {
  const [phase, setPhase] = useState<Phase>('form')
  const {
    buyerName, buyerPhone, selectedMethod, termsAgreed, isFormValid,
    handleNameChange, handlePhoneChange, setSelectedMethod, toggleTerms, resetForm,
  } = usePaymentForm()

  const handleSubmit = useCallback(() => {
    setPhase('processing')
    setTimeout(() => {
      onComplete()
    }, 1500)
  }, [onComplete])

  const handleCancel = useCallback(() => {
    resetForm()
    setPhase('form')
    onCancel()
  }, [onCancel, resetForm])

  if (!open) return null

  if (phase === 'processing') {
    return createPortal(<PaymentProcessingOverlay />, document.body)
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" onClick={handleCancel} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[680px] rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{title}</h2>
              <button
                onClick={handleCancel}
                className="p-1.5 rounded-md hover:bg-accent transition-colors cursor-pointer"
              >
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="flex-1 overflow-y-auto flex min-h-0">
            {/* Left: Form */}
            <div className="flex-1 px-6 py-5 space-y-6 overflow-y-auto border-r border-border">
              {/* Buyer info */}
              <div>
                <h3 className="text-sm font-bold mb-3">주문자 정보</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">이름 *</label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="성함을 입력하세요"
                      className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">전화번호 *</label>
                    <input
                      type="text"
                      value={buyerPhone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="010-0000-0000"
                      className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                      maxLength={13}
                    />
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
                      onClick={() => setSelectedMethod(method.id)}
                      className={cn(
                        'h-11 px-3 rounded-lg border text-sm font-medium transition-all cursor-pointer',
                        selectedMethod === method.id
                          ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                          : 'border-border bg-white text-foreground hover:bg-muted/50',
                      )}
                    >
                      {method.color ? (
                        <span style={{ color: method.id === 'kakao' ? '#000' : method.color }}>
                          {method.label}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1.5">
                          <CreditCard size={14} />
                          {method.label}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  결제하기 버튼을 누르면 {PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label} 결제 창이 열립니다.
                </p>
              </div>

              <Separator />

              {/* Terms agreement */}
              <div>
                <button
                  onClick={toggleTerms}
                  className="flex items-center gap-2 group cursor-pointer"
                >
                  <span
                    className={cn(
                      'size-5 rounded border flex items-center justify-center transition-colors shrink-0',
                      termsAgreed
                        ? 'bg-primary border-primary'
                        : 'border-border group-hover:border-muted-foreground',
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
              <h3 className="text-sm font-bold mb-3">주문 내용</h3>

              {orderDescription && (
                <p className="text-sm font-semibold leading-snug mb-3">{orderDescription}</p>
              )}

              <div className="space-y-2 mb-4">
                {orderItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="tabular-nums">{formatPrice(item.amount)}</span>
                  </div>
                ))}
              </div>

              <Separator className="mb-3" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">총액</span>
                <span className="text-lg font-bold tabular-nums text-primary">
                  {formatPrice(totalAmount)}
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
              onClick={handleSubmit}
            >
              {formatPrice(totalAmount)} 결제하기
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
