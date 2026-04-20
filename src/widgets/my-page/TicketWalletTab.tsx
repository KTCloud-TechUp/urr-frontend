'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Ticket as TicketIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { TicketCard } from '@/shared/ui/TicketCard'
import { EmptyState } from '@/shared/ui/EmptyState'
import { QRCodeModal } from './QRCodeModal'
import { TransferListingModal } from './TransferListingModal'
import { CancelBookingDialog } from './CancelBookingDialog'
import { cancelReservation } from '@/features/booking/api/cancelReservation'
import type { Ticket, Event, TierLevel, User } from '@/shared/types'
import type { MyTransferRecord } from '@/shared/lib/mocks/my-page'

interface TicketWalletTabProps {
  tickets: (Ticket & { event: Event })[]
  cancelledTickets?: (Ticket & { event: Event })[]
  user: User
  userId?: number | string
  salesRecords?: (MyTransferRecord & { event: Event })[]
}

function getEffectiveTier(user: User, artistId: string): TierLevel {
  const membership = user.memberships.find(
    (m) => m.artistId === artistId && m.isActive,
  )
  return membership?.tier ?? user.tier
}

function normalizeSection(code: string): string {
  return code.replace(/-/g, '').toUpperCase()
}

function buildListedKeys(records: (MyTransferRecord & { event: Event })[] = []): Set<string> {
  const keys = new Set<string>()
  for (const r of records) {
    if (r.status !== 'listed') continue
    const match = r.seatInfo.match(/(\S+)열 (\S+)번/)
    if (match) {
      keys.add(`${r.section}-${match[1]}-${match[2]}`)
      keys.add(`${normalizeSection(r.section)}-${match[1]}-${match[2]}`)
    }
  }
  return keys
}

export function TicketWalletTab({ tickets, cancelledTickets = [], user, userId, salesRecords }: TicketWalletTabProps) {
  const queryClient = useQueryClient()

  const [selectedTicket, setSelectedTicket] = useState<(Ticket & { event: Event }) | null>(null)
  const [transferTicket, setTransferTicket] = useState<(Ticket & { event: Event }) | null>(null)
  const [cancelTicket, setCancelTicket] = useState<(Ticket & { event: Event }) | null>(null)
  const [optimisticListedIds, setOptimisticListedIds] = useState<Set<string>>(new Set())

  const apiListedKeys = buildListedKeys(salesRecords)

  const upcoming = tickets.filter((t) => t.isUpcoming)
  const past = tickets.filter((t) => !t.isUpcoming)

  // paymentId별 묶음 좌석 수 계산 (paymentId가 있는 경우만)
  const paymentIdCountMap = tickets.reduce<Record<number, number>>((acc, t) => {
    if (t.paymentId != null) acc[t.paymentId] = (acc[t.paymentId] ?? 0) + 1
    return acc
  }, {})

  const cancelMutation = useMutation({
    mutationFn: ({ eventId, showId, seatId }: { eventId: number; showId: number; seatId: string }) =>
      cancelReservation({ eventId, showId, seatId }, userId ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reservations', userId, 'CONFIRMED'] })
      queryClient.invalidateQueries({ queryKey: ['my-reservations', userId, 'CANCELLED'] })
      setCancelTicket(null)
      toast.success('예매가 취소되었습니다.', { description: '환불은 3~5 영업일 내 처리됩니다.' })
    },
    onError: () => {
      toast.error('예매 취소에 실패했습니다.', { description: '잠시 후 다시 시도해주세요.' })
    },
  })

  const handleListed = useCallback((ticketId: string, _: number) => {
    const ticket = tickets.find((t) => t.id === ticketId)
    setOptimisticListedIds((prev) => {
      const next = new Set(prev)
      next.add(ticketId)
      if (ticket) next.add(`${ticket.section}-${ticket.row}-${ticket.seatNumber}`)
      return next
    })
  }, [tickets])

  const handleCancelTransfer = useCallback((ticketId: string) => {
    if (window.confirm('양도 등록을 취소하시겠습니까?')) {
      setOptimisticListedIds((prev) => {
        const next = new Set(prev)
        next.delete(ticketId)
        return next
      })
    }
  }, [])

  const handleCancelBookingConfirm = useCallback((_reason: string) => {
    if (!cancelTicket) return
    if (!cancelTicket.seatId) {
      alert('좌석 정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.')
      setCancelTicket(null)
      return
    }
    cancelMutation.mutate({
      eventId: Number(cancelTicket.eventId),
      showId: Number(cancelTicket.showId),
      seatId: cancelTicket.seatId,
    })
  }, [cancelTicket, cancelMutation])

  if (tickets.length === 0 && cancelledTickets.length === 0) {
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
              {upcoming.map((ticket) => {
                const seatKey = `${ticket.section}-${ticket.row}-${ticket.seatNumber}`
                const normalizedSeatKey = `${normalizeSection(ticket.section)}-${ticket.row}-${ticket.seatNumber}`
                const isListed = optimisticListedIds.has(ticket.id) || optimisticListedIds.has(seatKey) || apiListedKeys.has(seatKey) || apiListedKeys.has(normalizedSeatKey)
                return (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    variant="upcoming"
                    isListed={isListed}
                    onViewQR={() => setSelectedTicket(ticket)}
                    onTransfer={() => setTransferTicket(ticket)}
                    onCancelTransfer={() => handleCancelTransfer(ticket.id)}
                    onCancelBooking={() => setCancelTicket(ticket)}
                  />
                )
              })}
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

        {/* Cancelled */}
        {cancelledTickets.length > 0 && (
          <section>
            <h3 className="text-base font-semibold mb-3 text-muted-foreground">취소된 예매</h3>
            <div className="space-y-3">
              {cancelledTickets.map((ticket) => (
                <div key={ticket.id} className="relative">
                  <TicketCard ticket={ticket} variant="past" />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
                    취소됨
                    {ticket.refundStatus === 'COMPLETED' && <span className="text-muted-foreground">· 환불 완료</span>}
                    {ticket.refundStatus === 'REQUESTED' && <span className="text-muted-foreground">· 환불 처리 중</span>}
                  </div>
                </div>
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
        userTier={transferTicket ? getEffectiveTier(user, transferTicket.event.artistId) : 'MIST'}
        userId={userId}
        open={!!transferTicket}
        onClose={() => setTransferTicket(null)}
        onListed={handleListed}
      />

      {/* Cancel Booking Dialog */}
      <CancelBookingDialog
        ticket={cancelTicket}
        bundleCount={cancelTicket?.paymentId != null ? (paymentIdCountMap[cancelTicket.paymentId] ?? 1) : 1}
        open={!!cancelTicket}
        isPending={cancelMutation.isPending}
        onClose={() => setCancelTicket(null)}
        onConfirm={handleCancelBookingConfirm}
      />
    </>
  )
}
