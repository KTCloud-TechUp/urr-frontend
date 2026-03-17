import Image from 'next/image'
import { cn } from '@/shared/lib/utils'
import { Calendar, MapPin, QrCode, ArrowLeftRight, XCircle } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { PriceDisplay } from '@/shared/ui/PriceDisplay'
import { TransferStatusBadge } from '@/shared/ui/TransferStatusBadge'
import { getArtistGradient } from '@/shared/lib/mocks/home'
import { formatDateShort } from '@/shared/lib/format'
import type { Ticket, Event } from '@/shared/types'

interface TicketCardProps {
  ticket: Ticket & { event: Event }
  variant?: 'upcoming' | 'past'
  isListed?: boolean
  onViewQR?: () => void
  onTransfer?: () => void
  onCancelTransfer?: () => void
  className?: string
}

export function TicketCard({ ticket, variant = 'upcoming', isListed, onViewQR, onTransfer, onCancelTransfer, className }: TicketCardProps) {
  const firstDate = ticket.event.dates[0]?.date ?? ''
  const dateStr = firstDate ? formatDateShort(firstDate) : ''

  return (
    <div className={cn(
      'flex gap-4 rounded-lg border border-border bg-card p-4',
      variant === 'past' && 'opacity-60',
      className,
    )}>
      <div className="w-[80px] h-[112px] rounded-lg bg-muted shrink-0 overflow-hidden relative">
        {ticket.event.poster ? (
          <Image src={ticket.event.poster} alt={ticket.event.title} fill className="object-cover" />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium"
            style={{ background: getArtistGradient(ticket.event.artistId) }}
          >
            {ticket.event.title.split(' ')[0]}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 space-y-1.5">
        <h4 className="text-base font-semibold line-clamp-1">{ticket.event.title}</h4>
        <div className="flex items-center gap-1 text-[13px] text-muted-foreground">
          <Calendar size={12} />
          <span>{dateStr}</span>
        </div>
        <div className="flex items-center gap-1 text-[13px] text-muted-foreground">
          <MapPin size={12} />
          <span>{ticket.event.venue}</span>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{ticket.section} {ticket.row}열 {ticket.seatNumber}번</p>
          {isListed && <TransferStatusBadge status="listed" />}
        </div>
        <PriceDisplay amount={ticket.price} size="sm" />
      </div>
      {variant === 'upcoming' && (
        <div className="flex flex-col gap-2 shrink-0">
          <Button size="sm" onClick={onViewQR}>
            <QrCode size={14} />
            QR 보기
          </Button>
          {ticket.isTransferable && !isListed && (
            <Button size="sm" variant="outline" onClick={onTransfer}>
              <ArrowLeftRight size={14} />
              양도 등록
            </Button>
          )}
          {isListed && (
            <Button size="sm" variant="outline" className="text-danger border-danger/30 hover:bg-danger/10 hover:text-danger" onClick={onCancelTransfer}>
              <XCircle size={14} />
              양도 취소
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
