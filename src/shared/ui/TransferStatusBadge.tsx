import { cn } from '@/shared/lib/utils'
import type { TransferStatus } from '@/shared/types'
import { TRANSFER_STATUS_LABELS } from '@/shared/types'

const statusStyles: Record<TransferStatus, string> = {
  listed: 'bg-transfer-listed/10 text-transfer-listed',
  sold: 'bg-transfer-sold/10 text-transfer-sold',
  completed: 'bg-transfer-sold/10 text-transfer-sold',
  cancelled: 'bg-muted text-muted-foreground',
}

const dotStyles: Record<TransferStatus, string> = {
  listed: 'bg-transfer-listed',
  sold: 'bg-transfer-sold',
  completed: 'bg-transfer-sold',
  cancelled: 'bg-muted-foreground',
}

interface TransferStatusBadgeProps {
  status: TransferStatus
  className?: string
}

export function TransferStatusBadge({ status, className }: TransferStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shrink-0',
        statusStyles[status],
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', dotStyles[status])} />
      {TRANSFER_STATUS_LABELS[status]}
    </span>
  )
}
