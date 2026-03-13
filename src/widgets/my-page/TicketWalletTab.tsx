'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Ticket as TicketIcon } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { TicketCard } from '@/shared/ui/TicketCard'
import { EmptyState } from '@/shared/ui/EmptyState'
import { QRCodeModal } from './QRCodeModal'
import { TransferListingModal } from './TransferListingModal'
import type { MyTransferRecord } from '@/shared/lib/mocks/my-page'
import type { Ticket, Event, TierLevel, User } from '@/shared/types'

interface TicketWalletTabProps {
  tickets: (Ticket & { event: Event })[]
  user: User
}

function getEffectiveTier(user: User, artistId: string): TierLevel {
  const membership = user.memberships.find(
    (m) => m.artistId === artistId && m.isActive,
  )
  return membership?.tier ?? user.tier
}

export function TicketWalletTab({ tickets, user }: TicketWalletTabProps) {
  const [selectedTicket, setSelectedTicket] = useState<(Ticket & { event: Event }) | null>(null)
  const [transferTicket, setTransferTicket] = useState<(Ticket & { event: Event }) | null>(null)
  const [listedTicketIds, setListedTicketIds] = useState<Set<string>>(new Set())

  const upcoming = tickets.filter((t) => t.isUpcoming)
  const past = tickets.filter((t) => !t.isUpcoming)

  const handleListed = useCallback((ticketId: string, _price: number) => {
    setListedTicketIds((prev) => new Set(prev).add(ticketId))
  }, [])

  const handleCancelTransfer = useCallback((ticketId: string) => {
    if (window.confirm('양도 등록을 취소하시겠습니까?')) {
      setListedTicketIds((prev) => {
        const next = new Set(prev)
        next.delete(ticketId)
        return next
      })
    }
  }, [])

  if (tickets.length === 0) {
    return (
      <EmptyState
        icon={TicketIcon}
        iconContainer
        title="아직 예매한 티켓이 없습니다."
        description="공연을 둘러보세요!"
        action={<Button asChild><Link href="/events">공연 찾기</Link></Button>}
      />
    )
  }

  return (
    <>
      <div className="space-y-8">
        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section>
            <h3 className="text-base font-semibold mb-3">다가오는 공연</h3>
            <div className="space-y-3">
              {upcoming.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  variant="upcoming"
                  isListed={listedTicketIds.has(ticket.id)}
                  onViewQR={() => setSelectedTicket(ticket)}
                  onTransfer={() => setTransferTicket(ticket)}
                  onCancelTransfer={() => handleCancelTransfer(ticket.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Past */}
        {past.length > 0 && (
          <section>
            <h3 className="text-base font-semibold mb-3 text-muted-foreground">지난 공연</h3>
            <div className="space-y-3">
              {past.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  variant="past"
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* QR Modal */}
      <QRCodeModal
        ticket={selectedTicket}
        open={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />

      {/* Transfer Listing Modal */}
      <TransferListingModal
        ticket={transferTicket}
        userTier={transferTicket ? getEffectiveTier(user, transferTicket.event.artistId) : 'mist'}
        open={!!transferTicket}
        onClose={() => setTransferTicket(null)}
        onListed={handleListed}
      />
    </>
  )
}
