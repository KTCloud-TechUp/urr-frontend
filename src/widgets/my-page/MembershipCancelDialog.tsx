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

interface MembershipCancelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  artistName: string
  onConfirm: (reason: string) => void
  isProcessing: boolean
}

export function MembershipCancelDialog({
  open,
  onOpenChange,
  artistName,
  onConfirm,
  isProcessing,
}: MembershipCancelDialogProps) {
  const [reason, setReason] = useState('')

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setReason('')
    onOpenChange(isOpen)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>멤버십을 해지하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            {artistName} 멤버십을 해지하면 다음 혜택이 소멸됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-2">
          {/* Consequences warning */}
          <div className="rounded-md bg-destructive/10 p-3 text-sm space-y-1">
            <p className="text-destructive font-medium">해지 시 유의사항</p>
            <p className="text-muted-foreground">• 양도 마켓 이용이 불가합니다</p>
            <p className="text-muted-foreground">• 티어 혜택이 소멸됩니다</p>
            <p className="text-muted-foreground">• 선예매 우선권이 사라집니다</p>
          </div>

          {/* Reason select */}
          <div className="space-y-2">
            <Label>해지 사유</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="사유를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inactive">더 이상 활동하지 않음</SelectItem>
                <SelectItem value="cost">비용 부담</SelectItem>
                <SelectItem value="dissatisfied">서비스 불만족</SelectItem>
                <SelectItem value="other">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>취소</AlertDialogCancel>
          <AlertDialogAction
            disabled={!reason || isProcessing}
            onClick={(e) => {
              e.preventDefault()
              onConfirm(reason)
            }}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isProcessing ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                처리 중...
              </>
            ) : (
              '해지하기'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
