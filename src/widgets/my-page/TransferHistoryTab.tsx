'use client'

import { useState } from 'react'
import { ArrowLeftRight, Calendar, Pencil, X } from 'lucide-react'
import { TransferStatusBadge } from '@/shared/ui/TransferStatusBadge'
import { PriceDisplay } from '@/shared/ui/PriceDisplay'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { formatPrice } from '@/shared/lib/format'
import type { MyTransferRecord } from '@/shared/lib/mocks/my-page'
import type { Event } from '@/shared/types'

// ── Edit Modal ──────────────────────────────────────────

interface TransferEditModalProps {
  record: (MyTransferRecord & { event: Event }) | null
  open: boolean
  onClose: () => void
  onSave: (id: string, newPrice: number) => void
}

function TransferEditModal({ record, open, onClose, onSave }: TransferEditModalProps) {
  const [price, setPrice] = useState('')
  const [saving, setSaving] = useState(false)

  function handleOpen() {
    if (record) setPrice(String(record.price))
  }

  function handleSave() {
    if (!record) return
    const newPrice = parseInt(price, 10)
    if (isNaN(newPrice) || newPrice <= 0) return
    setSaving(true)
    setTimeout(() => {
      onSave(record.id, newPrice)
      setSaving(false)
      onClose()
    }, 500)
  }

  const faceValue = record?.faceValue ?? 0
  const numPrice = parseInt(price, 10) || 0
  const fee = Math.round(numPrice * 0.05)
  const payout = numPrice - fee

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); else handleOpen() }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>양도 정보 수정</DialogTitle>
        </DialogHeader>

        {record && (
          <div className="space-y-5 pt-2">
            {/* Event info */}
            <div className="rounded-lg bg-muted/50 p-3 space-y-1">
              <p className="text-sm font-semibold">{record.event.title}</p>
              <p className="text-xs text-muted-foreground">{record.section} · {record.seatInfo}</p>
            </div>

            {/* Price input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">양도 가격</label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="가격을 입력하세요"
              />
              <p className="text-xs text-muted-foreground">
                정가: {formatPrice(faceValue)}
              </p>
            </div>

            {/* Price breakdown */}
            {numPrice > 0 && (
              <div className="rounded-lg border border-border p-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">양도가</span>
                  <span className="font-medium">{formatPrice(numPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">플랫폼 수수료 (5%)</span>
                  <span className="text-red-500">-{formatPrice(fee)}</span>
                </div>
                <div className="border-t border-border pt-1.5 flex justify-between">
                  <span className="font-medium">예상 정산금</span>
                  <span className="font-bold">{formatPrice(payout)}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                취소
              </Button>
              <Button
                className="flex-1"
                disabled={numPrice <= 0 || saving}
                onClick={handleSave}
              >
                {saving ? '저장 중...' : '수정 완료'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ── Cancel Confirm Dialog ────────────────────────────────

interface TransferCancelDialogProps {
  record: (MyTransferRecord & { event: Event }) | null
  open: boolean
  onClose: () => void
  onConfirm: (id: string) => void
}

function TransferCancelDialog({ record, open, onClose, onConfirm }: TransferCancelDialogProps) {
  const [cancelling, setCancelling] = useState(false)

  function handleConfirm() {
    if (!record) return
    setCancelling(true)
    setTimeout(() => {
      onConfirm(record.id)
      setCancelling(false)
      onClose()
    }, 500)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>양도 등록 취소</DialogTitle>
        </DialogHeader>

        {record && (
          <div className="space-y-5 pt-2">
            <div className="rounded-lg bg-muted/50 p-3 space-y-1">
              <p className="text-sm font-semibold">{record.event.title}</p>
              <p className="text-xs text-muted-foreground">{record.section} · {record.seatInfo}</p>
              <p className="text-xs text-muted-foreground">등록가: {formatPrice(record.price)}</p>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              양도 등록을 취소하시겠습니까? 취소 후에는 다시 등록해야 합니다.
            </p>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                돌아가기
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                disabled={cancelling}
                onClick={handleConfirm}
              >
                {cancelling ? '취소 중...' : '등록 취소'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ── Individual transfer record card ──────────────────────

interface TransferHistoryCardProps {
  record: MyTransferRecord & { event: Event }
  onEdit?: (record: MyTransferRecord & { event: Event }) => void
  onCancel?: (record: MyTransferRecord & { event: Event }) => void
}

function TransferHistoryCard({ record, onEdit, onCancel }: TransferHistoryCardProps) {
  const firstDate = record.event.dates[0]?.date ?? ''
  const dateStr = firstDate
    ? new Date(firstDate).toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      })
    : ''

  const netPayout = record.price - record.platformFee
  const isListed = record.status === 'listed' && record.role === 'seller'

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      {/* Header: event + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold line-clamp-1">{record.event.title}</h4>
          <div className="flex items-center gap-1.5 mt-1 text-[13px] text-muted-foreground">
            <Calendar size={12} />
            <span>{dateStr}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <TransferStatusBadge status={record.status} />
          {isListed && (
            <>
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-xs gap-1"
                  onClick={() => onEdit(record)}
                >
                  <Pencil size={12} />
                  수정
                </Button>
              )}
              {onCancel && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-xs gap-1 text-destructive hover:text-destructive"
                  onClick={() => onCancel(record)}
                >
                  <X size={12} />
                  취소
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Seat info */}
      <p className="text-sm font-medium">{record.section} · {record.seatInfo}</p>

      {/* Price breakdown */}
      <div className="flex items-center gap-4 text-sm">
        {record.role === 'seller' ? (
          <>
            <div>
              <span className="text-muted-foreground">등록가: </span>
              <PriceDisplay amount={record.price} size="sm" />
            </div>
            <div>
              <span className="text-muted-foreground">수수료: </span>
              <span className="text-sm font-medium text-red-500">-{formatPrice(record.platformFee)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">정산금: </span>
              <span className="text-sm font-semibold">{formatPrice(netPayout)}</span>
            </div>
          </>
        ) : (
          <>
            <div>
              <span className="text-muted-foreground">구매가: </span>
              <PriceDisplay amount={record.price} size="sm" />
            </div>
            {record.counterpartyName && (
              <div>
                <span className="text-muted-foreground">판매자: </span>
                <span className="text-sm font-medium">{record.counterpartyName}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Date */}
      <p className="text-xs text-muted-foreground">
        {new Date(record.createdAt).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })}
      </p>
    </div>
  )
}

// ── Tab content ──────────────────────────────────────────

interface TransferHistoryTabProps {
  records: (MyTransferRecord & { event: Event })[]
}

export function TransferHistoryTab({ records }: TransferHistoryTabProps) {
  const [editTarget, setEditTarget] = useState<(MyTransferRecord & { event: Event }) | null>(null)
  const [cancelTarget, setCancelTarget] = useState<(MyTransferRecord & { event: Event }) | null>(null)
  const [localRecords, setLocalRecords] = useState(records)

  const sellerRecords = localRecords.filter((r) => r.role === 'seller')
  const buyerRecords = localRecords.filter((r) => r.role === 'buyer')

  function handleSave(id: string, newPrice: number) {
    setLocalRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, price: newPrice, platformFee: Math.round(newPrice * 0.05) }
          : r,
      ),
    )
  }

  function handleCancel(id: string) {
    setLocalRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'cancelled' as const } : r,
      ),
    )
  }

  if (localRecords.length === 0) {
    return <EmptyState icon={ArrowLeftRight} iconContainer title="양도 내역이 없습니다." />
  }

  return (
    <>
      <div className="space-y-8">
        {/* Sold */}
        {sellerRecords.length > 0 && (
          <section>
            <h3 className="text-base font-semibold mb-3">판매 내역</h3>
            <div className="space-y-3">
              {sellerRecords.map((r) => (
                <TransferHistoryCard key={r.id} record={r} onEdit={setEditTarget} onCancel={setCancelTarget} />
              ))}
            </div>
          </section>
        )}

        {/* Purchased */}
        {buyerRecords.length > 0 && (
          <section>
            <h3 className="text-base font-semibold mb-3">구매 내역</h3>
            <div className="space-y-3">
              {buyerRecords.map((r) => (
                <TransferHistoryCard key={r.id} record={r} />
              ))}
            </div>
          </section>
        )}
      </div>

      <TransferEditModal
        record={editTarget}
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSave={handleSave}
      />

      <TransferCancelDialog
        record={cancelTarget}
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
      />
    </>
  )
}
