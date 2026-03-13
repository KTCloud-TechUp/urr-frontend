'use client'

import { useState } from 'react'
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
import { Checkbox } from '@/shared/ui/checkbox'
import { Label } from '@/shared/ui/label'

interface AccountDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AccountDeleteDialog({ open, onOpenChange }: AccountDeleteDialogProps) {
  const [confirmed, setConfirmed] = useState(false)

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setConfirmed(false)
    onOpenChange(isOpen)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말 탈퇴하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 py-2">
          <div className="rounded-md bg-destructive/10 p-3 text-sm space-y-1">
            <p className="text-destructive font-medium">탈퇴 시 유의사항</p>
            <p className="text-muted-foreground">• 모든 멤버십이 즉시 해지됩니다</p>
            <p className="text-muted-foreground">• 보유 티켓 및 양도 내역이 삭제됩니다</p>
            <p className="text-muted-foreground">• 이 작업은 되돌릴 수 없습니다</p>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="delete-confirm"
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked === true)}
            />
            <Label htmlFor="delete-confirm" className="cursor-pointer">
              위 내용을 확인했습니다
            </Label>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            disabled={!confirmed}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            탈퇴하기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
