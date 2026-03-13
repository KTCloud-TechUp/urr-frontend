'use client'

import { QRCodeSVG } from 'qrcode.react'
import { Calendar, MapPin } from 'lucide-react'
import { formatDateFull } from '@/shared/lib/format'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import type { Ticket, Event } from '@/shared/types'

interface QRCodeModalProps {
  ticket: (Ticket & { event: Event }) | null
  open: boolean
  onClose: () => void
}

export function QRCodeModal({ ticket, open, onClose }: QRCodeModalProps) {
  if (!ticket) return null

  const firstDate = ticket.event.dates[0]?.date ?? ''
  const dateStr = firstDate ? formatDateFull(firstDate) : ''

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">입장 QR 코드</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {/* QR Code */}
          <div className="p-4 bg-white rounded-xl border border-border">
            <QRCodeSVG
              value={ticket.qrCode}
              size={280}
              level="M"
              includeMargin={false}
            />
          </div>

          {/* Event info */}
          <div className="w-full space-y-2 text-center">
            <h3 className="text-lg font-semibold">{ticket.event.title}</h3>
            <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <Calendar size={14} />
              <span>{dateStr}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={14} />
              <span>{ticket.event.venue}</span>
            </div>
            <p className="text-base font-medium pt-1">
              {ticket.section} {ticket.row}열 {ticket.seatNumber}번
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
