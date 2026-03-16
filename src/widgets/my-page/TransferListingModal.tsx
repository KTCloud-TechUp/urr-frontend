'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { FaceValueBadge } from '@/shared/ui'
import { TierBadge } from '@/entities/user'
import { formatPrice, formatDateFull, formatNumberWithComma } from '@/shared/lib/format'
import type { Ticket, Event, TierLevel } from '@/shared/types'

interface TransferListingModalProps {
  ticket: (Ticket & { event: Event }) | null
  userTier: TierLevel
  open: boolean
  onClose: () => void
  onListed: (ticketId: string, price: number) => void
}

type Step = 'price-input' | 'fee-preview' | 'success'

function getFeeRate(tier: TierLevel): number {
  return tier === 'lightning' || tier === 'thunder' ? 0.05 : 0.10
}

function parseNumber(str: string): number {
  return Number(str.replace(/,/g, '')) || 0
}

export function TransferListingModal({ ticket, userTier, open, onClose, onListed }: TransferListingModalProps) {
  const router = useRouter()
  const [step, setStep] = useState<Step>('price-input')
  const [priceStr, setPriceStr] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset state when ticket changes or modal opens
  const prevOpenRef = useRef(false)
  if (open && ticket && !prevOpenRef.current) {
    setStep('price-input')
    setPriceStr(formatNumberWithComma(ticket.price))
    setIsSubmitting(false)
  }
  prevOpenRef.current = open

  if (!ticket) return null

  const faceValue = ticket.price
  const price = parseNumber(priceStr)
  const floor = Math.round(faceValue * 0.5)
  const cap = Math.round(faceValue * 1.5)
  const recMin = Math.round(faceValue * 0.9)
  const recMax = Math.round(faceValue * 1.1)
  const percentage = faceValue > 0 ? Math.round((price / faceValue) * 100) : 0

  // Validation
  const isBelowFloor = price > 0 && price < floor
  const isAboveCap = price > cap
  const isHighWarning = price > faceValue * 1.3 && price <= cap
  const hasError = isBelowFloor || isAboveCap || price <= 0

  const errorMessage = isBelowFloor
    ? `최소 가격은 ${formatPrice(floor)}입니다`
    : isAboveCap
      ? `최대 가격은 ${formatPrice(cap)}입니다`
      : ''

  // Fee calculation
  const feeRate = getFeeRate(userTier)
  const feeAmount = Math.round(price * feeRate)
  const payout = price - feeAmount
  const feePercent = Math.round(feeRate * 100)

  // Date formatting
  const firstDate = ticket.event.dates[0]?.date ?? ''
  const dateStr = firstDate ? formatDateFull(firstDate) : ''

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    if (!raw) {
      setPriceStr('')
      return
    }
    setPriceStr(formatNumberWithComma(Number(raw)))
  }

  function handleNext() {
    if (!hasError && price > 0) {
      setStep('fee-preview')
    }
  }

  function handleSubmit() {
    setIsSubmitting(true)
    setTimeout(() => {
      onListed(ticket!.id, price)
      setIsSubmitting(false)
      setStep('success')
    }, 1000)
  }

  function handleViewListing() {
    onClose()
    router.push(`/artists/${ticket!.event.artistId}`)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {step === 'success' ? '양도 등록 완료' : '양도 등록'}
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Price Input */}
        {step === 'price-input' && (
          <div className="space-y-5 py-2">
            {/* Ticket info */}
            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
              <h4 className="font-semibold text-sm line-clamp-1">{ticket.event.title}</h4>
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
            </div>

            {/* Price input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">양도 가격</label>
              <div className="relative">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                  원
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={priceStr}
                  onChange={handlePriceChange}
                  className={`h-12 w-full rounded-xl border bg-card pl-4 pr-10 text-sm font-semibold tabular-nums outline-none transition-colors ${
                    hasError && price > 0
                      ? 'border-danger focus:ring-2 focus:ring-danger/30'
                      : 'border-border focus:ring-2 focus:ring-primary/30'
                  }`}
                />
              </div>

              {/* Error message */}
              {errorMessage && (
                <p className="text-xs text-danger font-medium">{errorMessage}</p>
              )}

              {/* High price warning */}
              {isHighWarning && (
                <div className="flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-2">
                  <AlertTriangle size={14} className="text-warning shrink-0" />
                  <p className="text-xs text-warning font-medium">
                    정가의 130%를 초과하는 등록은 검토 대상입니다
                  </p>
                </div>
              )}

              {/* Recommended range */}
              <p className="text-xs text-muted-foreground">
                권장 가격: {formatPrice(recMin)} ~ {formatPrice(recMax)}
              </p>

              {/* Face value comparison */}
              {price > 0 && (
                <div className="flex items-center gap-2">
                  <FaceValueBadge percentage={percentage} />
                </div>
              )}
            </div>

            <Button
              className="w-full"
              disabled={hasError || price <= 0}
              onClick={handleNext}
            >
              다음
            </Button>
          </div>
        )}

        {/* Step 2: Fee Preview */}
        {step === 'fee-preview' && (
          <div className="space-y-5 py-2">
            {/* Ticket summary */}
            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-1">
              <h4 className="font-semibold text-sm line-clamp-1">{ticket.event.title}</h4>
              <p className="text-sm text-muted-foreground">
                {ticket.section} {ticket.row}열 {ticket.seatNumber}번
              </p>
            </div>

            {/* Fee breakdown */}
            <div className="space-y-3 rounded-lg border border-border p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">양도 가격</span>
                <span className="font-semibold tabular-nums">{formatPrice(price)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <TierBadge tier={userTier} size="sm" />
                  수수료 ({feePercent}%)
                </span>
                <span className="font-semibold tabular-nums text-danger">-{formatPrice(feeAmount)}</span>
              </div>
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="text-sm font-semibold">예상 수령액</span>
                <span className="text-base font-bold tabular-nums">{formatPrice(payout)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setStep('price-input')}
                disabled={isSubmitting}
              >
                이전
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    등록 중...
                  </>
                ) : (
                  '등록하기'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="size-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-success" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold">양도 등록이 완료되었습니다!</p>
              <p className="text-sm text-muted-foreground">
                아티스트의 양도 탭에서 등록 내역을 확인할 수 있습니다.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full mt-2">
              <Button onClick={handleViewListing}>
                등록 내역 보기
              </Button>
              <Button variant="ghost" onClick={onClose}>
                티켓 월렛으로 돌아가기
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
