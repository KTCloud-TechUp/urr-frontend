'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/shared/ui/alert-dialog'
import { Label } from '@/shared/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import type { Ticket, Event } from '@/shared/types'

interface CancelBookingDialogProps {
  ticket: (Ticket & { event: Event }) | null
  open: boolean
  isPending: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
}

const CANCEL_REASONS = [
  { value: '단순 변심', label: '단순 변심' },
  { value: '일정 변경', label: '일정 변경' },
  { value: '중복 예매', label: '중복 예매' },
  { value: '기타', label: '기타' },
]

export function CancelBookingDialog({
  ticket,
  open,
  isPending,
  onClose,
  onConfirm,
}: CancelBookingDialogProps) {
  const [reason, setReason] = useState('')

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setReason('')
      onClose()
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>예매를 취소하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            {ticket?.event.title} 예매가 취소되며, 결제 금액이 환불됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-md bg-destructive/10 p-3 text-sm space-y-1">
            <p className="text-destructive font-medium">취소 유의사항</p>
            <p className="text-muted-foreground">• 취소 후 동일 좌석 재예매가 불가할 수 있습니다</p>
            <p className="text-muted-foreground">• 환불은 결제 수단에 따라 3~5 영업일이 소요됩니다</p>
          </div>

          <div className="space-y-2">
            <Label>취소 사유</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="사유를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {CANCEL_REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>닫기</AlertDialogCancel>
          <AlertDialogAction
            disabled={!reason || isPending}
            onClick={(e) => {
              e.preventDefault()
              onConfirm(reason)
            }}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                처리 중...
              </>
            ) : (
              '예매 취소'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
